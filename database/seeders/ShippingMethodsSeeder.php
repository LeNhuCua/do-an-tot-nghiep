<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ShippingMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('shipping_methods')->insert([


            [
                'shippingMethodId' => "PTVC001",
                'shippingMethodName' => "Giao tận nơi",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'shippingMethodId' => "PTVC002",
                'shippingMethodName' => "Đến cửa hàng lấy",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
