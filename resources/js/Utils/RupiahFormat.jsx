import React from 'react';

const RupiahFormat = ({ value = 0 }) => {
    const formatToRupiah = (angka) => {
        if (!angka) return 'Rp 0';
        
        // Handle negative values
        const isNegative = angka < 0;
        angka = Math.abs(angka); // Convert to positive for formatting

        angka = typeof angka === 'number' ? angka.toString() : angka;
        let rupiah = '';
        let angkarev = angka.split('').reverse().join('');
        for (let i = 0; i < angkarev.length; i++) {
            if (i % 3 === 0) rupiah += angkarev.substr(i, 3) + '.';
        }

        // Reformat to Rp format
        const formatted = 'Rp ' + rupiah.split('', rupiah.length - 1).reverse().join('');

        // Prepend '-' for negative values
        return isNegative ? '- ' + formatted : formatted;
    };

    return (
        <span>{formatToRupiah(value)}</span>
    );
};

export default RupiahFormat;
