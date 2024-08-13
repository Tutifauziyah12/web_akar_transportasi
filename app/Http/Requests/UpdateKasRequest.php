<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateKasRequest extends FormRequest
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
    public function rules()
    {
        return [
            'nama' => 'required|string|max:100|not_regex:/^\s*$/',
            'jenis' => 'required|string|max:100|not_regex:/^\s*$/',
            'tanggal' => 'required|date',
            'biaya' => 'required|integer|min:0',
            'pembayaran' => 'required|string|max:255|not_regex:/^\s*$/',
            'keterangan' => 'nullable|string|max:255|not_regex:/^\s*$/',
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
            'nama.required' => 'Jenis harus diisi.',
            'nama.string' => 'Jenis harus berupa teks.',
            'nama.max' => 'Jenis tidak boleh lebih dari :max karakter.',
            'nama.not_regex' => 'Format jenis tidak valid.',
            'jenis.required' => 'Jenis harus diisi.',
            'jenis.string' => 'Jenis harus berupa teks.',
            'jenis.max' => 'Jenis tidak boleh lebih dari :max karakter.',
            'jenis.not_regex' => 'Format jenis tidak valid.',
            'tanggal.required' => 'Tanggal harus diisi.',
            'tanggal.date' => 'Tanggal harus berupa tanggal yang valid.',
            'biaya.required' => 'Biaya harus diisi.',
            'biaya.integer' => 'Biaya harus berupa angka.',
            'biaya.min' => 'Biaya tidak boleh kurang dari :min.',
            'pembayaran.required' => 'Pembayaran harus diisi.',
            'pembayaran.string' => 'Pembayaran harus berupa teks.',
            'pembayaran.max' => 'Pembayaran tidak boleh lebih dari :max karakter.',
            'pembayaran.not_regex' => 'Format pembayaran tidak valid.',
            'keterangan.string' => 'Keterangan harus berupa teks.',
            'keterangan.max' => 'Keterangan tidak boleh lebih dari :max karakter.',
            'keterangan.not_regex' => 'Format keterangan tidak valid.',
        ];
    }
}
