import React, { useState, useEffect, forwardRef } from "react";
import { Head, useForm, usePage } from "@inertiajs/react";
import FormatDateRange from "@/Utils/FormatDateRange";
import RupiahFormat from "@/Utils/RupiahFormat";
import logo from "../../asset/favicon.ico";

import axios from "axios";

const Cetak = React.forwardRef(({ kendaraans, handleCloseEdit, kode }, ref) => {
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
                        history_pembayaran_ids: sewaData.history_pembayaran,
                        tipe_pembayaran: sewaData.tipe_pembayaran,
                        pembayaran: sewaData.pembayaran,
                        pendapatanLainnya: sewaData.pendapatan_lainnya,
                        created_at: sewaData.created_at,
                    });
                })
                .catch((error) => {
                    console.error("Error fetching sewa:", error);
                });
        }
    }, [kode]);

    const { data, setData, put, processing, reset } = useForm({
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

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    };

    return (
        <>
            <Head title="Tambah Sewa Kendaraan" />
            <div
                className="py-1 2xl:py-6 px-6 2xl:px-10 print:my-10 print:mx-20 print:text-[9px]"
                ref={ref}
                style={{
                    position: "relative",
                }}
            >
                <div
                    style={{
                        content: '""',
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        width: "50%",
                        height: "50%",
                        backgroundImage: `url(${logo})`,
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        opacity: 0.2,
                        zIndex: 1,
                        transform: "translate(-50%, -50%)", // This centers the image
                    }}
                />

                <div className="text-gray-700">
                    <div className="flex justify-center">
                        <label
                            htmlFor="Pembayaran"
                            className="mb-3 text-base 2xl:lg font-semibold"
                        >
                            Detail Sewa
                        </label>
                    </div>
                    <table className="w-full">
                        <tbody>
                            <tr>
                                <td className="font-semibold py-1">Kode</td>
                                <td className="w-10"></td>
                                <td>{data.kode}</td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1">Tanggal</td>
                                <td className="w-10"></td>
                                <td>
                                    <FormatDateRange
                                        startDateString={data.created_at}
                                        endDateString={data.created_at}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1">
                                    Nama Penyewa
                                </td>
                                <td className="w-10"></td>
                                <td>{data.nama}</td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1">
                                    Tanggal Ambil Kendaraan
                                </td>
                                <td className="w-10"></td>
                                <td>
                                    <FormatDateRange
                                        startDateString={data.mulai_tanggal}
                                        endDateString={data.akhir_tanggal}
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1">
                                    Tanggal Pengembalian Kendaraan
                                </td>
                                <td className="w-10"></td>
                                <td>
                                    <FormatDateRange
                                        startDateString={
                                            data.pengembalian_tanggal
                                        }
                                        endDateString={
                                            data.pengembalian_tanggal
                                        }
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1">
                                    Kendaraan Sewa
                                </td>
                                <td className="w-10"></td>
                                <td>
                                    {data.kendaraan_ids.length > 0 && (
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
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1">
                                    Biaya Sewa
                                </td>
                                <td className="w-10"></td>
                                <td>
                                    <RupiahFormat value={data.total} />
                                </td>
                            </tr>

                            <tr>
                                <td colSpan={3}>
                                    {data.pendapatanLainnya.length == 0 ? (
                                        <></>
                                    ) : (
                                        <>
                                            <div className="border-2 border-dashed border-slate-300">
                                                <div className="grid gap-3 px-2 py-0.5 grid-cols-3 relative">
                                                    <div className="block mb-1 text-gray-900 font-semibold">
                                                        Sewa Lainnya
                                                    </div>
                                                    <div className="block mb-1 text-gray-900 font-semibold">
                                                        Jumlah
                                                    </div>
                                                    <div className="block mb-1 text-gray-700 font-semibold">
                                                        Biaya Lainnya
                                                    </div>
                                                </div>

                                                {data.pendapatanLainnya.map(
                                                    (pendapatan, index) => (
                                                        <div
                                                            key={index}
                                                            className="grid gap-3 px-2 py-0.5 grid-cols-3 relative"
                                                        >
                                                            <div className="w-full mr-3">
                                                                <span>
                                                                    {
                                                                        pendapatan.nama
                                                                    }
                                                                </span>
                                                            </div>
                                                            <div className="relative flex flex-col items-center max-w-[5rem]">
                                                                <div className="w-full mr-3 ml-3">
                                                                    <span>
                                                                        {
                                                                            pendapatan.jumlah
                                                                        }
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <div className="w-full mr-3">
                                                                <span>
                                                                    <RupiahFormat
                                                                        value={
                                                                            pendapatan.total
                                                                        }
                                                                    />
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </>
                                    )}
                                </td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1 pt-3">
                                    Total Pembayaran Sewa
                                </td>
                                <td className="w-10"></td>
                                <td className="pt-3">
                                    <RupiahFormat
                                        value={
                                            data.total +
                                            data.pendapatanLainnya.reduce(
                                                (acc, item) => acc + item.total,
                                                0
                                            )
                                        }
                                    />
                                </td>
                            </tr>

                            <tr>
                                <td className="font-semibold py-1 text-left align-top">
                                    Pembayaran
                                </td>
                                <td className="w-10"></td>
                                <td>
                                    {data.history_pembayaran_ids.reduce(
                                        (accumulator, current) =>
                                            accumulator + current.total,
                                        0
                                    ) +
                                        data.pendapatanLainnya.reduce(
                                            (accumulator, current) =>
                                                accumulator + current.total,
                                            0
                                        ) ===
                                    data.total ? (
                                        <>
                                            {data.history_pembayaran_ids.map(
                                                (sk, idx) => (
                                                    <div
                                                        key={`${data.id_sewa}-${idx}`}
                                                        className="mb-1 text-nowrap grid grid-cols-3"
                                                    >
                                                        <RupiahFormat
                                                            value={sk.total}
                                                        />{" "}
                                                        <span className="w-fit flex items-center bg-indigo-100 text-indigo-800 font-medium mx-2 px-2.5 py-0.5 rounded">
                                                        {sk.metode}
                                                        </span>
                                                        {formatDate(
                                                            sk.created_at
                                                        )}
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
                                                        className="mb-1 text-nowrap grid grid-cols-3"
                                                    >
                                                        <RupiahFormat
                                                            value={sk.total}
                                                        />{" "}
                                                        <span className="w-fit flex items-center bg-indigo-100 text-indigo-800 font-medium mx-2 px-2.5 py-0.5 rounded">
                                                            {sk.metode}
                                                        </span>
                                                        {formatDate(
                                                            sk.created_at
                                                        )}
                                                    </div>
                                                )
                                            )}
                                            Sisa :{" "}
                                            <RupiahFormat
                                                value={
                                                    data.total +
                                                    data.pendapatanLainnya.reduce(
                                                        (
                                                            accumulator,
                                                            current
                                                        ) =>
                                                            accumulator +
                                                            current.total,
                                                        0
                                                    ) -
                                                    data.history_pembayaran_ids.reduce(
                                                        (
                                                            accumulator,
                                                            current
                                                        ) =>
                                                            accumulator +
                                                            current.total,
                                                        0
                                                    )
                                                }
                                            />
                                        </>
                                    )}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
});

export default Cetak;
