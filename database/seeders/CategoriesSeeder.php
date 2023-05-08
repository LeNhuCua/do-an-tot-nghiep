<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('categories')->insert([
            [
                'categoryId' => "TSN",
                'name' => "Trang sức nữ",
                'alias' => "trang-suc-nu",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'categoryId' => "TSNAM",
                'name' => "Trang sức nam",
                'alias' => "trang-suc-nam",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'categoryId' => "TSBE",
                'name' => "Trang sức cho bé",
                'alias' => "trang-suc-cho-be",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],   [
                'categoryId' => "VVTT",
                'name' => "Vàng vía thần tài",
                'alias' => "vang-via-than-tai",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'categoryId' => "TSCUOI",
                'name' => "Trang sức cưới",
                'alias' => "trang-suc-cuoi",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'categoryId' => "TSPT",
                'name' => "Trang sức phong thuỷ",
                'alias' => "trang-suc-phong-thuy",
                'status' => 1,
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
