<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateKendaraanRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $kendaraanId = $this->kendaraan->id_kendaraans;
        return [
            'nama' => 'required|string|max:100|not_regex:/^\s*$/',
            'no_registrasi' => 'required|string|max:15|not_regex:/^\s*$/|unique:kendaraans,no_registrasi,' . $kendaraanId . ',id_kendaraans',
            'jenis' => 'required|string|max:100|not_regex:/^\s*$/',
            'tahun_pembuatan' => 'required|string|date_format:Y|max:' . date('Y'),
            'warna' => 'required|string|max:50|not_regex:/^\s*$/',
            'status' => ['required', 'string', Rule::in(['Aktif', 'Perbaikan', 'Tidak Aktif'])],
        ];
    }

    /**
     * Custom error messages.
     *
     * @return array
     */
    public function messages()
    {
        return [
            'nama.required' => 'Nama harus diisi',
            'nama.string' => 'Nama harus berupa teks.',
            'nama.max' => 'Nama tidak boleh lebih dari :max karakter',
            'nama.not_regex' => 'Format nama tidak valid',
            'no_registrasi.required' => 'Nomor registrasi harus diisi',
            'no_registrasi.string' => 'Nomor registrasi harus berupa teks',
            'no_registrasi.max' => 'Nomor registrasi tidak boleh lebih dari :max karakter',
            'no_registrasi.not_regex' => 'Format nomor registrasi tidak valid',
            'no_registrasi.unique' => 'Nomor registrasi sudah ada',
            'jenis.required' => 'Jenis harus diisi',
            'jenis.string' => 'Jenis harus berupa teks',
            'jenis.max' => 'Jenis tidak boleh lebih dari :max karakter',
            'jenis.not_regex' => 'Format jenis tidak valid',
            'tahun_pembuatan.required' => 'Tahun pembuatan harus diisi',
            'tahun_pembuatan.string' => 'Tahun pembuatan harus berupa teks',
            'tahun_pembuatan.date_format' => 'Tahun pembuatan harus dalam format :format',
            'tahun_pembuatan.max' => 'Tahun pembuatan tidak boleh lebih dari :max',
            'warna.required' => 'Warna harus diisi',
            'warna.string' => 'Warna harus berupa teks',
            'warna.max' => 'Warna tidak boleh lebih dari :max karakter',
            'warna.not_regex' => 'Format warna tidak valid',
            'status.required' => 'Status harus diisi',
            'status.string' => 'Status harus berupa teks',
            'status.in' => 'Status harus salah satu dari: :values',
        ];
    }
}
