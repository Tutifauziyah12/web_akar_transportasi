<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\KasController;
use App\Http\Controllers\KendaraanController;
use App\Http\Controllers\PengeluaranController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SewaController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return Inertia::render('Auth/Login', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return redirect()->route('login');
});

Route::get('/login', function () {
    return Inertia::render('Auth/Login', [
        'canRegister' => Route::has('register'),
    ]);
});


Route::get('/dashboard', [DashboardController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('dashboard');


Route::middleware(['auth', 'Owner'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');
    Route::get('/admin/create', [AdminController::class, 'create'])->name('admin.create');
    Route::post('/admin', [AdminController::class, 'store'])->name('admin.store');
    Route::get('/admin/{id}', [AdminController::class, 'show'])->name('admin.show');
    Route::get('/admin/{user}/edit', [AdminController::class, 'edit'])->name('admin.edit');
    Route::put('/admin/{user}', [AdminController::class, 'update'])->name('admin.update');
    Route::delete('/admin/{user}', [AdminController::class, 'destroy'])->name('admin.destroy');

    Route::get('/kendaraan', [KendaraanController::class, 'index'])->name('kendaraan.index');
    Route::get('/kendaraan/create', [KendaraanController::class, 'create'])->name('kendaraan.create');
    Route::post('/kendaraan', [KendaraanController::class, 'store'])->name('kendaraan.store');
    Route::get('/kendaraan/{id}', [KendaraanController::class, 'show'])->name('kendaraan.show');
    Route::get('/kendaraan/{kendaraan}/edit', [KendaraanController::class, 'edit'])->name('kendaraan.edit');
    Route::put('/kendaraan/{kendaraan}', [KendaraanController::class, 'update'])->name('kendaraan.update');
    Route::delete('/kendaraan/{kendaraan}', [KendaraanController::class, 'destroy'])->name('kendaraan.destroy');

    Route::get('/kas/pendapatan', [KasController::class, 'indexPendapatan'])->name('kasPendapatan.index');
    Route::get('/kas/pengeluaran', [KasController::class, 'indexPengeluaran'])->name('kasPengeluaran.index');
    Route::get('/kas/buku_besar', [KasController::class, 'indexBukuBesar'])->name('kasBukuBesar.index');
});


Route::middleware(['auth'])->group(function () {
    Route::get('/pendapatan/sewa_kendaraan', [SewaController::class, 'index'])->name('sewa.index');
    Route::get('/pendapatan/sewa_lainnya', [SewaController::class, 'indexLainnya'])->name('sewaLainnya.index');
    Route::get('/pendapatan/sewa_kendaraan/create', [SewaController::class, 'create'])->name('sewa.create');
    Route::post('/pendapatan/sewa_kendaraan', [SewaController::class, 'store'])->name('sewa_kendaraan.store');
    Route::get('/pendapatan/sewa_kendaraan/{kode}', [SewaController::class, 'show'])->name('sewa.show');;
    Route::get('/pendapatan/sewa_kendaraan/cetak/{kode}', [SewaController::class, 'cetak'])->name('sewa.cetak');;
    Route::get('/pendapatan/sewa_kendaraan/{sewa}/edit', [SewaController::class, 'edit'])->name('sewa.edit');
    Route::put('/pendapatan/sewa_kendaraan/{sewa}', [SewaController::class, 'update'])->name('sewa.update');
    Route::delete('/pendapatan/sewa_kendaraan/{kode}', [SewaController::class, 'destroy'])->name('sewa.destroy');

    Route::get('/pengeluaran', [PengeluaranController::class, 'index'])->name('pengeluaran.index');
    Route::get('/pengeluaran/create', [PengeluaranController::class, 'create'])->name('pengeluaran.create');
    Route::post('/pengeluaran', [PengeluaranController::class, 'store'])->name('pengeluaran.store');
    Route::get('/pengeluaran/{kode}', [PengeluaranController::class, 'show'])->name('pengeluaran.show');;
    Route::get('/pengeluaran/{pengeluaran}/edit', [PengeluaranController::class, 'edit'])->name('pengeluaran.edit');
    Route::put('/pengeluaran/{pengeluaran}', [PengeluaranController::class, 'update'])->name('pengeluaran.update');
    Route::delete('/pengeluaran/{kode}', [PengeluaranController::class, 'destroy'])->name('pengeluaran.destroy');
});
require __DIR__ . '/auth.php';
