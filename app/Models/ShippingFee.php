<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingFee extends Model
{
    use HasFactory;
    protected $table = "shipping_fees";

    protected $fillable = [
        'shippingFeeId',
        'orderId',
        'shippingFeeAmount',
    ];


    public $incrementing = false;
    protected $primaryKey = 'shippingFeeId';
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
