<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\DB;
use Laravel\Sanctum\HasApiTokens;

class Category extends Model
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */

    protected $table = "categories";
    protected $fillable = [
        'categoryId',
        'name',
        'alias',
        'status'
    ];
    protected $hidden = [
        // 'created_at',
        'updated_at'
    ];
    // protected $with = ['typeCategory'];

    public function typeCategory()
    {
        return $this->hasMany(TypeCategories::class,'categoryId','categoryId');
    }

    public $incrementing = false;
    protected $primaryKey = 'categoryId';


    // public function updateMadm($categoryId)
    // {
    //     DB::beginTransaction();

    //     try {
    //         // Cập nhật madm trong bảng danhmuc
    //         $this->categoryId = $categoryId;
    //         $this->save();

    //         // Cập nhật madm trong bảng loaisanpham
    //         ProductType::where('categoryId', $this->categoryId)
    //             ->update(['categoryId' => $categoryId]);

    //         DB::commit();

    //     } catch (\Exception $e) {
    //         DB::rollback();
    //         throw $e;
    //     }
    // }

}

