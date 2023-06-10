<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = "users";

    protected $fillable = [
        'userId',
        'account',
        'password',
        'fullName',
        'email',
        'birthday',
        'avatar',
        'phoneNumber',
        'gender',
        'role_id',
        'confirmation_token',
        'confirmed',
        'remember_token',
        'otp',
        'last_login_at'
    ];

    protected $with = ['role'];
    protected $primaryKey = 'userId';
    public $incrementing = false;
    public function rolee()
    {
        return $this->belongsTo(Role::class, 'role_id', 'id');
    }
    public function cartItems()
    {
        return $this->belongsTo(Cart::class, 'userId', 'userId');
    }

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
        'create_at',
        'update_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];
    public function role()
    {
        return $this->belongsTo(Role::class);
    }
}
