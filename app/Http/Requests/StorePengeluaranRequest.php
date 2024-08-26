<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePengeluaranRequest extends FormRequest
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
        return [
            'kode' => 'required|string|max:100|not_regex:/^\s*$/',
            'total' => 'required|numeric|min:0',
            'metode' => 'required|string|in:Cash,Debit,Kredit',
            'keterangan' => 'nullable|string',
            'nama' => 'required|string|max:255',
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
            'kode.required' => 'Kode harus diisi.',
            'kode.string' => 'Kode harus berupa teks.',
            'kode.max' => 'Kode tidak boleh lebih dari :max karakter.',
            'kode.not_regex' => 'Format Kode tidak valid.',

            'total.required' => 'Total harus diisi.',
            'total.numeric' => 'Total harus berupa angka.',
            'total.min' => 'Total tidak boleh kurang dari :min.',

            'metode.required' => 'Metode pembayaran harus dipilih.',
            'metode.string' => 'Metode pembayaran harus berupa teks.',
            'metode.in' => 'Metode pembayaran harus salah satu dari: cash, debit, kredit.',

            'keterangan.string' => 'Keterangan harus berupa teks.',

            'nama.required' => 'Nama harus diisi.',
            'nama.string' => 'Nama harus berupa teks.',
            'nama.max' => 'Nama tidak boleh lebih dari :max karakter.',
        ];
    }
}
