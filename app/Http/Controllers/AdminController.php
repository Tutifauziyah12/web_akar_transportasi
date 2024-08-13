<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;



class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('Owner');
    }

    public function index(Request $request)
    {
        $searchTerm = $request->input('search');

        $users = User::query()
            ->when($searchTerm, function ($query, $searchTerm) {
                return $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                        ->orWhere('email', 'like', "%{$searchTerm}%")
                        ->orWhere('level', 'like', "%{$searchTerm}%");
                });
            })
            ->get();

        return Inertia::render('Admin/Index', [
            'users' => $users,
            'status' => session('status'),
            'searchTerm' => $request->input('search'),
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Create');
    }

    public function store(Request $request)
{
    try {
        DB::beginTransaction();

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'level' => 'required|string|max:100',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required' => 'Nama wajib diisi.',
            'name.string' => 'Nama harus berupa teks.',
            'name.max' => 'Nama tidak boleh lebih dari 255 karakter.',
            'email.required' => 'Email wajib diisi.',
            'email.string' => 'Email harus berupa teks.',
            'email.email' => 'Format email tidak valid.',
            'email.max' => 'Email tidak boleh lebih dari 255 karakter.',
            'email.unique' => 'Email sudah terdaftar.',
            'level.required' => 'Level wajib diisi.',
            'level.string' => 'Level harus berupa teks.',
            'level.max' => 'Level tidak boleh lebih dari 100 karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.string' => 'Password harus berupa teks.',
            'password.min' => 'Password harus terdiri dari minimal 8 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak sesuai.',
        ]);

        User::create([
            'name' => $request->name,
            'email' => $request->email,
            'level' => $request->level,
            'password' => Hash::make($request->password),
        ]);

        DB::commit();

        return redirect()->route('admin.index')->with('message', sprintf(
            "User dengan nama %s berhasil dibuat!",
            $request['name']
        ));
    } catch (\Illuminate\Validation\ValidationException $e) {
        DB::rollback();
        return back()->withInput()->withErrors($e->errors());
    } catch (\Exception $e) {
        DB::rollback();
        return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat menyimpan data: ' . $e->getMessage()]);
    }
}


    public function show(User $user, $id)
    {
        try {
            $lastUser = User::where('id_users', $id)
                ->first();

            if (!$lastUser) {
                return response()->json(['message' => 'User not found.'], 404);
            }

            return response()->json($lastUser);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Edit', [
            'user' => $user,
        ]);
    }

    public function update(Request $request, User $user)
    {
        try {
            DB::beginTransaction();
            $request->validate([
                'name' => 'required|string|max:255',
                'email' => [
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users', 'email')->ignore($user->id_users, 'id_users'),
                ],
                'level' => 'required|string|max:255',
                'password' => 'nullable|string|min:8|confirmed',
            ]);
            
            $user->update([
                'name' => $request->name,
                'email' => $request->email,
                'level' => $request->level,
                'password' => $request->password ? bcrypt($request->password) : $user->password,
            ]);

            DB::commit();

            return redirect()->route('admin.index', ['page' => $request->currentPage])->with('message', sprintf(
                "User dengan nama %s berhasil diperbarui!",
                $user->name
            ));
        } catch (\Exception $e) {
            DB::rollback();
            return back()->withInput()->withErrors(['message' => 'Terjadi kesalahan saat memperbarui data: ' . $e->getMessage()]);
        }
    }

    public function destroy(User $user)
    {
        $user->delete();

        return redirect()->route('admin.index')->with('message', sprintf(
            "User dengan nama %s berhasil dihapus!",
            $user->name
        ));
    }
}
