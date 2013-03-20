<?php namespace App\Controllers\Api\Frontend\Authentification;

use Input;
use Request;
use Validator;
use Hash;
use Cache;
use App\Models\ClientModel;


class LoginController extends ApiController
{

    // number of how many failed attempts are allowed
	private $limitOfFailedAttempts = 5;

    // periode how long a token is valid
    private $periodOfValidity = 4320; // 3 days

    /**
     * Logs in a user and stores the generated token in the cache
     * 
     * @return Response
     */
    public function route()
    {   
        // validate input
    	$number = Input::get('number');
    	$password = Input::get('password');

    	$input = array(
    		'number'	=> $number,
    		'password'	=> $password
    		);

    	$rules = array(
    		'number'	=> 'numeric|between:1000,9999|required',
    		'password'	=> 'min:8|required'
    		);

    	$validator = Validator::make($input, $rules);

    	if ($validator->fails()) {
    		$this->throwException();
    	}



        // check for failed attempts
    	$ip = Request::getClientIp();
    	$cacheKey = 'attempt_' . $number . '_from_' . $ip;
    	$numberOfFailedAttempts = Cache::get($cacheKey, 0);

    	if ($numberOfFailedAttempts >= $this->limitOfFailedAttempts) {

    		$exponentialWaitingTime = (int) pow(1.5, $numberOfFailedAttempts);
    		Cache::put($cacheKey, $numberOfFailedAttempts, $exponentialWaitingTime);

    		return $this->respondWithStatus(429);
    	}


        // search client
    	$clientModel = ClientModel::where('number', $number)->first();

        $this->checkModelFound($clientModel);

        // check password
    	$passwordMatched = Hash::check($password, $clientModel->hashedPassword);

    	if (!$passwordMatched) {
            // cache failed attempt to prevent brute forcing
    		$numberOfFailedAttempts++;
    		Cache::put($cacheKey, $numberOfFailedAttempts, 1);

    		$this->throwException();
    	}



        // create, cache and return token
        $token = md5(uniqid($clientModel->id, true)); // token is unique

        // use token as key and client model id as value
        Cache::put($token, $clientModel->id, $this->periodOfValidity);


        $responseArray = array('token' => $token);

        return json_encode($responseArray);

    }


}