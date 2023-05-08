<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
class Admin extends Authenticatable
{


    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = "admins";
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'account',
        'password',
        'fullName',
        'email',
        'birthday',
        'avatar',
        'phoneNumber',
        'gender',
        'role_id'
    ];

    protected $with= ['role'];
    
    public function rolee() {
        return $this->belongsTo(Role::class, 'role_id','id');
    }
 

    protected $primaryKey = 'adminId';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'create_at',
        'update_at',
        'password'
    ];

    public function getAuthPassword()
    {
        return $this->password;
    }
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
