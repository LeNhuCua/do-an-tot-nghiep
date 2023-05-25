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
        Schema::create('product_sizes', function (Blueprint $table) {
            $table->string('productSizeId', 20)->primary();
            $table->float('price', 20, 6);

            $table->string('sizeId', 10);
            $table->foreign('sizeId')->references('sizeId')->on('sizes')->onUpdate('cascade')->onDelete('cascade');

            $table->string('productId', 50);
            $table->foreign('productId')->references('productId')->on('products')->onUpdate('cascade')->onDelete('cascade');

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
        Schema::dropIfExists('product_sizes');
    }
};
