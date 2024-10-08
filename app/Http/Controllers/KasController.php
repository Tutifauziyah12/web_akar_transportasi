<?php

namespace App\Http\Controllers;

use App\Models\Kas;
use App\Http\Requests\StoreKasRequest;
use App\Http\Requests\UpdateKasRequest;
use App\Models\HistoryPembayaran;
use App\Models\Pengeluaran;
use App\Models\Sewa;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KasController extends Controller
{
    public function __construct()
    {
        $this->middleware('Owner');
    }

    public function index(Request $request)
    {
        $query = Kas::query();

        if ($request->has('search')) {
            $query->where(function ($q) use ($request) {
                $searchTerm = $request->input('search');
                $q->where('jenis', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('nama', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('tanggal', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('biaya', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('pembayaran', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('keterangan', 'LIKE', "%{$searchTerm}%");
            });
        }

        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));
            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }

        $totalsQuery = clone $query;

        $totalBiayaMasuk = $totalsQuery->where('jenis', 'Masuk')->sum('biaya');

        $totalsQuery = clone $query;

        $totalBiayaKeluar = $totalsQuery->where('jenis', 'Keluar')->sum('biaya');

        $kases = $query->paginate(10);

        return Inertia::render('Kas/Index', [
            'kases' => $kases,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'totalBiayaMasuk' => $totalBiayaMasuk,
            'totalBiayaKeluar' => $totalBiayaKeluar,
        ]);
    }

    public function indexPendapatan(Request $request)
    {
        $query = HistoryPembayaran::query();

        $searchTerm = $request->input('search', '');
        if ($searchTerm !== '') {
            $query->where(function ($q) use ($searchTerm) {
                $q->where('sewa_id', 'like', '%' . $searchTerm . '%')
                    ->orWhereHas('sewa', function ($q) use ($searchTerm) {
                        $q->where('nama', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('sewa.sewaKendaraan.kendaraan', function ($q) use ($searchTerm) {
                        $q->where('nama', 'like', '%' . $searchTerm . '%')
                            ->orWhere('no_registrasi', 'like', '%' . $searchTerm . '%');
                    })
                    ->orWhereHas('sewa.pendapatanLainnya', function ($q) use ($searchTerm) {
                        $q->where('nama', 'like', '%' . $searchTerm . '%')
                            ->orWhere('metode', 'like', '%' . $searchTerm . '%')
                            ->orWhere('total', 'like', '%' . $searchTerm . '%');
                    });
            });
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $startDate = date('Y-m-d 00:00:00', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d 23:59:59', strtotime($request->input('endDate')));
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $sewa = $query->with('sewa.sewaKendaraan.kendaraan', 'sewa.pendapatanLainnya', 'sewa.historyPembayaran')->where('sewa_id', 'like', 'PS%')->orderBy('created_at', 'asc')->get();

        return Inertia::render('Kas/IndexPendapatan', [
            'status' => session('status'),
            'searchTerm' => $searchTerm,
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'category' => $request->input('category'),
            'sewa' => $sewa
        ]);
    }

    public function indexPengeluaran(Request $request)
    {
        $query = Pengeluaran::query();

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('id_pengeluarans', 'like', '%' . $searchTerm . '%')
                    ->orWhere('nama', 'like', '%' . $searchTerm . '%')
                    ->orWhere('keterangan', 'like', '%' . $searchTerm . '%');
            });
        }

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));

            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $query->orderByDesc('id_pengeluarans');

        $pengeluaran = $query->with('historyPembayaran')->where('id_pengeluarans', 'like', 'P%')
            ->where('id_pengeluarans', 'not like', 'PS%')->get();

        return Inertia::render('Kas/IndexPengeluaran', [
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'pengeluaran' => $pengeluaran
        ]);
    }


    public function indexBukuBesar(Request $request)
    {
        $query = HistoryPembayaran::with('pengeluaran', 'sewa.sewaKendaraan.kendaraan', 'sewa.pendapatanLainnya', 'sewa.historyPembayaran',);

        if ($request->filled('startDate') && $request->filled('endDate')) {
            $startDate = date('Y-m-d 00:00:00', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d 23:59:59', strtotime($request->input('endDate')));
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $kasList = $query->get();

        return Inertia::render('Kas/IndexBukuBesar', [
            'status' => session('status'),
            'kasList' => $kasList,
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
        ]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function createSewa()
    {
        return Inertia::render('Sewa_Kendaraan/Index');
    }

    public function createLainnya()
    {
        return Inertia::render('Kas/CreateLainnya');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreKasRequest $request)
    {
        $validated = $request->validated();

        $kas = new Kas($validated);

        $kas->save();

        $namaKas = $kas->nama;


        return redirect()->route('kas.index')->with('message', sprintf("Kas atas nama %s berhasil dibuat!", $namaKas));
    }

    /**
     * Display the specified resource.
     */
    public function show(Kas $kas)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Kas $kas) {}

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateKasRequest $request, Kas $kas) {}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Kas $kas) {}
}
