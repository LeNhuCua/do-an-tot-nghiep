<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProvinceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('provinces')->insert([


            [
                'provinceId' => "T001",
                'name' => "An Giang",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'provinceId' => "T002",
                'name' => "Khánh Hoà",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
