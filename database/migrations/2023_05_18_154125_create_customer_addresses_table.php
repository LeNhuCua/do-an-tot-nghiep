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
        Schema::create('customer_addresses', function (Blueprint $table) {
            $table->string('addressId', 20)->primary();
            $table->string('recipientName', 100);
            $table->string('recipientAddress', 100);
            $table->string('recipientPhone', 10);

            $table->string('provinceId', 5);
            $table->foreign('provinceId')->references('provinceId')->on('provinces')->onUpdate('cascade')->onDelete('cascade');

            $table->string('districtId', 5);
            $table->foreign('districtId')->references('districtId')->on('districts')->onUpdate('cascade')->onDelete('cascade');

            $table->string('wardId', 5);
            $table->foreign('wardId')->references('wardId')->on('wards')->onUpdate('cascade')->onDelete('cascade');

            $table->string('userId', 20);
            $table->foreign('userId')->references('userId')->on('users')->onUpdate('cascade')->onDelete('cascade');

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
        Schema::dropIfExists('customer_addresses');
    }
};
