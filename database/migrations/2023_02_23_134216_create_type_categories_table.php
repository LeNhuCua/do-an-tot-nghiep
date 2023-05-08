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
        Schema::create('type_categories', function (Blueprint $table) {
            $table->string('typeCategoryId', 20)->primary();
            $table->string('name',50)->unique();
            $table->string('alias');
            $table->boolean('status');
            $table->string('categoryId',20);
            $table->foreign('categoryId')->references('categoryId')->on('categories')->onUpdate('cascade')->onDelete('cascade');
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
        Schema::dropIfExists('type_categories');
    }
};
