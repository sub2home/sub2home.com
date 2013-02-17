<?php namespace App\Tests\Controllers\Api\Frontend;

use App\Tests\TestCase;

use Hash;
use URL;

use App\Models\ClientModel;


class AuthentificationControllerTest extends TestCase {

	public function testLoginShouldBeSuccessful()
	{
		$loginFormData = array(
			'number' => 1,
			'password' => 'hallo'
			);
		// $secureUrl = URL::secure('api/frontend/login');
		// $response = $this->call('POST', 'https://sub2home.dev/api/frontend/login', $loginFormData);


		// $token = $response->getContent();


	}


	protected function seedDatabase()
	{
		$clientModel = new ClientModel(array(
			'number' => 1,
			'password' => Hash::make('haallo'),
			'email' => 'client@test.de'
			));
		$clientModel->save();
		$clientModel->addressModel()->create(array());

	}

}