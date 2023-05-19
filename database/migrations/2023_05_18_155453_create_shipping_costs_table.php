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
        Schema::create('shipping_costs', function (Blueprint $table) {
            $table->string('shippingCostId', 20)->primary();

            $table->string('provinceId', 20);
            $table->foreign('provinceId')->references('provinceId')->on('provinces')->onUpdate('cascade')->onDelete('cascade');;

            $table->string('districtId', 20);
            $table->foreign('districtId')->references('districtId')->on('districts')->onUpdate('cascade')->onDelete('cascade');;

            $table->string('wardId', 20);
            $table->foreign('wardId')->references('wardId')->on('wards')->onUpdate('cascade')->onDelete('cascade');

            $table->float('shippingCost', 20, 6);


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
        Schema::dropIfExists('shipping_costs');
    }
};
