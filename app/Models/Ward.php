<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ward extends Model
{
    use HasFactory;
    protected $table = "wards";

    protected $fillable = [
        'wardId',
        'name',
        'districtId'
    ];

    public $incrementing = false;
    protected $primaryKey = 'wardId';
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    public function district()
    {
        return $this->belongsTo(District::class, 'districtId', 'districtId');
    }
    protected $hidden = [
        'create_at',
        'update_at'

    ];
}
