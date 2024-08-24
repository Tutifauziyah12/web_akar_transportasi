import React, { useState, useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, Link, usePage } from "@inertiajs/react";
import { IoAddOutline, IoPencil, IoTrash } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import MyModal from "./MyModal";
import MyModalEdit from "./MyModalEdit";
import MyModalDelete from "./MyModalDelete";
import Create from "./Create";
import Edit from "./Edit";

export default function Index({
    auth,
    kendaraans,
    searchTerm: initialSearchTerm,
}) {
    const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");

    const handleSearch = (e) => {
        e.preventDefault();
        Inertia.get(
            route("kendaraan.index"),
            { search: searchTerm },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    };

    const handleReset = () => {
        setSearchTerm("");
    };

    const { flash } = usePage().props;

    useEffect(() => {
        if (flash.message) {
            toast.success(flash.message);
        }
    }, [flash]);

    const [showModal, setShowModal] = useState(false);
    const [showModalEdit, setShowModalEdit] = useState(false);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [editId, setEditId] = useState(null);

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

    const handleDelete = (id) => {
        Inertia.delete(route("kendaraan.destroy", id));
        handleCloseDelete()
        toast.success("Kendaraan berhasil dihapus!")
    };
 
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-2xl 2xl:text-4xl text-gray-800 leading-tight w-full">
                    Daftar Kendaraan
                </h2>
            }
        >
            <Head title="Kendaraan" />

            <div className="py-4 2xl:py-8 text-xs 2xl:text-base">
                <div className="flex justify-between mb-2 2xl:mb-4">
                    <div className="w-fit p-3 2xl:p-4 mb-4 bg-white rounded-md 2xl:rounded-xl shadow-md 2xl:shadow-lg">
                        <form onSubmit={handleSearch}>
                            <div className="flex items-end space-x-2">
                                <div className="w-48">
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
                                        placeholder="Cari"
                                        value={searchTerm}
                                        onChange={(e) =>
                                            setSearchTerm(e.target.value)
                                        }
                                    />
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
                            <thead className=" text-gray-700 uppercase bg-gray-200">
                                <tr>
                                    <th
                                        scope="col"
                                        className="px-8 py-3 w-[1%]"
                                    >
                                        No
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nama
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Nomor Registrasi
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Tahun Pembuatan
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Jenis
                                    </th>
                                    <th scope="col" className="px-6 py-3">
                                        Warna
                                    </th>
                                    <th
                                        scope="col"
                                        className="px-6 py-3 w-[10%]"
                                    >
                                        Status
                                    </th>
                                    <th
                                        scope="col"
                                        className="py-3 px-8 text-center w-[1%]"
                                    >
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {kendaraans.data.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="8"
                                            className="px-6 py-4 text-center bg-white border-b hover:bg-gray-50"
                                        >
                                            Kendaraan tidak ditemukan
                                        </td>
                                    </tr>
                                ) : (
                                    kendaraans.data.map((kendaraan, index) => (
                                        <tr
                                            key={kendaraan.id_kendaraans}
                                            className="bg-white border-b hover:bg-gray-50"
                                        >
                                            <td className="px-8 py-4">
                                                {kendaraans.from + index}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.nama}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.no_registrasi}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.tahun_pembuatan}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.jenis}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.warna}
                                            </td>
                                            <td className="px-6 py-4">
                                                {kendaraan.status}
                                            </td>
                                            <td className="px-8 py-4 flex justify-center space-x-2">
                                                <a
                                                    onClick={() =>
                                                        handleShowEdit(
                                                            kendaraan.id_kendaraans
                                                        )
                                                    }
                                                    className="px-2 py-1 text-center hover:text-yellow-600"
                                                >
                                                    <IoPencil />
                                                </a>
                                                {/* <button
                                                    onClick={() =>
                                                        handleShowDelete(
                                                            kendaraan.id_kendaraans
                                                        )
                                                    }
                                                    className="px-2 py-1 text-center hover:text-red-600"
                                                >
                                                    <IoTrash />
                                                </button> */}
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
                            Menampilkan {kendaraans.from}-{kendaraans.to} dari{" "}
                            {kendaraans.total} total data kendaraan
                        </p>
                    </div>
                    <div className="font-bold">
                        {kendaraans.links.map((link, index) => (
                            <Link
                                key={index}
                                href={link.url}
                                className={`mx-1 px-3 py-2 hover:bg-slate-200 border rounded ${
                                    link.active
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500"
                                }`}
                            >
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
                    <Create handleClose={handleClose} />
                </MyModal>

                <MyModalEdit
                    show={showModalEdit}
                    handleCloseEdit={handleCloseEdit}
                >
                    <Edit handleCloseEdit={handleCloseEdit} id={editId} />
                </MyModalEdit>

                <MyModalDelete
                    show={showModalDelete}
                    handleCloseDelete={handleCloseDelete}
                    handleDelete={handleDelete}
                    id={editId}
                />
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
