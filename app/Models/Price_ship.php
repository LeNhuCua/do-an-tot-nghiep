<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Price_ship extends Model
{
    use HasFactory;
    protected $table = 'price_ships';
    protected $fillable = [
        'price',
        'districtId'
    ];
    protected $primaryKey = 'shipId';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'create_at',
        'update_at'

    ];
}
