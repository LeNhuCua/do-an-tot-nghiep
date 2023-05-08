<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TypeCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('type_categories')->insert([
            //trang sức nữ
            [
                'typeCategoryId' => "LVTN",
                'name' => "Lắc - Vòng tay",
                'alias' => "lac---vong-tay",
                'status' => 1,
                'categoryId' => "TSN",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'typeCategoryId' => "DCN",
                'name' => "Dây chuyền",
                'alias' => "day-chuyen",
                'status' => 1,
                'categoryId' => "TSN",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "MDCN",
                'name' => "Mặt dây chuyền",
                'alias' => "mat-day-chuyen",
                'status' => 1,
                'categoryId' => "TSN",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "NN",
                'name' => "Nhẫn nữ",
                'alias' => "nhan-nu",
                'status' => 1,
                'categoryId' => "TSN",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "BTN",
                'name' => "Bông tai nữ",
                'alias' => "bong-tai-nu",
                'status' => 1,
                'categoryId' => "TSN",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "LCN",
                'name' => "Lắc chân nữ",
                'alias' => "lac-chan-nu",
                'status' => 1,
                'categoryId' => "TSN",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "BTSN",
                'name' => "Bộ trang sức nữ",
                'alias' => "bo-trang-suc-nu",
                'status' => 1,
                'categoryId' => "TSN",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            //trang sức nam
            [
                'typeCategoryId' => "NNAM",
                'name' => "Nhẫn nam",
                'alias' => "nhan-nam",
                'status' => 1,
                'categoryId' => "TSNAM",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "DCNAM",
                'name' => "Dây chuyền nam",
                'alias' => "day-chuyen-nam",
                'status' => 1,
                'categoryId' => "TSNAM",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "MDCNAM",
                'name' => "Mặt dây chuyền nam",
                'alias' => "mat-day-chuyen-nam",
                'status' => 1,
                'categoryId' => "TSNAM",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],

            [
                'typeCategoryId' => "LTNAM",
                'name' => "Lắc tay nam",
                'alias' => "lac-tay-nam",
                'status' => 1,
                'categoryId' => "TSNAM",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            //trang sức cho bé
            [
                'typeCategoryId' => "NVBE",
                'name' => "Nhẫn vàng cho bé",
                'alias' => "nhan-vang-cho-be",
                'status' => 1,
                'categoryId' => "TSBE",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "DCBE",
                'name' => "Dây chuyền cho bé",
                'alias' => "day-chuyen-cho-be",
                'status' => 1,
                'categoryId' => "TSBE",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "VTBE",
                'name' => "Vòng tay cho bé",
                'alias' => "vong-tay-cho-be",
                'status' => 1,
                'categoryId' => "TSBE",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],

            //vàng vía thần tài
            [
                'typeCategoryId' => "NKTVVTT",
                'name' => "Nhẫn kim tiền",
                'alias' => "nhan-kim-tien",
                'status' => 1,
                'categoryId' => "VVTT",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],

             //trang sức cưới
            [
                'typeCategoryId' => "BTSCUOI",
                'name' => "Bộ trang sức cưới",
                'alias' => "bo-trang-suc-cuoi",
                'status' => 1,
                'categoryId' => "TSCUOI",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "NCHCUOI",
                'name' => "Nhẫn cầu hôn",
                'alias' => "nhan-cau-hon",
                'status' => 1,
                'categoryId' => "TSCUOI",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "NCUOI",
                'name' => "Nhẫn cưới",
                'alias' => "nhan-cuoi",
                'status' => 1,
                'categoryId' => "TSCUOI",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],

            
             //trang sức phong thuỷ
             [
                'typeCategoryId' => "NHANPT",
                'name' => "Nhẫn phong thuỷ",
                'alias' => "nhan-phong-thuy",
                'status' => 1,
                'categoryId' => "TSPT",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "VTPT",
                'name' => "Vòng tay phong thuỷ",
                'alias' => "vong-tay-phong-thuy",
                'status' => 1,
                'categoryId' => "TSPT",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()

            ],
            [
                'typeCategoryId' => "THUUPT",
                'name' => "Tỳ hưu",
                'alias' => "ty-huu",
                'status' => 1,
                'categoryId' => "TSPT",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],

        ]);
    }
}


