import React, { useState, useEffect, forwardRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head, useForm } from "@inertiajs/react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
    IoCloseSharp,
    IoArrowBack,
    IoCloseCircleOutline,
    IoEyeOff,
    IoEye,
} from "react-icons/io5";
import { validationSchemaUserCreation } from "@/Utils/validationSchema";

export default function Edit({ id, handleCloseEdit }) {
    const { data, setData, put, processing, errors, reset } = useForm({
        name: "",
        email: "",
        level: "",
        password: "",
        password_confirmation: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(name, value);
    };

    const [user, setUser] = useState(null);

    useEffect(() => {
        if (id) {
            axios
                .get(`/admin/${id}`)
                .then((response) => {
                    const userData = response.data;
                    setUser(userData);

                    setData({
                        name: userData.name,
                        email: userData.email,
                        level: userData.level,
                        password: "",
                        password_confirmation: "",
                    });
                })
                .catch((error) => {
                    console.error("Error fetching user:", error);
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchemaUserCreation.validate(data, {
                abortEarly: false,
            });
            put(`/admin/${id}`, {
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
            <Head title="Edit Akun" />

            <div className="py-4 2xl:py-6 px-6 2xl:px-10">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-5 mb-6 md:grid-cols-1">
                        <div>
                            <label
                                htmlFor="name"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Nama
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={handleChange}
                                disabled
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.name && "border-red-500"
                                }`}
                                placeholder="Nama"
                            />

                            {validationErrors.name && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.name}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="email"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={data.email}
                                disabled
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.email && "border-red-500"
                                }`}
                                placeholder="Email"
                            />

                            {validationErrors.email && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.email}
                                </div>
                            )}
                        </div>
                        <div>
                            <label
                                htmlFor="level"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Level
                            </label>
                            <select
                                name="level"
                                value={data.level}
                                onChange={handleChange}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.level && "border-red-500"
                                }`}
                            >
                                <option value="">Pilih Level</option>
                                <option value="Pegawai">Pegawai</option>
                                <option value="Owner">Owner</option>
                            </select>

                            {validationErrors.level && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.level}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="password"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={data.password}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                        validationErrors.password &&
                                        "border-red-500"
                                    }`}
                                    placeholder="Password"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <IoEyeOff className="text-2xl    text-slate-300" />
                                    ) : (
                                        <IoEye className="text-2xl   text-slate-300" />
                                    )}
                                </div>
                            </div>

                            {validationErrors.password && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.password}
                                </div>
                            )}
                        </div>
                        <div className="relative">
                            <label
                                htmlFor="password_confirmation"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Konfirmasi Password
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        showPasswordConfirmation
                                            ? "text"
                                            : "password"
                                    }
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    onChange={handleChange}
                                    className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                        validationErrors.password_confirmation &&
                                        "border-red-500"
                                    }`}
                                    placeholder="Konfirmasi Password"
                                />
                                <div
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                                    onClick={() =>
                                        setShowPasswordConfirmation(
                                            !showPasswordConfirmation
                                        )
                                    }
                                >
                                    {showPasswordConfirmation ? (
                                        <IoEyeOff className="text-2xl text-slate-300" />
                                    ) : (
                                        <IoEye className="text-2xl text-slate-300" />
                                    )}
                                </div>
                            </div>

                            {validationErrors.password_confirmation && (
                                <div className="text-red-700 text-[10px] 2xl:text-xs italic mt-1 ml-1">
                                    {validationErrors.password_confirmation}
                                </div>
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
