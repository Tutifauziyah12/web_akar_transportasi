<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistoryPembayaran extends Model
{
    use HasFactory;
    protected $table = 'history_pembayaran';

    protected $primaryKey = 'id_history_pembayaran';
    public $incrementing = false;
    protected $keyType = 'integer';
    protected $fillable = [
        'id_history_pembayaran',
        'pengeluaran_id',
        'sewa_id',
        'total',
        'metode',
        'created_at',
        'updated_at'
    ];
    public function historyPembayaran()
    {
        return $this->hasMany(HistoryPembayaran::class);
    }

    public function sewa()
    {
        return $this->belongsTo(Sewa::class, 'sewa_id');
    }

    public function pengeluaran()
    {
        return $this->belongsTo(Sewa::class, 'sewa_id');
    }
}
