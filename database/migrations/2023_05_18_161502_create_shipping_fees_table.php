<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('shipping_fees', function (Blueprint $table) {
            $table->string('shippingFeeId', 20)->primary();

            $table->string('orderId', 20);
            $table->foreign('orderId')->references('orderId')->on('orders')->onUpdate('cascade')->onDelete('cascade');;

            $table->float('shippingFeeAmount', 20, 6);

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
        Schema::dropIfExists('shipping_fees');
    }
};
