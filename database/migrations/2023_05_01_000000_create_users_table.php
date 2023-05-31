<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->string('userId', 20)->primary();
            $table->string('account', 30);
            $table->string('password', 100);
            $table->string('fullName', 50);
            $table->string('email', 100);
            $table->dateTime('birthday')->nullable();
            $table->string('avatar', 100)->nullable();
            $table->string('phoneNumber', 10)->nullable();
            $table->boolean('gender')->nullable();
            $table->string('otp', 45)->nullable();

            
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')->references('id')->on('roles')->onUpdate('cascade')->onDelete('cascade');;
            // $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
