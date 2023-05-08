<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class UnitsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('units')->insert([
            [
                'unitId' => "LY",
                'name' => "Ly",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'unitId' => "PHAN",
                'name' => "Phân",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'unitId' => "CHI",
                'name' => "Chỉ",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],   [
                'unitId' => "CAY",
                'name' => "Cây - Lượng",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  
             [
                'unitId' => "GRAM",
                'name' => "Gram",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);
    }
}
