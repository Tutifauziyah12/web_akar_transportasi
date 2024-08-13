<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kendaraan extends Model
{
    use HasFactory;

    protected $table = 'kendaraans';
    protected $primaryKey = 'id_kendaraans';
    public $incrementing = false;
    protected $keyType = 'integer';

    protected $fillable = [
        'nama',
        'no_registrasi',
        'jenis',
        'tahun_pembuatan',
        'status',
        'warna'
    ];

    // Mendefinisikan relasi one-to-many dengan SewaKendaraan
    public function sewaKendaraans()
    {
        return $this->hasMany(SewaKendaraan::class);
    }
}
