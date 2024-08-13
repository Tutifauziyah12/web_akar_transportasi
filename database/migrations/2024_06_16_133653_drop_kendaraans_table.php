<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Jalankan migrasi.
     */
    public function up(): void
    {
        Schema::create('kendaraans', function (Blueprint $table) {
            $table->id("id_kendaraans");
            $table->string('nama', 100);
            $table->string('no_registrasi', 15)->unique();
            $table->string('jenis', 50);
            $table->string('tahun_pembuatan', 4);
            $table->string('warna', 50);
            $table->string('status', 50);
            $table->timestamps();
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        Schema::dropIfExists('kendaraans');
    }
};
