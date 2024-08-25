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
        Schema::create('history_pembayaran', function (Blueprint $table) {
            $table->id('id_history_pembayaran');
            $table->string('sewa_id');
            $table->bigInteger('total');
            $table->string('metode');
            $table->timestamps();

            $table->foreign('sewa_id')->references('id_sewa')->on('sewa')->onDelete('cascade');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('history_pembayaran');
    }
};
