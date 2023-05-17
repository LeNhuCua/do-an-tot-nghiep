<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class SizeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('sizes')->insert([

            [
                'sizeId' => "SIZE00001",
                'sizeValue' => "10",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'sizeId' => "SIZE00002",
                'sizeValue' => "11",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'sizeId' => "SIZE00003",
                'sizeValue' => "12",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'sizeId' => "SIZE00004",
                'sizeValue' => "13",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'sizeId' => "SIZE00005",
                'sizeValue' => "14",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'sizeId' => "SIZE00006",
                'sizeValue' => "Mặc định",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
