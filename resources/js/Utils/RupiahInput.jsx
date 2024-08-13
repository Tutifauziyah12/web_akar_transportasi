import React, { useState } from 'react';

const RupiahInput = ({ value, onChange, placeholder, error }) => {
    // Fungsi untuk mengonversi angka menjadi format Rupiah
    const formatToRupiah = (angka) => {
        if (!angka) return '';
        let numberString = angka.toString();
        let split = numberString.split(',');
        let sisa = split[0].length % 3;
        let rupiah = split[0].substr(0, sisa);
        let ribuan = split[0].substr(sisa).match(/\d{1,3}/g);

        if (ribuan) {
            let separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] !== undefined ? rupiah + ',' + split[1] : rupiah;
        return 'Rp ' + rupiah;
    };

    // Fungsi untuk mengonversi format Rupiah kembali ke angka
    const parseToNumber = (rupiah) => {
        return parseInt(rupiah.replace(/,.*|[^0-9]/g, ''), 10);
    };

    const [displayValue, setDisplayValue] = useState(formatToRupiah(value));

    // Fungsi untuk menangani perubahan nilai input
    const handleChange = (e) => {
        const inputVal = e.target.value;
        setDisplayValue(formatToRupiah(parseToNumber(inputVal)));
        onChange(parseToNumber(inputVal));
    };

    return (
        <div>
            <input
                type="text"
                value={displayValue}
                onChange={handleChange}
                placeholder={placeholder}
                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${error && "border-red-500"}`}
            />
            {error && <p className="text-red-700 text-xs mt-1 ml-1">{error}</p>}
        </div>
    );
};

export default RupiahInput;
