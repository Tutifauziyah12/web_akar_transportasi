<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('sewa', function (Blueprint $table) {
            $table->string('id_sewa')->unique();
            $table->string('nama');
            $table->date('mulai_tanggal');
            $table->date('akhir_tanggal');
            $table->date('pengembalian_tanggal')->nullable();
            $table->bigInteger('total');
            $table->timestamps();

            $table->foreign('id_sewa')->references('id_kas')->on('kas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('sewa');
    }
};
