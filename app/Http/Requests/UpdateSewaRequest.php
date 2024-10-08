<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateSewaRequest extends FormRequest
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
            'kode' => 'required|string|max:100|not_regex:/^\s*$/',
            'nama' => 'required|string|max:100|not_regex:/^\s*$/',
            'mulai_tanggal' => 'required|date',
            'akhir_tanggal' => 'required|date|after_or_equal:mulai_tanggal',
            'pengembalian_tanggal' => 'nullable|date',
            'total' => 'nullable|numeric|min:0',
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

            'kode.required' => 'Kode harus diisi.',
            'kode.string' => 'Kode harus berupa teks.',
            'kode.max' => 'Kode tidak boleh lebih dari :max karakter.',
            'kode.not_regex' => 'Format Kode tidak valid.',

            'mulai_tanggal.required' => 'Tanggal mulai harus diisi.',
            'mulai_tanggal.date' => 'Format tanggal mulai tidak valid.',
            'akhir_tanggal.required' => 'Tanggal akhir harus diisi.',
            'akhir_tanggal.date' => 'Format tanggal akhir tidak valid.',
            'akhir_tanggal.after_or_equal' => 'Tanggal akhir harus setelah atau sama dengan tanggal mulai.',

            'pengembalian_tanggal.date' => 'Format tanggal pengembalian tidak valid.',

            // 'total.required' => 'Total harus diisi.',
            'total.numeric' => 'Total harus berupa angka.',
            'total.min' => 'Total tidak boleh kurang dari :min.',
        ];
    }
};
