<?php

use App\Models\ProductType;
use App\Models\Provider;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProductsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('products', function (Blueprint $table) {
            $table->string('productId', 50)->primary();
            $table->string('name',100);
            $table->string('alias',150);
            $table->string('avatar', 100)->nullable();
            $table->string('description', 2000)->nullable();
            $table->integer('number');
            $table->integer('numberBuy')->nullable()->default(0);
            $table->boolean('status');

            $table->decimal('weight', 12, 2);

            $table->integer('rating')->nullable()->default(0);

            $table->integer('numberRate')->nullable()->default(0);

            $table->string('productTypeId', 10);
            $table->foreign('productTypeId')->references('productTypeId')->on('product_types')->onUpdate('cascade')->onDelete('cascade');


            $table->string('unitId', 10);
            $table->foreign('unitId')->references('unitId')->on('units')->onUpdate('cascade')->onDelete('cascade');


            $table->string('typeCategoryId', 10);
            $table->foreign('typeCategoryId')->references('typeCategoryId')->on('type_categories')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('products');
    }
}
