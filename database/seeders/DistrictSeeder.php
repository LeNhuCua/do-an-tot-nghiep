<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class DistrictSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('districts')->insert([


            [
                'districtId' => "Q001",
                'name' => "Thành Phố Nha Trang",
                'provinceId' => "TINH002",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'districtId' => "Q002",
                'name' => "Thị Xã Ninh Hoà",
                'provinceId' => "TINH002",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
