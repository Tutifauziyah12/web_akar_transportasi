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

        $endOfMonth = Carbon::now()->endOfMonth();

        $startOfMonth = Carbon::now()->startOfMonth();

        $totalUangMasukHariIni = HistoryPembayaran::whereDate('created_at', $today)
            ->whereHas('pengeluaran', function ($query) {
                $query->where('sewa_id', 'like', 'PS%');
            })
            ->sum('total');

        $totalUangKeluarHariIni = HistoryPembayaran::whereDate('created_at', $today)
            ->whereHas('pengeluaran', function ($query) {
                $query->where('pengeluaran_id', 'like', 'P%')
                    ->where('pengeluaran_id', 'not like', 'PS%');
            })
            ->sum('total');

        $totalUangMasukBulanIni = HistoryPembayaran::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('sewa_id', 'like', 'PS%')
            ->sum('total');

        $totalUangKeluarBulanIni = HistoryPembayaran::whereBetween('created_at', [$startOfMonth, $endOfMonth])
            ->where('pengeluaran_id', 'like', 'P%')
            ->where('pengeluaran_id', 'not like', 'PS%')
            ->sum('total');


        $kendaraanAktif = Kendaraan::where('status', 'Aktif')->count();

        $kendaraanPerbaikan = Kendaraan::where('status', 'Perbaikan')->count();

        $kendaraanTidakAktif = Kendaraan::where('status', '!=', 'Aktif')
            ->where('status', '!=', 'Perbaikan')
            ->count();

        return Inertia::render('Dashboard', [
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
