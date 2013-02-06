<?php namespace App\Controllers\Api\Frontend;

use Controller;
use Request;
use App;
use StoreModel;
use Validator;


/**
* 
*/
class ApiController extends Controller
{
	protected $storeModel;

	/**
	 * Checks if store exists and sets store as property
	 * 
	 * @return void
	 */
	protected function loadStoreModel()
	{
		$storeAlias = Request::segment(4);
		$this->storeModel = StoreModel::where('alias', $storeAlias)->first();

    	if ($this->storeModel == null) {
    		$this->error(404);
    	}
	}

	protected function error($errorCode, $message = null) {
		App::abort($errorCode, $message);
	}

	/**
	 * verify!
	 * 
	 * @return boolean
	 */
	protected function isAuthenicatedClient()
	{
		return true;
	}

<<<<<<< HEAD
	protected function af()
	{
		$this->afterFilter(function($response) {
			$response->headers->set('Access-Control-Allow-Origin', 'http://backend.sub2home.dev');
			$response->headers->set('Access-Control-Allow-Credentials', 'true');
			$response->headers->set('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, HEAD, OPTIONS');
			$response->headers->set('Access-Control-Allow-Headers', 'Content-Type');
		});
	}

}
=======
	/**
	 * Catch-all method for requests that can't be matched.
	 *
	 * @param  string    $method
	 * @param  array     $parameters
	 * @return Response
	 */
	public function __call($method, $parameters)
	{
		// return App::abort(404);
	}

}

Validator::extend('boolean', function($attribute, $value, $parameters)
{
    return is_bool($value) || is_numeric($value);
});
>>>>>>> 323a67f6bfa68f59cb813703b4ea09d3041d85cf
