<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Mail\Mailables\Content;

class WatchLater extends Model
{
    use HasFactory;
    public $timestamps = false;
    protected $table = 'watch_laters';
    protected $primaryKey = 'id';

    protected $fillable = [
        'id_user',
        'id_content',
        'date_added',
    ];

    public function user(){
        return $this->belongsTo(User::class, 'id_user');
    }

    public function content(){
        return $this->belongsTo(Contents::class, 'id_content');
    }
}
