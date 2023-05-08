<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
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
        'price',
        'avatar',
        'description',
        'number',
        'weight',
        'numberBuy',
        'status',
        'unitId',
        'productTypeId',
        'typeCategoryId',

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
    protected $with = ['productType','productImage','unit','typeCategory'];

    public function productType()
    {
        return $this->belongsTo(ProductType::class, 'productTypeId', 'productTypeId');
    }
    public function productImage()
    {
        return $this->hasMany(ProductImage::class,'productId','productId');
    }
    public function unit()
    {
        return $this->belongsTo(Unit::class, 'unitId', 'unitId');
    }
    public function typeCategory()
    {
        return $this->belongsTo(TypeCategories::class, 'typeCategoryId', 'typeCategoryId');
    }
}
