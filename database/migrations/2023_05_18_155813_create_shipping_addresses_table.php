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
        Schema::create('shipping_addresses', function (Blueprint $table) {
            $table->string('shippingAddressId', 20)->primary();

            $table->string('orderId', 20);
            $table->foreign('orderId')->references('orderId')->on('orders')->onUpdate('cascade')->onDelete('cascade');;

            $table->string('recipientAddress', 100);


            $table->string('provinceId', 20);
            $table->foreign('provinceId')->references('provinceId')->on('provinces')->onUpdate('cascade')->onDelete('cascade');

            $table->string('districtId', 20);
            $table->foreign('districtId')->references('districtId')->on('districts')->onUpdate('cascade')->onDelete('cascade');

            $table->string('wardId', 20);
            $table->foreign('wardId')->references('wardId')->on('wards')->onUpdate('cascade')->onDelete('cascade');

            $table->string('recipientName', 50);
            $table->string('recipientPhone', 10);



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
        Schema::dropIfExists('shipping_addresses');
    }
};
