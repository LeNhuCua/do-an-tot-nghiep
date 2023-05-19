<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAddress extends Model
{
    use HasFactory;
    protected $table = "customer_addresses";


    protected $fillable = [
        'addressId',
        'recipientName',
        'recipientAddress',
        'recipientPhone',
        'provinceId',
        'districtId',
        'wardId',
        'userId',
    ];
    protected $primaryKey = 'customerId';
    public $incrementing = false;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'create_at',
        'update_at',
        'password'
    ];
}







