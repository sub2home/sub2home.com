<?php

/**
 * IngredientModel class
 *
 * An ingredient of an article. May also have an additional price.
 */
class IngredientModel extends BaseModel
{

	public $timestamps = false;

	protected $hidden = array('ingredient_category_model_id', 'order');


	protected function beforeFirstSave()
	{
		// Calculate new order concerning a category
		$this->order = static::where('ingredient_category_model_id', $this->ingredient_category_model_id)->count();
	}

	/**
	 * Hook delete
	 * 
	 * @return int
	 */
	public function delete()
	{
		// Readjust order
		foreach (static::where('order', '>', $this->order)->get() as $ingredientModel) {
			$ingredientModel->order = $ingredientModel->order - 1;
			$ingredientModel->save();
		}

		// Delete relationships with related articlesCollection
		$this->articlesCollection()->delete();

		// Delete all belonging custom ingredients
		foreach ($this->customIngredientsCollection as $customIngredientModel) {
			$customIngredientModel->delete();
		}

		return parent::delete();
	}

	/**
	 * Returns the belonging articlesCollection of the ingredient
	 * 
	 * @return object
	 */
	public function articlesCollection()
	{
		return $this->belongsToMany('ArticleModel');
	}

	/**
	 * Returns the ingredient category
	 * 
	 * @return object
	 */
	public function ingredientCategoryModel()
	{
		return $this->belongsTo('IngredientCategoryModel');
	}

	/**
	 * Returns the custom ingredients
	 * 
	 * @return object
	 */
	public function customIngredientsCollection()
	{
		return $this->hasMany('CustomIngredientModel');
	}

	/**
	 * Returns the custom ingredient respecting a specific store
	 * 
	 * @param  int $store_model_id
	 * @return object
	 */
	public function returnCustomModel($store_model_id)
	{
		$customIngredientModel = $this->customIngredientsCollection()->where('store_model_id', $store_model_id)->first();

		// lazy initialize
		if ($customIngredientModel == null) {
			$customIngredientModel = new CustomIngredientModel(array(
				'store_model_id' => $storeModel->id,
				'ingredient_model_id' => $this->id,
				'price' => $this->price
				));
			$customIngredientModel->save();
		}

		return $customIngredientModel;
	}

	/**
	 * Returns the price of the ingredient (respects custom ingredients)
	 *
	 * @param int $store_model_id
	 * @return int
	 */
	public function returnRealPrice($store_model_id)
	{
		$customIngredientModel = $this->returnCustomModel($store_model_id);

		if ($customIngredientModel->hasOwnPrice) {
			return $customIngredientModel->price;
		} else {
			return $this->price;
		}
	}

}
