<?php

class DatabaseSeeder extends Seeder {

	/**
	 * Run the database seeds.
	 *
	 * @return void
	 */
	public function run()
	{
		$this->call('IngredientCategoryModelSeeder');
		$this->call('IngredientModelSeeder');
		$this->call('CategoryModelSeeder');
		$this->call('ArticleModelSeeder');
		$this->call('MenuBundleModelSeeder');
		$this->call('MenuUpgradeModelSeeder');
		$this->call('MenuComponentBlockModelSeeder');
		$this->call('MenuComponentOptionModelSeeder');
	}

}