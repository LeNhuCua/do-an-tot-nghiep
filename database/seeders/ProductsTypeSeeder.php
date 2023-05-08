<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('product_types')->insert([

            [
                'productTypeId' => "9999",
                'name' => "Vàng ta - 9999",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [

                'productTypeId' => "999",
                'name' => "Vàng 999",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VTRANG",
                'name' => "Vàng trắng",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VTRANG-10",
                'name' => "Vàng trắng 10k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VTRANG-14",
                'name' => "Vàng trắng 14k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VTRANG-18",
                'name' => "Vàng trắng 18k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VHONG",
                'name' => "Vàng hồng",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VHONG-10",
                'name' => "Vàng hồng 10k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VHONG-14",
                'name' => "Vàng hồng 14k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VHONG-18",
                'name' => "Vàng hồng 18k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VTAY",
                'name' => "Vàng tây",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VTAY-8",
                'name' => "Vàng tây 8k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VTAY-9",
                'name' => "Vàng tây 9k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VTAY-10",
                'name' => "Vàng tây 10k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VTAY-14",
                'name' => "Vàng tây 14k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VTAY-18",
                'name' => "Vàng tây 18k",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'productTypeId' => "VY",
                'name' => "Vàng ý",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VY-750",
                'name' => "Vàng ý 750",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VY-925",
                'name' => "Vàng ý 925",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "VN",
                'name' => "Vàng non",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],

            [
                'productTypeId' => "VMK",
                'name' => "Vàng mỹ ký",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'productTypeId' => "BAC",
                'name' => "Bạc",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
