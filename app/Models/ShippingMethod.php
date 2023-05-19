<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShippingMethod extends Model
{
    use HasFactory;

    protected $table = "shipping_methods";

    protected $fillable = [
        'shippingMethodId',
        'shippingMethodName',
    ];


    public $incrementing = false;
    protected $primaryKey = 'shippingMethodId';
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
