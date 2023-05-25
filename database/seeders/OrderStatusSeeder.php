<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class OrderStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('order_statuses')->insert([


            [
                'orderStatusId' => "TT001",
                'name' => "Chờ xác nhận",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'orderStatusId' => "TT002",
                'name' => "Đã xác nhận",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'orderStatusId' => "TT003",
                'name' => "Đang giao hàng",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'orderStatusId' => "TT004",
                'name' => "Đã giao hàng",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'orderStatusId' => "TT005",
                'name' => "Hoàn thành",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'orderStatusId' => "TT006",
                'name' => "Đã huỷ",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
