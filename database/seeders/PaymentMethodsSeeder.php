<?php

namespace Database\Seeders;

use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PaymentMethodsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('payment_methods')->insert([


            [
                'paymentMethodId' => "PTTT001",
                'paymentMethodName' => "Thanh toán Online",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
            [
                'paymentMethodId' => "PTTT002",
                'paymentMethodName' => "Thanh toán khi nhận hàng",
                'created_at' => Carbon::now(),
                'updated_at' => Carbon::now()
            ],
        ]);
    }
}
