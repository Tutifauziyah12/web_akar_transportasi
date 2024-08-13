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
        Schema::create('pengeluarans', function (Blueprint $table) {
            // $table->id();
            $table->string('id_pengeluarans')->unique();
            $table->string('nama');
            $table->date('tanggal');
            $table->text('keterangan')->nullable();
            $table->bigInteger('total');
            $table->string('metode');
            $table->timestamps();

            $table->foreign('id_pengeluarans')->references('id_kas')->on('kas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengeluarans');
    }
};
