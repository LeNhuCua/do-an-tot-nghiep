<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Cart extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'cartId',
        'quantity',
        'userId',
        'productId',
        'sizeId',
        'price'
    ];
    public $incrementing = false;
    protected $primaryKey = 'cartId';
    protected $with = ['product', 'size', 'productSize'];

    public function product()
    {
        return $this->belongsTo(Product::class, 'productId', 'productId');
    }
    public function size()
    {
        return $this->belongsTo(Size::class, 'sizeId', 'sizeId');
    }
    public function productSize()
    {
        return $this->hasMany(ProductSize::class, 'productSizeId', 'productSizeId');
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'create_at',
        'update_at',
    ];
}
