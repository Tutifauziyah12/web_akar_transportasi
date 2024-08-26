<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sewa extends Model
{
    use HasFactory;
    protected $table = 'sewa';

    protected $primaryKey = 'id_sewa';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = [
        'id_sewa',
        'nama',
        'mulai_tanggal',
        'akhir_tanggal',
        'pengembalian_tanggal',
        'total',
    ];

    public function kas()
    {
        return $this->belongsTo(Kas::class, 'id_kas', 'id_sewa');
    }

    public function sewaKendaraan()
    {
        return $this->hasMany(SewaKendaraan::class, 'id_sewa_kendaraans', 'id_sewa');
    }

    public function pendapatanLainnya()
    {
        return $this->hasMany(SewaLainnya::class, 'id_sewa_lainnya', 'id_sewa');
    }

    public function historyPembayaran()
    {
        return $this->hasMany(HistoryPembayaran::class, 'sewa_id', 'id_sewa');
    }
}
