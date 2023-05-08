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
        Schema::create('invoice_details', function (Blueprint $table) {
            
            $table->integer('number');
            $table->float('price', 12, 6);

            $table->string('invoiceId', 20);
            $table->foreign('invoiceId')->references('invoiceId')->on('invoices')->onUpdate('cascade')->onDelete('cascade');;

            $table->string('productId',50);
            $table->foreign('productId')->references('productId')->on('products')->onUpdate('cascade')->onDelete('cascade');;

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
        Schema::dropIfExists('invoice_details');
    }
};
