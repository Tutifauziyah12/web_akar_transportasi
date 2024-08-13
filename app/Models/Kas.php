<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Kas extends Model
{
    use HasFactory;
    protected $table = 'kas';
    protected $fillable = ['id_kas'];

    // Jika Anda tidak menggunakan ID auto-increment, Anda bisa mendefinisikan primary key
    protected $primaryKey = 'id_kas';
    public $incrementing = false;
    protected $keyType = 'string';

    public function sewa()
    {
        return $this->hasOne(Sewa::class, 'id_sewa', 'id_kas');
    }
    public function pengeluaran()
    {
        return $this->hasOne(Pengeluaran::class, 'id_pengeluarans', 'id_kas');
    }
}
