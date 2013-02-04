<?php namespace App\Controllers\Api\Frontend;

use OrderModel;
use Input;

/**
* 
*/
class OrderIndexController extends ApiController
{


	public function index()
	{
		$this->loadStoreModel();

		$page = Input::get('page');
		$pageSize = 50;
		$offset = $page * $pageSize;
		
		$ordersCollection = $this->storeModel->ordersCollection()
												->with('addressModel')
												->orderBy('id', 'desc')
												->skip($offset)
												->take($pageSize)
												->get();

		return $ordersCollection->toJson(JSON_NUMERIC_CHECK);

	}


}