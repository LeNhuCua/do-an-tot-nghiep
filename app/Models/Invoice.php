<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Invoice extends Model
{
    use HasFactory;
    protected $table = 'invoices';
    protected $fillable = [
        'invoiceId',
        'fullName',
        'phoneNumber',
        'totalAmount',
        'userId',
    ];
    protected $primaryKey = 'invoiceId';
    public $incrementing = false;

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'create_at',
        'update_at'

    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'userId', 'userId');
    }


}
