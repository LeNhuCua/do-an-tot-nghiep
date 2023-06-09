<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;


use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        //  \App\Models\User::factory(30)->create();
        $this->call([
            ProvinceSeeder::class,
            DistrictSeeder::class,
            WardSeeder::class,
            SizeSeeder::class,
            RolesTableSeeder::class,
            CategoriesSeeder::class,
            TypeCategoriesSeeder::class,
            ProductsTypeSeeder::class,
            UnitsSeeder::class,
            OrderStatusSeeder::class,
            ShippingMethodsSeeder::class,
            PaymentMethodsSeeder::class,
            ShippingCostsSeeder::class,

            // ProductsSeeder::class,
        ]);
        // \App\Models\User::factory()->create([
        //     'name' => 'Test User',
        //     'email' => 'test@example.com',
        // ]);
    }
}
