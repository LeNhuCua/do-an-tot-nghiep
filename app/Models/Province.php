<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Province extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = "provinces";

    protected $fillable = [
        'provinceId',
        'name',
        'districtId'
    ];
    protected $primaryKey = 'provinceId';
    public $incrementing = false;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    public function district()
    {
        return $this->hasMany(District::class, 'provinceId', 'provinceId');
    }
    protected $hidden = [
        'create_at',
        'update_at'

    ];
}
