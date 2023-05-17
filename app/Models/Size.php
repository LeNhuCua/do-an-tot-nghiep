<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Size extends Model
{
    use HasFactory;
    protected $fillable = [
        'sizeId',
        'sizeValue',
    ];
    protected $primaryKey = 'sizeId';
    public $incrementing = false;
    // protected $with = ['product'];

    // public function product()
    // {
    //     return $this->belongsTo(Product::class, 'productId', 'productId');
    // }
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
