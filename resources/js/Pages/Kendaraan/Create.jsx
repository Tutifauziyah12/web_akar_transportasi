import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { IoArrowBack } from "react-icons/io5";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import "react-toastify/dist/ReactToastify.css";

export default function Create({ handleClose }) {
    const { errors } = usePage().props;
    const { data, setData, post, processing, reset } = useForm({
        nama: "",
        no_registrasi: "",
        jenis: "",
        warna: "",
        tahun_pembuatan: "",
        status: "",
    });

    const storeKendaraan = (e) => {
        e.preventDefault();
        // router.post("/kendaraan", data);
        // handleClose();
        post('/kendaraan', {
            onSuccess: () => {
                reset();
                handleClose();
            },
        });
    };

    return (
        <>
            <Head title="Tambah Kendaraan" />
            <div className="py-4 2xl:py-6 px-6 2xl:px-10">
                <form onSubmit={storeKendaraan}>
                    <div className="grid gap-5 mb-6 md:grid-cols-1">
                        <div>
                            <label
                                htmlFor="nama"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Nama
                            </label>
                            <input
                                type="text"
                                onChange={(e) =>
                                    setData("nama", e.target.value)
                                }
                                value={data.nama}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    errors.nama && "border-red-500"
                                }`}
                                placeholder="Nama"
                            />
                            {errors.nama && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {errors.nama}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="no_registrasi"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                No. Registrasi
                            </label>
                            <input
                                type="text"
                                id="no_registrasi"
                                onChange={(e) =>
                                    setData("no_registrasi", e.target.value)
                                }
                                value={data.no_registrasi}
                                autoCapitalize="characters"
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    errors.no_registrasi && "border-red-500"
                                }`}
                                placeholder="No. Registrasi"
                            />
                            {errors.no_registrasi && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {errors.no_registrasi}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="jenis"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Jenis
                            </label>
                            <input
                                type="text"
                                id="jenis"
                                onChange={(e) =>
                                    setData("jenis", e.target.value)
                                }
                                value={data.jenis}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    errors.jenis && "border-red-500"
                                }`}
                                placeholder="Jenis"
                            />
                            {errors.jenis && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {errors.jenis}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="tahun_pembuatan"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Tahun Pembuatan
                            </label>
                            <input
                                type="text"
                                id="tahun_pembuatan"
                                onChange={(e) =>
                                    setData("tahun_pembuatan", e.target.value)
                                }
                                value={data.tahun_pembuatan}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    errors.tahun_pembuatan && "border-red-500"
                                }`}
                                placeholder="Tahun Pembuatan"
                            />
                            {errors.tahun_pembuatan && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {errors.tahun_pembuatan}
                                </p>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="warna"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Warna
                            </label>
                            <input
                                type="text"
                                id="warna"
                                onChange={(e) =>
                                    setData("warna", e.target.value)
                                }
                                value={data.warna}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    errors.warna && "border-red-500"
                                }`}
                                placeholder="Warna"
                            />
                            {errors.warna && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {errors.warna}
                                </p>
                            )}
                        </div>
                        <div className="items-center">
                            <label
                                htmlFor="status"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Status
                            </label>
                            <div className="flex items-center space-x-4 pt-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Aktif"
                                        name="status"
                                        value="Aktif"
                                        checked={data.status === "Aktif"}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-xs 2xl:text-sm">
                                        Aktif
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Perbaikan"
                                        name="status"
                                        value="Perbaikan"
                                        checked={data.status === "Perbaikan"}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-xs 2xl:text-sm">
                                        Perbaikan
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Tidak Aktif"
                                        name="status"
                                        value="Tidak Aktif"
                                        checked={data.status === "Tidak Aktif"}
                                        onChange={(e) =>
                                            setData("status", e.target.value)
                                        }
                                        className="mr-2"
                                    />
                                    <span className="text-xs 2xl:text-sm">
                                        Tidak Aktif
                                    </span>
                                </label>
                            </div>
                            {errors.status && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {errors.status}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-2 pt-4">
                        <button
                            type="submit"
                            disabled={processing}
                            className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md 2xl:rounded-lg text-xs 2xl:text-sm w-full sm:w-auto px-3 py-2 2xl:px-3.5 2xl:py-2.5 text-center"
                        >
                            Submit
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
