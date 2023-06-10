<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory;
    protected $table = 'messages';
    protected $fillable = [
        'sender_id',
        'receiver_id',
        'content'
    ];
    protected $primaryKey = 'id';

    protected $hidden = [
        'create_at',
        'update_at'

    ];
}
