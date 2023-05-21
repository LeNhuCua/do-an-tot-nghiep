<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class Product extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $fillable = [
        'productId',
        'name',
        'alias',
        'avatar',
        'description',
        'number',
        'weight',
        'numberBuy',
        'status',
        'unitId',
        'productTypeId',
        'typeCategoryId',
        'rating',
        'numberRate'

    ];
    public $incrementing = false;
    protected $primaryKey = 'productId';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'create_at',
        'update_at'

    ];
    protected $with = ['productType','productImage','unit','typeCategory','productSize'];

    public function productType()
    {
        return $this->belongsTo(ProductType::class, 'productTypeId', 'productTypeId');
    }
    public function productImage()
    {
        return $this->hasMany(ProductImage::class,'productId','productId');
    }
    public function productSize()
    {
        return $this->hasMany(ProductSize::class,'productId','productId');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unitId', 'unitId');
    }
    public function typeCategory()
    {
        return $this->belongsTo(TypeCategories::class, 'typeCategoryId', 'typeCategoryId');
    }

    public function scopeOrderByPrice($query, $direction = 'asc')
    {
        return $query->joinSub(
                function ($query) {
                    $query->select('productId', DB::raw('MIN(price) as min_price'))
                        ->from('product_sizes')
                        ->groupBy('productId');
                },
                'product_size_min',
                function ($join) {
                    $join->on('products.productId', '=', 'product_size_min.productId');
                }
            )
            ->orderBy('min_price', $direction);
    }
    
    
    public function scopeFilterByPrice($query, $starPrice = '', $endPrice = '')
    {
        return $query->joinSub(
                function ($query) {
                    $query->select('productId', DB::raw('MIN(price) as min_price1'))
                        ->from('product_sizes')
                        ->groupBy('productId');
                },
                'product_size_min1',
                function ($join) {
                    $join->on('products.productId', '=', 'product_size_min1.productId');
                }
            )
            // ->orderBy('min_price', $price);
            ->whereBetween('min_price1', [$starPrice, $endPrice]);

    }
    



}
