import React, { useState, useEffect, forwardRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, usePage } from "@inertiajs/react";
import { IoPencil, IoTrash, IoAddOutline, IoPrintSharp } from "react-icons/io5";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { id } from "date-fns/locale";
import { format } from "date-fns";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";

registerLocale("id", id);
setDefaultLocale("id");

import MyModal from "./MyModal";
import MyModalEdit from "./MyModalEdit";
import MyModalDelete from "./MyModalDelete";
import MyModalCetak from "./MyModalCetak";
import Create from "./Create";
import Edit from "./Edit";
import Cetak from "./Cetak";

export default function Index({
    auth,
    sewa,
    searchTerm: initialSearchTerm,
    startDate: initialStartDate,
    endDate: initialEndDate,
    kendaraans,
    lastKode,
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
    const [state, setState] = useState([
        {
            startDate: initialStartDate ? new Date(initialStartDate) : null,
            endDate: initialEndDate ? new Date(initialEndDate) : null,
            key: "selection",
        },
    ]);

    const handleSearch = (e) => {
        e.preventDefault();
        const startDate = state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;
        const endDate = state[0].endDate
            ? format(state[0].endDate, "yyyy-MM-dd")
            : state[0].startDate
            ? format(state[0].startDate, "yyyy-MM-dd")
            : null;

        const query = { search: searchTerm };
        if (startDate) {
            query.startDate = startDate;
            query.endDate = endDate;
        }

        Inertia.get(route("sewa.index"), query, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const handleReset = () => {
        setSearchTerm("");
        setState([
            {
                startDate: null,
                endDate: null,
                key: "selection",
            },
        ]);
    };

    const onChange = (dates) => {
        const [start, end] = dates;
        setState([{ startDate: start, endDate: end, key: "selection" }]);
    };

    const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => {
        const renderedValues = () => {
            const [start, end] = value.split(" - ");
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

    const { flash } = usePage().props;
    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalCetak, setShowModalCetak] = useState(false);
    const [editId, setEditId] = useState(null);

    useEffect(() => {
        if (flash && flash.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    const handleShow = () => {
        setShowModal(true);
    };

    const handleClose = () => {
        setShowModal(false);
    };

    const handleShowEdit = (kode) => {
        setEditId(kode);
        setShowModalEdit(true);
    };

    const handleCloseEdit = () => {
        setShowModalEdit(false);
    };

    const handleShowDelete = (kode) => {
        setEditId(kode);
        setShowModalDelete(true);
    };

    const handleCloseDelete = () => {
        setShowModalDelete(false);
    };

    const handleShowCetak = (kode) => {
        setEditId(kode);
        setShowModalCetak(true);
    };

    const handleCloseCetak = () => {
        setShowModalCetak(false);
    };

    const handleDelete = (kode) => {
        Inertia.delete(route("sewa.destroy", kode));
        handleCloseDelete();
        toast.success("Pendapatan Sewa berhasil dihapus!");
    };

    const handleCetak = (kode) => {
        Inertia.get(route("sewa.show", kode));
    };

    const totalPendapatan = 0;

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-2xl 2xl:text-4xl text-gray-800 leading-tight w-full">
                    Daftar Sewa Kendaraan
                </h2>
            }
        >
            <Head title="Sewa Kendaraan" />

            <div className="py-4 2xl:py-8 text-xs 2xl:text-base">
                <div className="flex justify-between mb-2 2xl:mb-4">
                    <div className="w-fit p-3 2xl:p-4 mb-4 bg-white rounded-md 2xl:rounded-xl shadow-md 2xl:shadow-lg">
                        <form onSubmit={handleSearch} className="">
                            <div className="flex items-end space-x-4">
                                <div className="w-fit">
                                    <label
                                        htmlFor="cari"
                                        className="block mb-2 font-semibold text-gray-700"
                                    >
                                        Filter
                                    </label>
                                    <input
                                        type="text"
                                        id="cari"
                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-base rounded-md 2xl:rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2"
                                        placeholder="Cari kode atau nama"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="w-fit">
                                    <label
                                        htmlFor="tanggal"
                                        className="block mb-2 font-semibold text-gray-700"
                                    >
                                        Tanggal
                                    </label>

                                    <div>
                                        <DatePicker
                                            selected={state[0].startDate}
                                            onChange={onChange}
                                            startDate={state[0].startDate}
                                            endDate={state[0].endDate}
                                            selectsRange
                                            customInput={<ExampleCustomInput />}
                                            dateFormat="d MMMM yyyy"
                                            locale="id"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        type="button"
                                        onClick={handleReset}
                                        className="bg-red-400 hover:bg-red-500 text-white font-medium py-2 px-3 2xl:px-4 rounded-md"
                                    >
                                        Reset
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-green-400 hover:bg-green-500 text-white font-medium py-2 px-3 2xl:px-4 rounded-md"
                                    >
                                        Submit
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="flex items-end">
                        <a
                            // href={route("sewa.create")}
                            onClick={() => handleShow()}
                            className="flex items-center text-xl px-2 py-1 text-blue-500 hover:text-blue-700"
                        >
                            <IoAddOutline />
                        </a>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                        <table className="w-full text-left rtl:text-right text-gray-500">
                            <thead className="text-gray-700 uppercase bg-gray-200">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-8 py-3 w-[1%]"
                                    >
                                        No
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Kode
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Tanggal
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Tanggal Ambil Kendaraan
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Tanggal Pengembalian Kendaraan
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Nama Penyewa
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Nama Kendaraan
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Total Biaya
                                    </th>
                                    <th scope="col" className="px-3 py-2">
                                        Pembayaran
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-2 w-[1%]"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="leading-relaxed">
                                {sewa.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="10"
                                            className="px-6 py-4 text-center bg-white border-b hover:bg-gray-50"
                                        >
                                            Sewa Kendaraan tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    sewa.data.map((swa, index) => (
                                        <tr
                                            key={swa.id_sewa}
                                            className="bg-white border-b hover:bg-gray-50 align-top"
                                        >
                                            <td className="px-8 py-2">
                                                {sewa.from + index}
                                            </td>
                                            <td className="px-3 py-2">
                                                {swa.id_sewa}
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        swa.created_at
                                                    }
                                                    endDateString={
                                                        swa.created_at
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        swa.mulai_tanggal
                                                    }
                                                    endDateString={
                                                        swa.akhir_tanggal
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                {swa.pengembalian_tanggal ? (
                                                    <FormatDateRange
                                                        startDateString={
                                                            swa.pengembalian_tanggal
                                                        }
                                                        endDateString={
                                                            swa.pengembalian_tanggal
                                                        }
                                                    />
                                                ) : (
                                                    "-"
                                                )}
                                            </td>
                                            <td className="px-3 py-2">
                                                {swa.nama}
                                            </td>
                                            <td className="px-3 py-2">
                                                <ul>
                                                    {swa.sewa_kendaraan.map(
                                                        (sk, idx) => (
                                                            <li
                                                                key={`${swa.id_sewa}-${idx}`}
                                                            >
                                                                {"- "}
                                                                {
                                                                    sk.kendaraan
                                                                        .nama
                                                                }{" "}
                                                                (
                                                                {
                                                                    sk.kendaraan
                                                                        .no_registrasi
                                                                }
                                                                )
                                                            </li>
                                                        )
                                                    )}
                                                </ul>
                                            </td>
                                            <td className="px-3 py-2">
                                                {new Intl.NumberFormat(
                                                    "id-ID",
                                                    {
                                                        style: "currency",
                                                        currency: "IDR",
                                                        minimumFractionDigits: 0,
                                                    }
                                                ).format(
                                                    swa.total +
                                                        swa.pendapatan_lainnya.reduce(
                                                            (acc, item) =>
                                                                acc +
                                                                item.total,
                                                            0
                                                        )
                                                )}
                                            </td>
                                            <td className="px-3 py-2">
                                                {swa.total +
                                                    swa.pendapatan_lainnya.reduce(
                                                        (acc, pendapatan) =>
                                                            acc +
                                                            pendapatan.total,
                                                        0
                                                    ) ===
                                                swa.pembayaran ? (
                                                    <>
                                                        <span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                                            Lunas
                                                        </span>
                                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                                            {swa.metode}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="bg-yellow-100 text-yellow-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                                            Termin
                                                        </span>
                                                        <span className="bg-indigo-100 text-indigo-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded">
                                                            {swa.metode}
                                                        </span>
                                                        <br />
                                                        <RupiahFormat
                                                            value={
                                                                swa.pembayaran
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </td>
                                            <td className="px-1 pr-5 py-2 flex justify-center space-x-2">
                                                <a
                                                    onClick={() =>
                                                        handleShowEdit(
                                                            swa.id_sewa
                                                        )
                                                    }
                                                    className="px-2 text-center hover:text-yellow-600"
                                                >
                                                    <IoPencil />
                                                </a>
                                                <a
                                                    className="px-2 text-center hover:text-green-600"
                                                    onClick={() =>
                                                        handleShowCetak(
                                                            swa.id_sewa
                                                        )
                                                    }
                                                >
                                                    <IoPrintSharp className="text-sm 2xl:text-md mr-1" />
                                                </a>
                                                <button
                                                    // onClick={() =>
                                                    //     handleDelete(swa.id)
                                                    // }
                                                    onClick={() =>
                                                        handleShowDelete(
                                                            swa.id_sewa
                                                        )
                                                    }
                                                    className="px-2 text-center hover:text-red-600"
                                                >
                                                    <IoTrash />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-6 flex justify-between">
                    <div>
                        <p className="text-gray-700">
                            Menampilkan {sewa.from}-{sewa.to} dari {sewa.total}{" "}
                            total data sewa kendaraan
                        </p>
                    </div>
                    <div>
                        {sewa.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`mx-1 px-3 py-2 hover:bg-slate-200 border rounded ${
                                    link.active
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500"
                                }`}
                            >
                                {" "}
                                {link.label === "&laquo; Previous"
                                    ? "Sebelumnya"
                                    : link.label === "Next &raquo;"
                                    ? "Selanjutnya"
                                    : link.label}
                            </Link>
                        ))}
                    </div>
                </div>

                <MyModal show={showModal} handleClose={handleClose}>
                    <Create
                        handleClose={handleClose}
                        kendaraans={kendaraans}
                        lastKode={lastKode}
                    />
                </MyModal>

                <MyModalEdit
                    show={showModalEdit}
                    handleCloseEdit={handleCloseEdit}
                >
                    <Edit
                        handleCloseEdit={handleCloseEdit}
                        kendaraans={kendaraans}
                        lastKode={lastKode}
                        kode={editId}
                    />
                </MyModalEdit>

                <MyModalDelete
                    show={showModalDelete}
                    handleCloseDelete={handleCloseDelete}
                    handleDelete={handleDelete}
                    kode={editId}
                />

                <MyModalCetak
                    show={showModalCetak}
                    handleCloseCetak={handleCloseCetak}
                    kode={editId}
                    kendaraans={kendaraans}
                >
                    <Cetak
                        handleCloseEdit={handleCloseEdit}
                        kendaraans={kendaraans}
                        lastKode={lastKode}
                        kode={editId}
                    />
                </MyModalCetak>
            </div>
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </AuthenticatedLayout>
    );
}
