<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InvoiceDetail extends Model
{
    use HasFactory;
    protected $table = 'invoice_details';
    protected $fillable = [
        'invoiceDetailId',
        'invoiceId',
        'productId',
        'number',
        'price',
        'sizeValue',

    ];
    public $incrementing = false;
    protected $primaryKey  = [
        'invoiceDetailId'
    ];
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
