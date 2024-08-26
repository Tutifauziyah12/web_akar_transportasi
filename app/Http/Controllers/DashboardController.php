<?php

namespace App\Http\Controllers;

use App\Models\HistoryPembayaran;
use App\Models\Kendaraan;
use App\Models\Pengeluaran;
use App\Models\Sewa;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    public function index()
    {
        $today = Carbon::today('Asia/Jakarta');
        // $totalSewaHariIni = Sewa::whereDate('mulai_tanggal', $today)->count();

        $endOfMonth = Carbon::now()->endOfMonth();
        // $sewaAktifSampaiAkhirBulan = Sewa::whereDate('akhir_tanggal', '>', $today)
        //     ->whereDate('akhir_tanggal', '<=', $endOfMonth)
        //     ->count();
        $startOfMonth = Carbon::now()->startOfMonth();
        // $totalSewaBulanIni = Sewa::where(function ($query) use ($startOfMonth, $endOfMonth) {
        //     $query->whereDate('mulai_tanggal', '>=', $startOfMonth)
        //         ->orWhereDate('akhir_tanggal', '<=', $endOfMonth);
        // })
        //     ->count();

        $totalUangMasukHariIni = HistoryPembayaran::whereDate('created_at', $today)
            ->sum('total');
        // dd($totalUangSewaKendaraan);
        // $totalUangLainnya = Sewa::whereDate('mulai_tanggal', $today)
        //     ->with('pendapatanLainnya')
        //     ->get()
        //     ->flatMap(function ($sewa) {
        //         return $sewa->pendapatanLainnya;
        //     })
        //     ->sum('pembayaran');
        // $totalUangMasukHariIni = $totalUangSewaKendaraan + $totalUangLainnya;

        $totalUangKeluarHariIni = Pengeluaran::whereDate('tanggal', $today)
            ->sum('total');

        $totalUangMasukBulanIni = HistoryPembayaran::where(function ($query) use ($startOfMonth, $endOfMonth) {
            $query->whereBetween('created_at', [$startOfMonth, $endOfMonth])
                ->orWhereBetween('created_at', [$startOfMonth, $endOfMonth]);
        })
            ->sum('total');

        $totalUangKeluarBulanIni = Pengeluaran::whereBetween('tanggal', [$startOfMonth, $endOfMonth])
            ->sum('total');


        $kendaraanAktif = Kendaraan::where('status', 'Aktif')->count();

        $kendaraanPerbaikan = Kendaraan::where('status', 'Perbaikan')->count();

        $kendaraanTidakAktif = Kendaraan::where('status', '!=', 'Aktif')
            ->where('status', '!=', 'Perbaikan')
            ->count();

        return Inertia::render('Dashboard', [
            // 'totalSewaHariIni' => $totalSewaHariIni,
            // 'sewaAktifSampaiAkhirBulan' => $sewaAktifSampaiAkhirBulan,
            // 'totalSewaBulanIni' => $totalSewaBulanIni,
            'kendaraanAktif' => $kendaraanAktif,
            'kendaraanPerbaikan' => $kendaraanPerbaikan,
            'kendaraanTidakAktif' => $kendaraanTidakAktif,
            'totalUangMasukHariIni' => $totalUangMasukHariIni,
            'totalUangKeluarHariIni' => $totalUangKeluarHariIni,
            'totalUangMasukBulanIni' => $totalUangMasukBulanIni,
            'totalUangKeluarBulanIni' => $totalUangKeluarBulanIni,
        ]);
    }
}
