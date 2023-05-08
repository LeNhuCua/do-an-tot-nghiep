<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCustomersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->string('customerId',20)->primary();
            $table->string('account');
            $table->string('password');
            $table->string('fullName');
            $table->string('email')->nullable();
            $table->dateTime('birthday')->nullable();
            $table->string('avatar')->nullable();
            $table->string('phoneNumber')->nullable();
            $table->boolean('gender')->nullable();
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
        Schema::dropIfExists('customers');
    }
}
