<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('products')->insert([
            [
                'productId' => "TSN",
                'name' => "Vòng Tay Nữ Vàng Trắng 416",
                'alias' => "trang-suc-nu",
                'price' => "1200000",
                'avatar' => "trang-suc-nu",
                'description' => "trang-suc-nu",
                'number' => "trang-suc-nu",
                'weight' => "trang-suc-nu",
                'productTypeId' => "trang-suc-nu",
                'unitId' => "trang-suc-nu",
                'categorySubId' => "LVTN",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'categoryId' => "DM_TS-NAM",
                'name' => "Trang sức nam",
                'alias' => "trang-suc-nam",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'categoryId' => "DM_TS-BE",
                'name' => "Trang sức cho bé",
                'alias' => "trang-suc-cho-be",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],   [
                'categoryId' => "DM_VV-TT",
                'name' => "Vàng vía thần tài",
                'alias' => "vang-via-than-tai",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'categoryId' => "DM_TS-CUOI",
                'name' => "Trang sức cưới",
                'alias' => "trang-suc-cuoi",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'categoryId' => "DM_TS-PT",
                'name' => "Trang sức phong thuỷ",
                'alias' => "trang-suc-phong-thuy",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
