<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingAddress extends Model
{
    use HasFactory;
    protected $table = "shipping_addresses";

    protected $fillable = [
        'shippingAddressId',
        'recipientAddress',
        'orderId',
        'provinceId',
        'districtId',
        'wardId',
    ];


    public $incrementing = false;
    protected $primaryKey = 'shippingAddressId';
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
