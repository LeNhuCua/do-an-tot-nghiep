<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Info extends Model
{
    use HasFactory;

    protected $table = 'info';
    protected $fillable = [
        'infoId',
        'phone',
        'accountName',
        'accountNumber',
        'bankName',
    ];
    protected $primaryKey = 'infoId';
    public $incrementing = false;
}
