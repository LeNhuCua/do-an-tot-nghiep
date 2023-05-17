<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    use HasFactory;
    protected $fillable = [
        'productSizeId',
        'price',
        'sizeId',
        'productId',

    ];
    public $incrementing = false;
    protected $primaryKey = 'productSizeId';
    protected $with = ['size'];
    public function size()
    {
        return $this->hasMany(Size::class,'sizeId','sizeId');
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
