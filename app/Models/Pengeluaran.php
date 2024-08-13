<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pengeluaran extends Model
{
    use HasFactory;
    protected $table = 'pengeluarans';
    protected $primaryKey = 'id_pengeluarans';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id_pengeluarans',
        'nama',
        'tanggal',
        'keterangan',
        'total',
        'metode',
    ];
}
