<?php

use App\Models\Order;
use App\Models\Product;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrderDetailsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        
        Schema::create('order_details', function (Blueprint $table) {
            $table->integer('quantity');
            $table->float('price');

            $table->string('productId',20);
            $table->foreign('productId')->references('productId')->on('products')->onUpdate('cascade')->onDelete('cascade');;

            $table->string('orderId',20);
            $table->foreign('orderId')->references('orderId')->on('orders')->onUpdate('cascade')->onDelete('cascade');;
            
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
        Schema::dropIfExists('order_details');
    }
}
