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
        'recipientName',
        'recipientPhone'
    ];


    public $incrementing = false;
    protected $primaryKey = 'shippingAddressId';
    protected $with = ['province','district','ward'];


    public function province()
    {
        return $this->belongsTo(Province::class, 'provinceId', 'provinceId');
    }
    public function district()
    {
        return $this->belongsTo(District::class, 'districtId', 'districtId');
    }
    public function ward()
    {
        return $this->belongsTo(Ward::class, 'wardId', 'wardId');
    }
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
