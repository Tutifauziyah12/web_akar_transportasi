<?php

namespace App\Http\Controllers;

use App\Models\SewaKendaraan;
use App\Http\Requests\StoreSewaKendaraanRequest;
use App\Http\Requests\UpdateSewaKendaraanRequest;
use App\Http\Requests\UpdateSewaRequest;
use App\Models\HistoryPembayaran;
use App\Models\Kas;
use App\Models\Kendaraan;
use App\Models\Sewa;
use App\Models\SewaLainnya;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Validator;

class SewaController extends Controller
{
    public function index(Request $request)
    {
        $query = Sewa::query();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('id_sewa', 'like', '%' . $searchTerm . '%')
                    ->orWhere('nama', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderByDesc('id_sewa');

        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d 00:00:00', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d 23:59:59', strtotime($request->input('endDate')));
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }

        $sewa = $query->with('sewaKendaraan.kendaraan', 'historyPembayaran', 'pendapatanLainnya')->paginate(10);

        $kendaraans = Kendaraan::where('status', 'Aktif')->get();

        $lastSewa = Sewa::where('id_sewa', 'like', 'PS24%')->orderBy('id_sewa', 'desc')->first();
        $lastKode = $lastSewa ? $lastSewa->id_sewa : "PS24000";
        return Inertia::render('Pendapatan/Index', [
            'sewa' => $sewa,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
            'kendaraans' => $kendaraans,
            'lastKode' => $lastKode,
        ]);
    }

    public function indexLainnya(Request $request)
    {
        $query = SewaLainnya::query();

        if ($request->has('search')) {
            $searchTerm = $request->input('search');
            $query->where(function ($q) use ($searchTerm) {
                $q->where('id_sewa_lainnya', 'like', '%' . $searchTerm . '%')
                    ->orWhere('nama', 'like', '%' . $searchTerm . '%')
                    ->orWhere('jumlah', 'like', '%' . $searchTerm . '%')
                    ->orWhere('total', 'like', '%' . $searchTerm . '%')
                    ->orWhere('metode', 'like', '%' . $searchTerm . '%');
            });
        }

        $query->orderByDesc('id_sewa_lainnya');

        if ($request->has('startDate') && $request->has('endDate')) {
            $startDate = date('Y-m-d 00:00:00', strtotime($request->input('startDate')));
            $endDate = date('Y-m-d 23:59:59', strtotime($request->input('endDate')));
            $query->whereBetween('created_at', [$startDate, $endDate]);
        }




        $sewa = $query->with('sewa')->paginate(10);

        return Inertia::render('Pendapatan/IndexLainnya', [
            'sewa' => $sewa,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
            'startDate' => $request->input('startDate'),
            'endDate' => $request->input('endDate'),
        ]);
    }


    public function create()
    {
        $kendaraans = Kendaraan::all();
        $sewa = Sewa::all();

        $lastSewa = Sewa::where('kode', 'like', 'PS24%')->orderBy('kode', 'desc')->first();
        $lastKode = $lastSewa ? $lastSewa->kode : "PS24000";

        return Inertia::render('Pendapatan/Create', [
            'kendaraans' => $kendaraans,
            'sewa' => $sewa,
            'lastKode' => $lastKode
        ]);
    }

    public function store(StoreSewaKendaraanRequest $request)
    {
        try {

            // dd($request);

            DB::beginTransaction();

            $validated = $request->validated();

            $kas = Kas::create([
                'id_kas' => $request['kode'],
            ]);

            $sewa = Sewa::create([
                'id_sewa' => $request->input('kode'),
                'nama' => $request->input('nama'),
                'mulai_tanggal' => $request->input('mulai_tanggal'),
                'akhir_tanggal' => $request->input('akhir_tanggal'),
                'total' => $request->input('total'),
                'pembayaran' => $request->input('pembayaran'),
            ]);

            foreach ($request->input('kendaraan_ids') as $kendaraanId) {
                SewaKendaraan::create([
                    'id_sewa_kendaraans' => $request->input('kode'),
                    'kendaraan_id' => $kendaraanId,
                ]);
            }

            $errors = [];
            foreach ($request->input('pendapatanLainnya') as $index => $sewaLainnyaItem) {
                $validator = Validator::make($sewaLainnyaItem, [
                    'nama' => 'required|string|max:255',
                    'total' => 'required|numeric|min:0',
                    'jumlah' => 'required|integer|min:0',
                ]);

                if ($validator->fails()) {
                    $errorMessage = implode(' ', $validator->errors()->all());
                    return back()->withInput()->withErrors($errorMessage);
                } else {
                    SewaLainnya::create([
                        'id_sewa_lainnya' => $request->input('kode'),
                        'nama' => $sewaLainnyaItem['nama'],
                        'total' => $sewaLainnyaItem['total'],
                        'jumlah' => $sewaLainnyaItem['jumlah'],
                    ]);
                }
            }

            $validatorPembayaran = Validator::make($request->all(), [
                'total' => 'required|numeric|min:0',
                'metode' => 'required|string|in:Cash,Debit,Kredit',
            ], [
                'total.required' => 'Total pembayaran wajib diisi.',
                'total.numeric' => 'Total pembayaran harus berupa angka.',
                'total.min' => 'Total pembayaran minimal 0.',
                'metode.required' => 'Metode pembayaran wajib diisi.',
                'metode.string' => 'Metode pembayaran harus berupa teks.',
                'metode.in' => 'Metode pembayaran harus salah satu dari: Cash, Debit, Kredit.',
            ]);

            if ($validatorPembayaran->fails()) {
                foreach ($validatorPembayaran->errors()->messages() as $field => $messages) {
                    $errors[$field] = $messages;
                }
            } else {
                HistoryPembayaran::create([
                    'sewa_id' => $request['kode'],
                    'total' => $request->input('pembayaran'),
                    'metode' => $request->input('metode'),
                ]);
            }

            if (!empty($errors)) {
                DB::rollback();
                return back()->withInput()->withErrors($errors);
            }

            DB::commit();

            return redirect()->route('sewa.index')->with('message', sprintf(
                "Sewa dengan code %s berhasil dibuat!",
                $request['kode']
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
        }
    }

    public function show(Sewa $sewa, $kode)
    {
        $lastSewa = Sewa::with('sewaKendaraan.kendaraan', 'historyPembayaran', 'pendapatanLainnya')
            ->where('id_sewa', 'like', $kode)
            ->orderBy('id_sewa', 'desc')
            ->first();

        return response()->json($lastSewa);
    }

    public function cetak(Sewa $sewa, $kode)
    {
        // dd($kode);
        $lastSewa = Sewa::with('sewaKendaraan.kendaraan', 'pendapatanLainnya')
            ->where('kode', 'like', $kode)
            ->orderBy('kode', 'desc')
            ->first();
        return response()->json($lastSewa);
    }

    public function edit(Sewa $sewa)
    {
        $sewa->load('sewaKendaraan.kendaraan', 'pendapatanLainnya');
        $kendaraan_ids = $sewa->sewaKendaraan->pluck('kendaraan_id')->toArray();

        $kendaraans = Kendaraan::all();

        return Inertia::render('Pendapatan/Edit', [
            'sewa' => $sewa,
            'kendaraans' => $kendaraans,
            'kendaraan_ids' => $kendaraan_ids,
            'pendapatanLainnya' => $sewa->pendapatanLainnya,
        ]);
    }

    public function update(Sewa $sewa, UpdateSewaRequest $request)
    {
        try {
            // dd($request);
            DB::beginTransaction();

            $validated = $request->validated();

            $sewa->update($validated);

            SewaKendaraan::where('id_sewa_kendaraans', $request['kode'])->delete();

            foreach ($request->input('kendaraan_ids') as $kendaraanId) {
                SewaKendaraan::create([
                    'id_sewa_kendaraans' => $request['kode'],
                    'kendaraan_id' => $kendaraanId,
                ]);
            }

            SewaLainnya::where('id_sewa_lainnya', $request['kode'])->delete();

            $errors = [];
            foreach ($request->input('pendapatanLainnya') as $index => $sewaLainnyaItem) {
                $validator = Validator::make($sewaLainnyaItem, [
                    'nama' => 'required|string|max:255',
                    'total' => 'required|numeric|min:0',
                    'jumlah' => 'required|integer|min:0',
                ]);

                if ($validator->fails()) {
                    $errors[$index] = $validator->errors()->all();
                } else {
                    SewaLainnya::create([
                        'id_sewa_lainnya' => $request['kode'],
                        'nama' => $sewaLainnyaItem['nama'],
                        'total' => $sewaLainnyaItem['total'],
                        'jumlah' => $sewaLainnyaItem['jumlah'],
                    ]);
                }
            }

            HistoryPembayaran::where('sewa_id', $request['kode'])->delete();
            // dd($request);
            foreach ($request->input('history_pembayaran_ids') as $index => $history_pembayaranItem) {
                $validator = Validator::make($history_pembayaranItem, [
                    'sewa_id' => 'required|string|max:255',
                    'total' => 'required|numeric|min:0',
                    'metode' => 'required|string|in:Cash,Debit,Kredit',
                ]);

                if ($validator->fails()) {
                    $errors[$index] = $validator->errors()->all();
                } else {
                    HistoryPembayaran::create([
                        'sewa_id' => $request['kode'],
                        'total' => $history_pembayaranItem['total'],
                        'metode' => $history_pembayaranItem['metode'],
                        'created_at' => $history_pembayaranItem['created_at'],
                        'updated_at' => $history_pembayaranItem['updated_at'],                        
                    ]);
                }
            }

            if ($request->input('pembayaran') !== 0) {
                $validatorPembayaran = Validator::make($request->all(), [
                    'total' => 'required|numeric|min:0',
                    'metode' => 'required|string|in:Cash,Debit,Kredit',
                ], [
                    'total.required' => 'Total pembayaran wajib diisi.',
                    'total.numeric' => 'Total pembayaran harus berupa angka.',
                    'total.min' => 'Total pembayaran minimal 0.',
                    'metode.required' => 'Metode pembayaran wajib diisi.',
                    'metode.string' => 'Metode pembayaran harus berupa teks.',
                    'metode.in' => 'Metode pembayaran harus salah satu dari: Cash, Debit, Kredit.',
                ]);
    
                if ($validatorPembayaran->fails()) {
                    foreach ($validatorPembayaran->errors()->messages() as $field => $messages) {
                        $errors[$field] = $messages;
                    }
                } else {
                    HistoryPembayaran::create([
                        'sewa_id' => $request['kode'],
                        'total' => $request->input('pembayaran'),
                        'metode' => $request->input('metode'),
                    ]);
                }
            }
            

            if (!empty($errors)) {
                DB::rollback();
                return back()->withInput()->withErrors($errors);
            }

            DB::commit();

            return redirect()->route('sewa.index', ['page' => $request->currentPage])->with('message', sprintf(
                "Sewa dengan code %s berhasil diperbarui!",
                $sewa->kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy(Sewa $sewa, $kode)
    {
        try {
            DB::beginTransaction();

            SewaKendaraan::where('id_sewa_kendaraans', $kode)->delete();

            SewaLainnya::where('id_sewa_lainnya', $kode)->delete();

            Sewa::where('id_sewa', $kode)->delete();

            Kas::where('id_kas', $kode)->delete();

            DB::commit();

            return redirect()->route('sewa.index')->with('message', sprintf(
                "Sewa dengan code %s berhasil dihapus!",
                $kode
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withErrors(['message' => 'Terjadi kesalahan saat menghapus data: ' . $e->getMessage()]);
        }
    }
}
