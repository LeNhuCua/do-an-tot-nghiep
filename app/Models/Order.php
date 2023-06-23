<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Order extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $table = 'orders';

    protected $fillable = [
        'orderId',
        'totalAmount',
        'orderStatusId',
        'deliveryDate',
        'userId',
        'paymentMethodId',
        'shippingMethodId',
        'deposits',
        'isDeposit',
        'processingOrderBy'
    ];
    protected $primaryKey = 'orderId';
    public $incrementing = false;
    protected $with = ['orderDetail','shippingMethod','paymentMethod','orderStatus','customer','customerAddress','shippingFee'];

    public function shippingFee()
    {
        return $this->belongsTo(ShippingFee::class, 'orderId', 'orderId');
    }
    public function orderDetail()
    {
        return $this->hasMany(OrderDetail::class, 'orderId', 'orderId');
    }
    public function shippingMethod()
    {
        return $this->belongsTo(ShippingMethod::class, 'shippingMethodId', 'shippingMethodId');
    }
    public function paymentMethod()
    {
        return $this->belongsTo(paymentMethod::class, 'paymentMethodId', 'paymentMethodId');
    }
    public function orderStatus()
    {
        return $this->belongsTo(OrderStatus::class, 'orderStatusId', 'orderStatusId');
    }
    public function customer()
    {
        return $this->belongsTo(User::class, 'userId', 'userId');
    }
    public function customerAddress()
    {
        return $this->belongsTo(ShippingAddress::class, 'orderId', 'orderId');
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
