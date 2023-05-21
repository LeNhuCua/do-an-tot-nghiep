<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class WardSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('wards')->insert([


            [
                'wardId' => "X001",
                'name' => "Phường Lộc Thọ",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'wardId' => "X002",
                'name' => "Phường Ngọc Hiệp",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X003",
                'name' => "Phường Phước Đồng",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X004",
                'name' => "Phường Phước Hải",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X005",
                'name' => "Phường Phước Hòa",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X006",
                'name' => "Phường Phước Long",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X007",
                'name' => "Phường Phước Tân",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X008",
                'name' => "Phường Phước Tiến",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X009",
                'name' => "Phường Phương Sài",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X010",
                'name' => "Phường Phương Sơn",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X011",
                'name' => "Phường Tân Lập",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X012",
                'name' => "Phường Vạn Thạnh",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X013",
                'name' => "Phường Vạn Thắng",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X014",
                'name' => "Phường Vĩnh Hải",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X015",
                'name' => "Phường Vĩnh Hiệp",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X016",
                'name' => "Phường Vĩnh Hòa",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X017",
                'name' => "Phường Vĩnh Lương",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],  [
                'wardId' => "X018",
                'name' => "Phường Vĩnh Ngọc",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X019",
                'name' => "Phường Vĩnh Nguyên",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X020",
                'name' => "Phường Vĩnh Phước",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X021",
                'name' => "Phường Vĩnh Phương",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X022",
                'name' => "Phường Vĩnh Thái",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X023",
                'name' => "Phường Vĩnh Thạnh",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X024",
                'name' => "Phường Vĩnh Thọ",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X025",
                'name' => "Phường Vĩnh Trung",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X026",
                'name' => "Phường Vĩnh Trường",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ], [
                'wardId' => "X027",
                'name' => "Phường Xương Huân",
                'districtId' => "Q001",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ]
        ]);
    }
}
