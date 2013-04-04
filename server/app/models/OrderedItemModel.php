<?php namespace App\Models;

/**
 * Ordered Menu class
 *
 * An orderd menu
 */
class OrderedItemModel extends BaseModel
{

	public $timestamps = false;

	protected $table = 'ordered_item_models';

	protected $hidden = array(
		'menu_bundle_model_id',
		'menu_upgrade_model_id',
		'order_model_id'
		);

	public function __construct(array $attributes = array())
	{
		parent::__construct();


		// TODO: remove
		// set up relations
		$this->setRelation('menuBundleModel', null);
		$this->setRelation('menuUpgradeModel', null);
	}

	public function delete()
	{
		$this->throwException('Can not delete an ordered item');
	}

	/**
	 * Returns the menu bundle
	 * 
	 * @return object
	 */
	private function menuBundleModel()
	{
		return $this->belongsTo('App\\Models\\MenuBundleModel');
	}

	/**
	 * Returns the menu upgrade
	 * 
	 * @return object
	 */
	private function menuUpgradeModel()
	{
		return $this->belongsTo('App\\Models\\MenuUpgradeModel');
	}

	/**
	 * Returns the order
	 * 
	 * @return object
	 */
	public function orderModel()
	{
		return $this->belongsTo('App\\Models\\OrderModel');
	}

	/**
	 * Returns the ordered articles
	 * 
	 * @return object
	 */
	public function orderedArticlesCollection()
	{
		return $this->hasMany('App\\Models\\OrderedArticleModel');
	}

	protected function getBaseArticleModelAttribute()
	{
		return $this->orderedArticlesCollection->first()->articleModel;
	}

	/**
	 * Returns the menu
	 * 
	 * @return object
	 */
	public function getMenuModelAttribute()
	{
		if ($this->menuUpgradeModel != null) {
			return $this->menuUpgradeModel;
		} elseif ($this->menuBundleModel != null) {
			return $this->menuBundleModel;
		} else {
			return null;
		}
	}

	public function setTotalAttribute()
	{
		$this->throwException('Total has to be calculated');
	}

	public function getIsMenuAttribute()
	{
		return $this->menuModel != null;
	}

	public function calculateTotal()
	{
		$store_model_id = $this->orderModel->storeModel->id;
		$orderedArticlesCollection = $this->orderedArticlesCollection;
		$total = (float) $this->baseArticleModel->returnCustomPrice($store_model_id);

		if ($this->isMenu) {
			if ($this->menuModel instanceof MenuBundleModel) {
				$total = (float) $this->menuModel->returnCustomPrice($store_model_id);
			} else {
				$total += (float) $this->menuModel->returnCustomPrice($store_model_id);
			}
		}

		foreach ($orderedArticlesCollection as $orderedArticleModel) {

			// sum up ingredients
			foreach ($orderedArticleModel->ingredientsCollection as $ingredientModel) {
				$total += (float) $ingredientModel->returnCustomPrice($store_model_id);
			}

			// add deposit
			$total += (float) $orderedArticleModel->articleModel->deposit;
		}

		$this->attributes['total'] = $total * $this->amount;
	}

}