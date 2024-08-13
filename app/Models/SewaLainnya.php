<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SewaLainnya extends Model
{
    use HasFactory;
    protected $table = 'sewa_lainnya';
    protected $primaryKey = 'id_sewa_lainnya';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_sewa_lainnya',
        'nama',
        'total',
        'jumlah',
        'metode',
    ];

    public function sewa()
    {
        return $this->belongsTo(Sewa::class, 'id_sewa_lainnya', 'id_sewa');
    }
}
