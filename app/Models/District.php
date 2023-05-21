<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class District extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $table = 'districts';
    protected $fillable = [
        'districtId',
        'name',
        'provinceId',
    ];
    protected $primaryKey = 'districtId';
    public $incrementing = false;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */

    public function province()
    {
        return $this->belongsTo(Province::class, 'provinceId', 'provinceId');
    }

    public function ward()
    {
        return $this->hasMany(Ward::class, 'districtId', 'districtId');
    }
    protected $hidden = [
        'create_at',
        'update_at'

    ];
}
