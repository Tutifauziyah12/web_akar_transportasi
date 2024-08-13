<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SewaKendaraan extends Model
{
    use HasFactory;

    protected $table = 'sewa_kendaraans';

    protected $primaryKey = 'id_sewa_kendaraans';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id_sewa_kendaraans',
        'kendaraan_id',
    ];

    public function kendaraan()
    {
        return $this->belongsTo(Kendaraan::class, 'kendaraan_id', 'id_kendaraans');
    }

    public function sewa()
    {
        return $this->belongsTo(Sewa::class, 'id_sewa_kendaraans', 'id_sewa');
    }
}
