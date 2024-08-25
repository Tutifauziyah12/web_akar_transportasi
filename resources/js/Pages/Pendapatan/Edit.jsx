import React, { useState, useEffect, forwardRef } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { Head, useForm, usePage } from "@inertiajs/react";
import RupiahInput from "@/Utils/RupiahInput";
import RupiahFormat from "@/Utils/RupiahFormat";
import { id } from "date-fns/locale";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";

registerLocale("id", id);
setDefaultLocale("id");

import axios from "axios";

import { validationSchema } from "@/Utils/validationSchema";

export default function Edit({ kendaraans, handleCloseEdit, kode }) {
    const [sewa, setSewa] = useState(null);

    useEffect(() => {
        if (kode) {
            axios
                .get(`/pendapatan/sewa_kendaraan/${kode}`)
                .then((response) => {
                    const sewaData = response.data;
                    setSewa(sewaData); // Menyimpan data sewa ke state

                    // Set data form menggunakan respons dari API
                    setData({
                        kode: sewaData.id_sewa,
                        nama: sewaData.nama,
                        mulai_tanggal: sewaData.mulai_tanggal,
                        akhir_tanggal: sewaData.akhir_tanggal,
                        pengembalian_tanggal: sewaData.pengembalian_tanggal,
                        kendaraan_ids: sewaData.sewa_kendaraan.map(
                            (k) => k.kendaraan_id
                        ),
                        total: sewaData.total,
                        metode: sewaData.metode,
                        pembayaran: sewaData.pembayaran || 0,
                        history_pembayaran_ids: sewaData.history_pembayaran,
                        pendapatanLainnya: sewaData.pendapatan_lainnya,
                        created_at: sewaData.created_at,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching sewa:", error);
                });
        }
    }, [kode]);

    const { data, setData, put, errors, processing, reset } = useForm({
        kode: "",
        nama: "",
        mulai_tanggal: "",
        akhir_tanggal: "",
        pengembalian_tanggal: "",
        kendaraan_ids: [],
        history_pembayaran_ids: [],
        total: 0,
        metode: "",
        tipe_pembayaran: "",
        pembayaran: 0,
        pendapatanLainnya: [],
        created_at: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const { flash } = usePage().props;

    useEffect(() => {
        const updatedPendapatanLainnya = data.pendapatanLainnya.map(
            (pendapatan) => ({
                ...pendapatan,
                metode: data.metode,
            })
        );
        setData((prevData) => ({
            ...prevData,
            pendapatanLainnya: updatedPendapatanLainnya,
        }));
    }, [data.metode]);

    const handlePendapatanLainnyaChange = (index, e) => {
        const { name, value } = e.target;

        if (name.startsWith("nama")) {
            const metodeIndex = name.split("-")[1];
            const updatedPendapatanLainnya = [...data.pendapatanLainnya];
            updatedPendapatanLainnya[index].nama = value;
            setData({ ...data, pendapatanLainnya: updatedPendapatanLainnya });
        } else {
            const updatedPendapatanLainnya = [...data.pendapatanLainnya];
            updatedPendapatanLainnya[index][name] = value;
            setData({ ...data, pendapatanLainnya: updatedPendapatanLainnya });
        }
    };

    const addPendapatanLainnya = () => {
        if (data.pendapatanLainnya.length === 0) {
            setData("pendapatanLainnya", [
                ...data.pendapatanLainnya,
                { nama: "", jumlah: 0, total: 0 },
            ]);
        } else {
            const isAnyFieldEmpty = data.pendapatanLainnya.some(
                (pendapatan) => {
                    return (
                        !pendapatan.nama ||
                        pendapatan.jumlah <= 0 ||
                        pendapatan.total <= 0
                    );
                }
            );

            if (isAnyFieldEmpty) {
                toast.error(
                    "Silakan lengkapi semua kolom sebelum menambahkan entri baru."
                );
                return;
            }

            setData("pendapatanLainnya", [
                ...data.pendapatanLainnya,
                { nama: "", jumlah: 0, total: 0 },
            ]);
        }
    };

    const deletePendapatanLainnya = (index) => {
        setData(
            "pendapatanLainnya",
            data.pendapatanLainnya.filter((_, i) => i !== index)
        );
    };

    const deleteHistoriPendapatan = (index) => {
        setData(
            "history_pembayaran_ids",
            data.history_pembayaran_ids.filter((_, i) => i !== index)
        );
    };

    const formatRupiah = (nilai) => {
        return new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0,
        }).format(nilai);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mulai_tanggal" || name === "akhir_tanggal") {
            value = value.value;
        }
        setData(name, value);
    };

    const handleCheckboxChange = (e) => {
        const { value, checked } = e.target;
        const id = parseInt(value);
        if (checked) {
            setData("kendaraan_ids", [...data.kendaraan_ids, id]);
        } else {
            setData(
                "kendaraan_ids",
                data.kendaraan_ids.filter((kendaraanId) => kendaraanId !== id)
            );
        }
    };

    useEffect(() => {
        if (flash.message) {
            if (flash.success) {
                toast.success(flash.message);
            } else if (flash.error) {
                toast.error(flash.message);
            }
        }
    }, [flash]);

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const filteredKendaraans = kendaraans.filter((kendaraan) =>
        kendaraan.nama.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [startDatePengembalian, setStartDatePengembalian] = useState(null);
    const [date, setDate] = useState(null);

    useEffect(() => {
        if (sewa) {
            const parseDate = (dateString) => {
                const date = new Date(dateString);
                return isNaN(date.getTime()) ? null : date;
            };

            setStartDate(parseDate(sewa.mulai_tanggal));
            setEndDate(parseDate(sewa.akhir_tanggal));
            if (
                sewa.pengembalian_tanggal ||
                !sewa.pengembalian_tanggal === ""
            ) {
                setStartDatePengembalian(parseDate(sewa.pengembalian_tanggal));
            }
            setDate(parseDate(sewa.created_at));
        }
    }, [sewa]);

    const onChange = (dates) => {
        const [start, end] = dates;
        if (start && end && start.getTime() === end.getTime()) {
            setStartDate(start);
            setEndDate(null);
        } else {
            setStartDate(start);
            setEndDate(end);
        }
    };

    const onChangePengembalian = (date) => {
        if (date instanceof Date && !isNaN(date.getTime())) {
            setStartDatePengembalian(date);
            const formattedDate = date.toISOString().split("T")[0];
            setData("pengembalian_tanggal", formattedDate);
        } else {
            console.error("Invalid date value:", date);
        }
    };

    const formatDateToYYYYMMDD = (date) => {
        if (!date || isNaN(date.getTime())) return "";
        return date.toISOString().split("T")[0];
    };

    data.mulai_tanggal = formatDateToYYYYMMDD(startDate);
    data.akhir_tanggal = endDate
        ? formatDateToYYYYMMDD(endDate)
        : formatDateToYYYYMMDD(startDate);
    data.pengembalian_tanggal = formatDateToYYYYMMDD(startDatePengembalian);

    const [pembayaranTotal, setPembayaranTotal] = useState(0);

    useEffect(() => {
        const totalPendapatanLainnya = data.pendapatanLainnya.reduce(
            (total, item) => total + item.total,
            0
        );
        setPembayaranTotal(data.total + totalPendapatanLainnya);
    }, [data.total, data.pendapatanLainnya]);

    useEffect(() => {
        if (pembayaranTotal - data.pembayaran === 0) {
            setData((prevData) => ({
                ...prevData,
                tipe_pembayaran: "Lunas",
            }));
        } else {
            setData((prevData) => ({
                ...prevData,
                tipe_pembayaran: "Termin",
            }));
        }
    }, [pembayaranTotal, data.pembayaran]);

    useEffect(() => {
        if (data.tipe_pembayaran === "Lunas") {
            setData((prevData) => ({
                ...prevData,
                pembayaran: pembayaranTotal,
            }));
        }
    }, [data.tipe_pembayaran, pembayaranTotal]);

    const handlePembayaranChange = (event) => {
        const { value } = event.target;
        setData((prevData) => ({
            ...prevData,
            tipe_pembayaran: value,
        }));
    };

    const parseRupiah = (value) => {
        return parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
    };

    const sisaPembayaran =
        data.total +
        data.pendapatanLainnya.reduce(
            (accumulator, current) => accumulator + current.total,
            0
        ) -
        data.history_pembayaran_ids.reduce(
            (accumulator, current) => accumulator + current.total,
            0
        ) -
        data.pembayaran;

    const handleRupiahInputChange = (event) => {
        const { value } = event.target;
        if (pembayaranTotal > value) {
            dataBayar;
        }
        setData((prevData) => ({
            ...prevData,
            pembayaran: parseRupiah(value),
        }));
    };

    const handleRupiahInputChangeTotal = (event) => {
        const { value } = event.target;
        setData((prevData) => ({
            ...prevData,
            total: parseRupiah(value),
        }));
    };

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
        const renderedValues = () => {
            if (!value) return "";
            const [start, end] = value.split(" - ");
            // const formattedStart = formattedValue(start);
            // const formattedEnd = formattedValue(end);
            if (!end || start === end) {
                return start;
            }
            return `${start} - ${end}`;
        };

        return (
            <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-64 2xl:w-72 p-2 2xl:p-2.5"
                onClick={onClick}
                ref={ref}
                placeholder="Pilih tanggal..."
                value={renderedValues()}
                readOnly
            />
        );
    });

    const ExampleCustomInput1 = forwardRef(({ value, onClick }, ref) => {
        // const formattedValue = value
        //     ? new Date(value).toLocaleDateString("id-ID")
        //     : "";
        return (
            <input
                type="text"
                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-64 2xl:w-72 p-2 2xl:p-2.5"
                onClick={onClick}
                ref={ref}
                placeholder="Pilih tanggal..."
                value={value}
                readOnly
            />
        );
    });

    const [isDisabled, setIsDisabled] = useState(false);
    useEffect(() => {
        if (pembayaranTotal > data.pembayaran) {
            setIsDisabled(true);
        } else {
            setIsDisabled(false);
        }
    }, [pembayaranTotal, data.pembayaran]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchema.validate(data, { abortEarly: false });
            put(`/pendapatan/sewa_kendaraan/${kode}`, {
                onSuccess: () => {
                    reset();
                    handleCloseEdit();
                },
            });
        } catch (err) {
            if (err.inner) {
                const newErrors = {};
                err.inner.forEach((error) => {
                    newErrors[error.path] = error.message;
                });
                setValidationErrors(newErrors);
            } else {
                toast.error("Terjadi kesalahan dalam validasi data.");
            }
        }
    };

    return (
        <>
            <Head title="Tambah Sewa Kendaraan" />
            <div className="py-4 2xl:py-6 px-6 2xl:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-5 mb-6 md:grid-cols-1">
                        <div>
                            <label
                                htmlFor="kode"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Kode
                            </label>
                            <input
                                type="text"
                                name="kode"
                                value={data.kode}
                                onChange={handleChange}
                                readOnly
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.kode && "border-red-500"
                                }`}
                                placeholder="Kode"
                            />
                            {validationErrors.kode && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.kode}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="tanggal"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Tanggal
                            </label>

                            <DatePicker
                                selected={date}
                                customInput={<ExampleCustomInput1 />}
                                dateFormat="d MMMM yyyy"
                                locale="id"
                                readOnly
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="nama"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Nama Penyewa
                            </label>
                            <input
                                type="text"
                                name="nama"
                                value={data.nama}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.nama && "border-red-500"
                                }`}
                                placeholder="Nama"
                            />

                            {validationErrors.nama && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.nama}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="tanggal"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Tanggal Ambil
                            </label>

                            <DatePicker
                                selected={startDate}
                                onChange={onChange}
                                startDate={startDate}
                                endDate={endDate}
                                selectsRange
                                customInput={<ExampleCustomInput />}
                                dateFormat="dd MMMM yyyy"
                                locale="id"
                                minDate={new Date()}
                            />

                            {(validationErrors.mulai_tanggal ||
                                validationErrors.akhir_tanggal) && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.mulai_tanggal ||
                                        validationErrors.akhir_tanggal}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="tanggal"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Tanggal Pengembalian
                            </label>

                            <DatePicker
                                selected={startDatePengembalian}
                                onChange={onChangePengembalian}
                                customInput={<ExampleCustomInput1 />}
                                dateFormat="d MMMM yyyy"
                                locale="id"
                                minDate={new Date()}
                            />
                        </div>

                        <div className="relative">
                            <label
                                htmlFor="pilih kendaraan"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Pilih Kendaran
                            </label>

                            <input
                                id="dropdownSearchButton"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5"
                                onClick={toggleDropdown}
                                type="text"
                                readOnly
                                value="Pilih Kendaraan"
                            />

                            <div
                                id="dropdownSearch"
                                className={`absolute mt-2 w-60 bg-white rounded-lg shadow-lg ${
                                    dropdownOpen ? "block" : "hidden"
                                }`}
                            >
                                <div className="p-2">
                                    <label
                                        htmlFor="searchInput"
                                        className="sr-only"
                                    >
                                        Search
                                    </label>
                                    <input
                                        id="searchInput"
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                        placeholder="Cari kendaraan..."
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5"
                                    />
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    <ul className="divide-y divide-gray-200">
                                        {filteredKendaraans.length > 0 ? (
                                            filteredKendaraans.map(
                                                (kendaraan) => (
                                                    <li
                                                        key={
                                                            kendaraan.id_kendaraans
                                                        }
                                                        className="px-4 py-2"
                                                    >
                                                        <div className="flex items-center">
                                                            <input
                                                                id={`checkbox-item-${kendaraan.id_kendaraans}`}
                                                                type="checkbox"
                                                                onChange={
                                                                    handleCheckboxChange
                                                                }
                                                                value={
                                                                    kendaraan.id_kendaraans
                                                                }
                                                                checked={data.kendaraan_ids.includes(
                                                                    kendaraan.id_kendaraans
                                                                )}
                                                                className="w-4 h-4 text-xs 2xl:text-sm text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                                                            />
                                                            <label
                                                                htmlFor={`checkbox-item-${kendaraan.id_kendaraans}`}
                                                                className="ml-2 text-xs 2xl:text-sm text-gray-900"
                                                            >
                                                                {kendaraan.nama}{" "}
                                                                (
                                                                {
                                                                    kendaraan.no_registrasi
                                                                }
                                                                )
                                                            </label>
                                                        </div>
                                                    </li>
                                                )
                                            )
                                        ) : (
                                            <li className="px-4 py-2 text-sm text-gray-500">
                                                Tidak ada hasil ditemukan
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="flex justify-end mt-2 mr-2">
                                    <button
                                        type="button"
                                        onClick={toggleDropdown}
                                        className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-xs px-2 py-1.5 text-center mb-2"
                                    >
                                        Selesai
                                    </button>
                                </div>
                            </div>

                            {data.kendaraan_ids.length > 0 && (
                                <div className="mt-4">
                                    <label className="block mb-2 font-semibold text-gray-900">
                                        Kendaraan Dipilih
                                    </label>
                                    <ul className="list-disc list-inside">
                                        {data.kendaraan_ids.map(
                                            (id_kendaraans) => {
                                                const kendaraan =
                                                    kendaraans.find(
                                                        (k) =>
                                                            k.id_kendaraans ===
                                                            parseInt(
                                                                id_kendaraans
                                                            )
                                                    );
                                                return (
                                                    <li key={id_kendaraans}>
                                                        {kendaraan &&
                                                            `${kendaraan.nama} (${kendaraan.no_registrasi})`}
                                                    </li>
                                                );
                                            }
                                        )}
                                    </ul>
                                </div>
                            )}

                            {validationErrors.kendaraan_ids && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.kendaraan_ids}
                                </div>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="total"
                                className="block mb-2 font-semibold text-gray-900 "
                            >
                                Biaya
                            </label>
                            <input
                                value={formatRupiah(data.total)}
                                onChange={handleRupiahInputChangeTotal}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5"
                            />
                            {validationErrors.total && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.total}
                                </p>
                            )}
                        </div>
                    </div>

                    {data.pendapatanLainnya.map((pendapatan, index) => (
                        <div key={index}>
                            <IoCloseSharp
                                className="text-xl 2xl:text-2xl my-2 text-red-400 hover:text-red-600"
                                onClick={() => deletePendapatanLainnya(index)}
                            />
                            <div className="grid gap-6 p-2 md:grid-cols-1 border-2 border-dashed border-slate-300 relative">
                                <div className="flex">
                                    <div className="w-full mr-3">
                                        <label
                                            htmlFor={`nama-${index}`}
                                            className="block mb-2 text-gray-900"
                                        >
                                            Nama Pendapatan Lainnya
                                        </label>
                                        <input
                                            type="text"
                                            name={`nama-${index}`}
                                            placeholder="Pendapatan Lainnya"
                                            value={pendapatan.nama}
                                            className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                                validationErrors[
                                                    `pendapatanLainnya[${index}].nama`
                                                ] && "border-red-500"
                                            }`}
                                            onChange={(e) =>
                                                handlePendapatanLainnyaChange(
                                                    index,
                                                    e
                                                )
                                            }
                                        />
                                        {validationErrors[
                                            `pendapatanLainnya[${index}].nama`
                                        ] && (
                                            <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                                {
                                                    validationErrors[
                                                        `pendapatanLainnya[${index}].nama`
                                                    ]
                                                }
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative flex flex-col items-center max-w-[5rem]">
                                        <div className="w-full mr-3">
                                            <label
                                                htmlFor={`jumlah-${index}`}
                                                className="block mb-2 text-gray-900"
                                            >
                                                Jumlah
                                            </label>
                                            <input
                                                type="number"
                                                name="jumlah"
                                                value={pendapatan.jumlah}
                                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                                    validationErrors[
                                                        `pendapatanLainnya[${index}].jumlah`
                                                    ] && "border-red-500"
                                                }`}
                                                onChange={(e) =>
                                                    handlePendapatanLainnyaChange(
                                                        index,
                                                        e
                                                    )
                                                }
                                            />
                                            {validationErrors[
                                                `pendapatanLainnya[${index}].jumlah`
                                            ] && (
                                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                                    {
                                                        validationErrors[
                                                            `pendapatanLainnya[${index}].jumlah`
                                                        ]
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="w-full mr-3">
                                    <label
                                        htmlFor={`total-${index}`}
                                        className="block mb-2 text-gray-700"
                                    >
                                        Total Pendapatan Lainnya
                                    </label>
                                    <RupiahInput
                                        value={pendapatan.total.toString()}
                                        onChange={(value) =>
                                            handlePendapatanLainnyaChange(
                                                index,
                                                {
                                                    target: {
                                                        name: "total",
                                                        value: value,
                                                    },
                                                }
                                            )
                                        }
                                        placeholder="Total Pendapatan Lainnya"
                                        error={
                                            validationErrors[
                                                `pendapatanLainnya.${index}.total`
                                            ]
                                        }
                                    />
                                    {validationErrors[
                                        `pendapatanLainnya[${index}].total`
                                    ] && (
                                        <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                            {
                                                validationErrors[
                                                    `pendapatanLainnya[${index}].total`
                                                ]
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    <div className="w-full flex justify-center items-center hover:font-semibold">
                        <button type="button" onClick={addPendapatanLainnya}>
                            - Tambah Pendapatan Lainnya -
                        </button>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-xl">
                        <div className="flex justify-center">
                            <label
                                htmlFor="Pembayaran"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Pembayaran
                            </label>
                        </div>

                        <label
                            htmlFor="Total Pembayaran"
                            className="block mb-2 font-medium text-gray-700"
                        >
                            Total Sewa
                        </label>

                        <input
                            type="text"
                            value={formatRupiah(pembayaranTotal)}
                            readOnly
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5"
                        />

                        {/* <label
                            htmlFor="Total Pembayaran"
                            className="block mt-4 mb-2 font-medium text-gray-700"
                        >
                            Total Pembayaran
                        </label> */}

                        {/* <label className="flex items-center mb-2">
                            <input
                                type="radio"
                                id="lunas"
                                name="tipePembayaran"
                                value="Lunas"
                                className="mr-2"
                                checked={data.tipe_pembayaran === "Lunas"}
                                onChange={handlePembayaranChange}
                            />
                            <span className="text-xs 2xl:text-sm">Lunas</span>
                            <input
                                type="radio"
                                id="termin"
                                name="tipePembayaran"
                                value="Termin"
                                className="mx-2"
                                checked={data.tipe_pembayaran === "Termin"}
                                onChange={handlePembayaranChange}
                            />
                            <span className="text-xs 2xl:text-sm">Termin</span>
                        </label>
                        {validationErrors.tipe_pembayaran && (
                            <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1 mb-2">
                                {validationErrors.tipe_pembayaran}
                            </p>
                        )}

                        <input
                            value={formatRupiah(data.pembayaran)}
                            onChange={handleRupiahInputChange}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5"
                        />
                        {pembayaranTotal < data.pembayaran ? (
                            <>
                                <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1 mb-2">
                                    Pembayaran Melebihi total pembayaran
                                </p>
                            </>
                        ) : (
                            <></>
                        )} */}

                        {/* <label
                            htmlFor="Total Pembayaran"
                            className="block mt-4 mb-2 font-medium text-gray-700"
                        >
                            Metode Pembayaran
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                id="cash"
                                name="metode"
                                value="Cash"
                                className="mr-2"
                                onChange={(e) =>
                                    setData("metode", e.target.value)
                                }
                                checked={data.metode === "Cash"}
                            />
                            <span className="text-xs 2xl:text-sm">Cash</span>
                            <input
                                type="radio"
                                id="debit"
                                name="metode"
                                value="Debit"
                                className="mx-2 text-xs"
                                onChange={(e) =>
                                    setData("metode", e.target.value)
                                }
                                checked={data.metode === "Debit"}
                            />
                            <span className="text-xs 2xl:text-sm">Debit</span>
                        </label>
                        {validationErrors.metode && (
                            <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1 mb-2">
                                {validationErrors.metode}
                            </p>
                        )} */}

                        {/* {data.tipe_pembayaran === "Termin" && (
                            <>
                                <label
                                    htmlFor="Total Pembayaran"
                                    className="block mt-4 mb-2 font-medium text-gray-700"
                                >
                                    Sisa Pembayaran
                                </label>
                                <input
                                    value={formatRupiah(sisaPembayaran)}
                                    onChange={handleRupiahInputChange}
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5"
                                    readOnly
                                />
                            </>
                        )} */}

                        <label
                            htmlFor="Total Pembayaran"
                            className="block mt-4 mb-2 font-medium text-gray-700"
                        >
                            Total Pembayaran
                        </label>

                        <table className="w-full">
                            <tbody>
                                <tr>
                                    <td className="py-1 text-left align-top italic">
                                        History
                                    </td>
                                    <td className="w-4"></td>
                                    <td>
                                        {sisaPembayaran === 0 ? (
                                            <>
                                                {data.history_pembayaran_ids.map(
                                                    (sk, idx) => (
                                                        <div
                                                            key={`${data.id_sewa}-${idx}`}
                                                            className="w-full mb-1 grid grid-cols-[100px,auto,auto,40px] 2xl:grid-cols-[130px,auto,auto,40px] items-center gap-2"
                                                        >
                                                            <RupiahFormat
                                                                value={sk.total}
                                                            />{" "}
                                                            <span className="w-fit bg-indigo-100 text-indigo-800 font-medium mx-2 px-2.5 py-0.5 rounded">
                                                                {sk.metode}
                                                            </span>
                                                            {formatDate(
                                                                sk.created_at
                                                            )}
                                                            <span
                                                                className="px-2 flex items-center justify-center hover:text-red-500 hover:font-semibold"
                                                                onClick={() =>
                                                                    deleteHistoriPendapatan(
                                                                        idx
                                                                    )
                                                                }
                                                            >
                                                                X
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                                Lunas
                                            </>
                                        ) : (
                                            <>
                                                {data.history_pembayaran_ids.map(
                                                    (sk, idx) => (
                                                        <div
                                                            key={`${data.id_sewa}-${idx}`}
                                                            className="w-full mb-1 grid grid-cols-[100px,auto,auto,40px] 2xl:grid-cols-[130px,auto,auto,40px] items-center gap-2"
                                                        >
                                                            <RupiahFormat
                                                                value={sk.total}
                                                                className=""
                                                            />
                                                            <span className="w-fit bg-indigo-100 text-indigo-800 font-medium mx-2 px-2.5 py-0.5 rounded">
                                                                {sk.metode}
                                                            </span>
                                                            <span className="">
                                                                {formatDate(
                                                                    sk.created_at
                                                                )}
                                                            </span>
                                                            <span
                                                                className="flex justify-center hover:text-red-500 hover:font-semibold cursor-pointer"
                                                                onClick={() =>
                                                                    deleteHistoriPendapatan(
                                                                        idx
                                                                    )
                                                                }
                                                            >
                                                                X
                                                            </span>
                                                        </div>
                                                    )
                                                )}
                                                Sisa :{" "}
                                                <RupiahFormat
                                                    value={sisaPembayaran}
                                                />
                                            </>
                                        )}
                                    </td>
                                </tr>

                                {sisaPembayaran !== 0 ? (
                                    <>
                                        {" "}
                                        <tr>
                                            <td className="py-1 pt-4 text-left align-top italic">
                                                Tambah
                                            </td>
                                            <td className="w-4"></td>
                                            <td>
                                                <input
                                                    value={formatRupiah(
                                                        data.pembayaran
                                                    )}
                                                    onChange={
                                                        handleRupiahInputChange
                                                    }
                                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 mt-2"
                                                />
                                                {sisaPembayaran < 0 ? (
                                                    <>
                                                        <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1 mb-2">
                                                            Pembayaran Melebihi
                                                            total pembayaran
                                                        </p>
                                                    </>
                                                ) : (
                                                    <></>
                                                )}
                                                <label className="flex items-center mt-2">
                                                    <input
                                                        type="radio"
                                                        id="cash"
                                                        name="metode"
                                                        value="Cash"
                                                        className="mr-2"
                                                        onChange={(e) =>
                                                            setData(
                                                                "metode",
                                                                e.target.value
                                                            )
                                                        }
                                                        checked={
                                                            data.metode ===
                                                            "Cash"
                                                        }
                                                    />
                                                    <span className="text-xs 2xl:text-sm">
                                                        Cash
                                                    </span>
                                                    <input
                                                        type="radio"
                                                        id="debit"
                                                        name="metode"
                                                        value="Debit"
                                                        className="mx-2 text-xs"
                                                        onChange={(e) =>
                                                            setData(
                                                                "metode",
                                                                e.target.value
                                                            )
                                                        }
                                                        checked={
                                                            data.metode ===
                                                            "Debit"
                                                        }
                                                    />
                                                    <span className="text-xs 2xl:text-sm">
                                                        Debit
                                                    </span>
                                                </label>
                                                {(validationErrors.metode ||
                                                    errors.metode) && (
                                                    <p className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1 mb-2">
                                                        {validationErrors.metode ||
                                                            errors.metode}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="py-1 pt-4 text-left align-top italic">
                                                Sisa
                                            </td>
                                            <td className="w-4"></td>
                                            <td>
                                                <input
                                                    value={formatRupiah(
                                                        sisaPembayaran
                                                    )}
                                                    onChange={
                                                        handleRupiahInputChange
                                                    }
                                                    className="mt-2 bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5"
                                                    readOnly
                                                />
                                            </td>
                                        </tr>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="flex justify-end space-x-2 border-t pt-4">
                        <button
                            disabled={processing || sisaPembayaran < 0}
                            className={`text-white  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md 2xl:rounded-lg text-xs 2xl:text-sm w-full sm:w-auto px-3 py-2 2xl:px-3.5 2xl:py-2.5 text-center ${
                                sisaPembayaran < 0
                                    ? "bg-slate-500 cursor-not-allowed"
                                    : "bg-blue-700 hover:bg-blue-800"
                            }`}
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
