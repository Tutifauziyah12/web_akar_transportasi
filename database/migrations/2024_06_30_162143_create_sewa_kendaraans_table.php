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
        Schema::create('sewa_kendaraans', function (Blueprint $table) {
            // $table->id();
            $table->string('id_sewa_kendaraans');
            $table->unsignedBigInteger('kendaraan_id');
            $table->timestamps();

            $table->foreign('kendaraan_id')->references('id_kendaraans')->on('kendaraans')->onDelete('cascade');
            $table->foreign('id_sewa_kendaraans')->references('id_sewa')->on('sewa')->onDelete('cascade');
        });
    }

    /**
     * Batalkan migrasi.
     */
    public function down(): void
    {
        Schema::dropIfExists('sewa_kendaraans');
    }
};
