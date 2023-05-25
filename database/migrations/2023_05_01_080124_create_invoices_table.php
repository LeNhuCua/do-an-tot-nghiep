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
        Schema::create('invoices', function (Blueprint $table) {
            $table->string('invoiceId', 20)->primary();
            $table->string('fullName',50);
            $table->string('phoneNumber',10);
            $table->float('totalAmount', 20, 6);

            $table->string('userId', 20);
            $table->foreign('userId')->references('userId')->on('users')->onUpdate('cascade')->onDelete('cascade');;

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
        Schema::dropIfExists('invoices');
    }
};
