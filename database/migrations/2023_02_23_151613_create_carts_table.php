<?php

use App\Models\Customer;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCartsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->string('cartId',20)->primary();
            $table->integer('quantity');

            $table->string('customerId',20);
            $table->foreign('customerId')->references('customerId')->on('customers')->onUpdate('cascade')->onDelete('cascade');;

            $table->string('productId',20);
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
        Schema::dropIfExists('carts');
    }
}
