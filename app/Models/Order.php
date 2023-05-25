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
    ];
    protected $primaryKey = 'orderId';
    public $incrementing = false;
    protected $with = ['orderDetail'];

    public function orderDetail()
    {
        return $this->hasMany(OrderDetail::class, 'orderId', 'orderId');
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
