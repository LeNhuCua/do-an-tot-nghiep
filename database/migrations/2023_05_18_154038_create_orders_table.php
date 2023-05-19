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
            $table->string('orderId', 20)->primary();

            $table->float('totalAmount', 20, 6);

            $table->string('status');

            $table->dateTime('deliveryDate');

            $table->string('userId', 20);
            $table->foreign('userId')->references('userId')->on('users')->onUpdate('cascade')->onDelete('cascade');

            $table->string('paymentMethodId', 20);
            $table->foreign('paymentMethodId')->references('paymentMethodId')->on('payment_methods')->onUpdate('cascade')->onDelete('cascade');

            $table->string('shippingMethodId', 20);
            $table->foreign('shippingMethodId')->references('shippingMethodId')->on('shipping_methods')->onUpdate('cascade')->onDelete('cascade');;

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
