<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Psy\TabCompletion\Matcher\FunctionsMatcher;

class ProductType extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

        /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    
    protected $table = "product_types";

    protected $fillable = [
        'productTypeId',
        'name',
        'alias',
        'status',
        'categoryId'
    ];


    // protected $with = ['category'];
    
    public function category() {
        return $this->belongsTo(Category::class, 'categoryId','categoryId');
    }
    public $incrementing = false;
    protected $primaryKey = 'productTypeId';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'create_at',
        'update_at'

    ];
    public function danhMuc()
    {
        return $this->belongsTo(Category::class, 'categoryId');
    }

}
