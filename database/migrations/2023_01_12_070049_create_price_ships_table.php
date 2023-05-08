<?php

use App\Models\District;
use App\Models\Province;
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
        Schema::create('price_ships', function (Blueprint $table) {
            $table->string('shipId',20)->primary();
            $table->float('price');
            $table->string('districtId',20);
            $table->foreign('districtId')->references('districtId')->on('districts')->onUpdate('cascade')->onDelete('cascade');;
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
        Schema::dropIfExists('price_ships');
    }
};
