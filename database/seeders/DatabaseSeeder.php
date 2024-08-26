<?php

namespace Database\Seeders;

use Illuminate\Support\Str;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        /** Seeder users */
        DB::table('users')->insert([
            [
                'name' => 'Pegawai Keuangan',
                'email' => 'pegawai@gmail.com',
                'email_verified_at' => now(),
                'level' => 'Pegawai',
                'password' => Hash::make('password123'),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'owner',
                'email' => 'owner@gmail.com',
                'email_verified_at' => now(),
                'level' => 'Owner',
                'password' => Hash::make('password123'),
                'remember_token' => Str::random(10),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);

        /** Seeder kas */
        DB::table('kas')->insert([
            ['id_kas' => 'PS24001', 'created_at' => now(), 'updated_at' => now()],
            ['id_kas' => 'PS24002', 'created_at' => now(), 'updated_at' => now()],
            ['id_kas' => 'PS24003', 'created_at' => now(), 'updated_at' => now()],
            ['id_kas' => 'P24001', 'created_at' => now(), 'updated_at' => now()],
            ['id_kas' => 'P24002', 'created_at' => now(), 'updated_at' => now()],
            ['id_kas' => 'P24003', 'created_at' => now(), 'updated_at' => now()],
        ]);

        /** Seeder kendaraan */
        DB::table('kendaraans')->insert([
            [
                'nama' => 'Medium Bus',
                'no_registrasi' => 'AB 2987 TR',
                'jenis' => 'Bus',
                'tahun_pembuatan' => '2016',
                'warna' => 'Biru',
                'status' => 'Aktif',
                'created_at' => '2024-07-02 20:41:48',
                'updated_at' => '2024-07-03 08:19:00',
            ],
            [
                'nama' => 'HIACE Prenio Captain',
                'no_registrasi' => 'AB 1987 DC',
                'jenis' => 'Van Komersial',
                'tahun_pembuatan' => '2019',
                'warna' => 'Putih',
                'status' => 'Aktif',
                'created_at' => '2024-07-03 08:21:51',
                'updated_at' => '2024-07-03 10:52:06',
            ],
            [
                'nama' => 'Toyota Fortuner',
                'no_registrasi' => 'AB 9876 CF',
                'jenis' => 'MPV (Multi-Purpose Vehicle)',
                'tahun_pembuatan' => '2022',
                'warna' => 'Hitam',
                'status' => 'Aktif',
                'created_at' => '2024-07-03 08:25:27',
                'updated_at' => '2024-07-03 10:51:50',
            ],
        ]);

        // /** Seeder sewa */
        DB::table('sewa')->insert([
            [
                'id_sewa' => 'PS24001',
                'nama' => 'Imro Atul Azizah',
                'mulai_tanggal' => '2024-07-21',
                'akhir_tanggal' => '2024-07-21',
                'pengembalian_tanggal' => '2024-07-21',
                'total' => 1300000,
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_sewa' => 'PS24002',
                'nama' => 'Putri Dwi Oktaviani',
                'mulai_tanggal' => '2024-07-23',
                'akhir_tanggal' => '2024-07-23',
                'pengembalian_tanggal' => '2024-07-21',
                'total' => 750000,
                'created_at' => '2024-07-21 06:25:38',
                'updated_at' => '2024-07-21 06:25:38',
            ],
            [
                'id_sewa' => 'PS24003',
                'nama' => 'Riki Faturohman',
                'mulai_tanggal' => '2024-07-21',
                'akhir_tanggal' => '2024-07-21',
                'pengembalian_tanggal' => '2024-07-21',
                'total' => 650000,
                'created_at' => '2024-07-20 06:26:23',
                'updated_at' => '2024-07-20 06:26:23',
            ],
        ]);

        DB::table('pengeluarans')->insert([
            [
                'id_pengeluarans' => 'P24001',
                'nama' => 'Avanza Reborn',
                'keterangan' => 'Ganti Oli, servis bulanan',
                'created_at' => '2024-07-16 16:11:38',
                'updated_at' => '2024-07-16 16:11:38',
            ],
            [
                'id_pengeluarans' => 'P24002',
                'nama' => 'Biaya Listrik',
                'keterangan' => 'Pembayaran listrik bulan Juli',
                'created_at' => '2024-07-17 06:42:52',
                'updated_at' => '2024-07-17 06:43:14',
            ],
            [
                'id_pengeluarans' => 'P24003',
                'nama' => 'Kebersihan Mobil',
                'keterangan' => 'Pencucian dan pembersihan mobil pada cucian mobil',
                'created_at' => '2024-07-18 06:14:18',
                'updated_at' => '2024-07-18 06:14:18',
            ],
        ]);

        /** Seeder history Pembayaran */
        DB::table('history_pembayaran')->insert([
            [
                'id_history_pembayaran' => 1,
                'sewa_id' => "PS24001",
                'total' => 1300000,
                'metode' => 'Cash',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_history_pembayaran' => 2,
                'sewa_id' => "PS24003",
                'total' => 100000,
                'metode' => 'Debit',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_history_pembayaran' => 3,
                'sewa_id' => "PS24002",
                'total' => 100000,
                'metode' => 'Cash',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_history_pembayaran' => 4,
                'sewa_id' => "PS24002",
                'total' => 650000,
                'metode' => 'Cash',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_history_pembayaran' => 5,
                'sewa_id' => "PS24003",
                'total' => 100000,
                'metode' => 'Debit',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
        ]);
        DB::table('history_pembayaran')->insert([
            [
                'id_history_pembayaran' => 6,
                'pengeluaran_id' => "P24001",
                'total' => 100000,
                'metode' => 'Debit',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_history_pembayaran' => 7,
                'pengeluaran_id' => "P24002",
                'total' => 1000000,
                'metode' => 'Debit',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_history_pembayaran' => 8,
                'pengeluaran_id' => "P24003",
                'total' => 400000,
                'metode' => 'Debit',
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
        ]);



        /** Seeder sewa_kendaraans */
        DB::table('sewa_kendaraans')->insert([
            [
                'id_sewa_kendaraans' => 'PS24001',
                'kendaraan_id' => 1, // Medium Bus
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
            [
                'id_sewa_kendaraans' => 'PS24002',
                'kendaraan_id' => 2, // HIACE Prenio Captain
                'created_at' => '2024-07-21 06:25:38',
                'updated_at' => '2024-07-21 06:25:38',
            ],
            [
                'id_sewa_kendaraans' => 'PS24003',
                'kendaraan_id' => 3, // Toyota Fortuner
                'created_at' => '2024-07-20 06:24:49',
                'updated_at' => '2024-07-20 06:24:49',
            ],
        ]);
    }
}
