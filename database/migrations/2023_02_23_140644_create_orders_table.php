<?php

use App\Models\Customer;

use App\Models\District;
use App\Models\Price_ship;
use App\Models\Province;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrdersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->string('orderId')->primary();
            $table->string('fullName');
            $table->dateTime('address');
            $table->string('phoneNumber');
            $table->string('status');
            $table->dateTime('orderDate');
            $table->dateTime('deliveryDate');
            $table->float('price_ship_id');

            $table->string('customerId',20);
            $table->foreign('customerId')->references('customerId')->on('customers')->onUpdate('cascade')->onDelete('cascade');;

            $table->string('shipId',20);
            $table->foreign('shipId')->references('shipId')->on('price_ships')->onUpdate('cascade')->onDelete('cascade');;

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('orders');
    }
}
