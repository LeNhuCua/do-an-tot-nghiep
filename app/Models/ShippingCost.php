<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingCost extends Model
{
    use HasFactory;
    protected $table = "shipping_costs";

    protected $fillable = [
        'shippingCostId',
        'provinceId',
        'districtId',
        'wardId',
        'shippingCost',
    ];


    public $incrementing = false;
    protected $primaryKey = 'shippingCostId';
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
