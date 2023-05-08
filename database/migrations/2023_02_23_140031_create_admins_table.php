<?php

use App\Models\Role;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAdminsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('admins', function (Blueprint $table) {
            $table->bigIncrements('adminId');
            $table->string('account');
            $table->string('password');
            $table->string('fullName');
            $table->string('email');
            $table->dateTime('birthday')->nullable();
            $table->string('avatar')->nullable();
            $table->string('phoneNumber')->nullable();
            $table->boolean('gender')->nullable();
            $table->boolean('isManager');
            $table->rememberToken();
            $table->unsignedBigInteger('role_id');
            $table->foreign('role_id')->references('id')->on('roles')->onUpdate('cascade')->onDelete('cascade');;
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
        Schema::dropIfExists('admins');
    }

}
