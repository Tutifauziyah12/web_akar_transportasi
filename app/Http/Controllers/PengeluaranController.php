<?php

namespace App\Http\Controllers;

use App\Models\Pengeluaran;
use App\Http\Requests\StorePengeluaranRequest;
use App\Http\Requests\UpdatePengeluaranRequest;
use App\Models\Kas;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;



class PengeluaranController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Pengeluaran::query();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('id_pengeluarans', 'like', '%' . $searchTerm . '%')
                    ->orWhere('nama', 'like', '%' . $searchTerm . '%')
                    ->orWhere('keterangan', 'like', '%' . $searchTerm . '%')
                    ->orWhere('total', 'like', '%' . $searchTerm . '%')
                    ->orWhere('metode', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderByDesc('id_pengeluarans');

        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d', strtotime($request->input('endDate')));

            $query->whereBetween('tanggal', [$startDate, $endDate]);
        }

        $pengeluaran = $query->paginate(10);

        $lastSewa = Pengeluaran::where('id_pengeluarans', 'like', 'P24%')->orderBy('id_pengeluarans', 'desc')->first();
        $lastKode = $lastSewa ? $lastSewa->id_pengeluarans : "P24000";

        return Inertia::render('Pengeluaran/Index', [
            'pengeluaran' => $pengeluaran,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'lastKode' => $lastKode,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $lastPengeluaran = Pengeluaran::where('kode', 'like', 'P24%')->orderBy('kode', 'desc')->first();
        $lastKode = $lastPengeluaran ? $lastPengeluaran->kode : "P24000";

        return Inertia::render('Pengeluaran/Create', [
            'lastKode' => $lastKode
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StorePengeluaranRequest $request)
    {

        try {
            DB::beginTransaction();
            $validated = $request->validated();

            $kas = Kas::create([
                'id_kas' => $request['kode'], // Metode untuk menghasilkan kode kas unik
            ]);

            $pengeluaran = new Pengeluaran();
            $pengeluaran->id_pengeluarans = $validated['kode'];
            $pengeluaran->tanggal = $validated['tanggal'];
            $pengeluaran->total = $validated['total'];
            $pengeluaran->metode = $validated['metode'];
            $pengeluaran->keterangan = $validated['keterangan'];
            $pengeluaran->nama = $validated['nama'];

            $pengeluaran->save();

            DB::commit();
            return Redirect::route('pengeluaran.index')
                ->with('message', 'Data pengeluaran berhasil ditambahkan.');
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Pengeluaran $pengeluaran, $kode)
    {
        $lastPengeluaran = Pengeluaran::where('id_pengeluarans', 'like', $kode)
            ->orderBy('id_pengeluarans', 'desc')
            ->first();

        return response()->json($lastPengeluaran);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pengeluaran $pengeluaran)
    {
        return Inertia::render('Pengeluaran/Edit', [
            'pengeluaran' => $pengeluaran,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Pengeluaran $pengeluaran, UpdatePengeluaranRequest $request)
    {

        try {
            DB::beginTransaction();
            $validated = $request->validated();
            $pengeluaran = Pengeluaran::where('id_pengeluarans', $validated['kode'])->first();
            if ($pengeluaran) {
                $pengeluaran->tanggal = $validated['tanggal'];
                $pengeluaran->total = $validated['total'];
                $pengeluaran->metode = $validated['metode'];
                $pengeluaran->keterangan = $validated['keterangan'];
                $pengeluaran->nama = $validated['nama'];

                $pengeluaran->save();
            } else {
                return back()->withInput()->withErrors(['message' => 'Pengeluaran dengan kode tersebut tidak ditemukan.']);
            }
            DB::commit();

            return redirect()->route('pengeluaran.index')->with('message', 'Data pengeluaran berhasil diperbarui.');
        } catch (\Exception $e) {

            return redirect()->back()->withInput()->withErrors(['error' => 'Terjadi kesalahan saat memperbarui data pengeluaran. Silakan coba lagi.']);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pengeluaran $pengeluaran, $kode)
    {
        try {
            DB::beginTransaction();

            Kas::where('id_kas', $kode)->delete();
            Pengeluaran::where('id_pengeluarans', $kode)->delete();

            DB::commit();

            return redirect()->route('pengeluaran.index')->with('message', sprintf(
                "Data pengeluaran dengan code %s berhasil dihapus!",
                $kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }
}
