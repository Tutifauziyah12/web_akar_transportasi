import React, { useState, useEffect, forwardRef } from "react";
import { Head, router, useForm, usePage } from "@inertiajs/react";
import RupiahInput from "@/Utils/RupiahInput";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { id } from "date-fns/locale";
import { format } from "date-fns";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { registerLocale, setDefaultLocale } from "react-datepicker";

registerLocale("id", id);
setDefaultLocale("id");

import { validationSchemaPengeluaran } from "@/Utils/validationSchema";

export default function Create({ lastKode, handleClose }) {
    // Default Code
    const modifyString = (str) => {
        let lastThreeDigits = str.slice(-3);
        let incrementedDigits = (parseInt(lastThreeDigits) + 1)
            .toString()
            .padStart(3, "0");
        let newStr = str.slice(0, -3) + incrementedDigits;
        return newStr;
    };
    let originalString = lastKode;
    let modifiedString = modifyString(originalString);

    const { data, setData, post, errors, processing, reset } = useForm({
        kode: modifiedString,
        nama: "",
        tanggal: "",
        total: 0,
        metode: "",
        keterangan: "",
    });

    const [validationErrors, setValidationErrors] = useState({});
    const { flash } = usePage().props;

    const handleChange = (field, value) => {
        if (field === "tanggal") {
            const date = new Date(value);
            value = format(date, "yyyy/MM/dd");
        }
        setData((prevData) => ({
            ...prevData,
            [field]: value,
        }));
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

    const formatDateToYYYYMMDD = (date) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const [startDate, setStartDate] = useState(null);

    const onChange = (date) => {
        setStartDate(date);
    };

    data.tanggal = formatDateToYYYYMMDD(startDate);

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await validationSchemaPengeluaran.validate(data, {
                abortEarly: false,
            });
            post("/pengeluaran", {
                onSuccess: () => {
                    reset();
                    handleClose();
                },
            });
        } catch (err) {
            console.log(err)
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
    console.log("errors", errors)

    const today = new Date();

    return (
        <>
            <Head title="Edit Pengeluaran" />
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
                                <div className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {validationErrors.kode}
                                </div>
                            )}
                        </div>

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
                                    validationErrors.nama && "border-red-500"
                                }`}
                                placeholder={
                                    validationErrors.nama
                                        ? validationErrors.nama
                                        : data.nama
                                        ? ""
                                        : "Nama"
                                }
                            />
                            {validationErrors.nama && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {validationErrors.nama}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="tanggal"
                                className="block mb-2 font-semibold text-gray-700"
                            >
                                Tanggal
                            </label>

                            <div>
                                <DatePicker
                                    selected={startDate}
                                    onChange={onChange}
                                    startDate={startDate}
                                    customInput={<ExampleCustomInput />}
                                    dateFormat="dd MMMM yyyy"
                                    locale="id"
                                    minDate={today}
                                />
                            </div>

                            {validationErrors.tanggal && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {validationErrors.tanggal}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="total"
                                className="block mb-2 font-semibold text-gray-900 "
                            >
                                Total
                            </label>
                            <RupiahInput
                                value={data.total.toString()}
                                onChange={(value) => setData("total", value)}
                                placeholder="Total"
                            />
                            {validationErrors.total && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {validationErrors.total}
                                </p>
                            )}
                            <div className="flex items-center space-x-4 pt-3">
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Cash"
                                        name="metodeSewa"
                                        value="Cash"
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        checked={data.metode === "Cash"}
                                        className="mr-2"
                                    />
                                    <span className="text-xs 2xl:text-sm">
                                        Cash
                                    </span>
                                </label>
                                <label className="flex items-center">
                                    <input
                                        type="radio"
                                        id="Debit"
                                        name="metodeSewa"
                                        value="Debit"
                                        onChange={(e) =>
                                            setData("metode", e.target.value)
                                        }
                                        checked={data.metode === "Debit"}
                                        className="mr-2"
                                    />
                                    <span className="text-xs 2xl:text-sm">
                                        Debit
                                    </span>
                                </label>
                            </div>
                            {validationErrors.metode && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {validationErrors.metode}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="keterangan"
                                className="block mb-2 font-semibold text-gray-900"
                            >
                                Keterangan
                            </label>
                            <textarea
                                id="keterangan"
                                onChange={(e) =>
                                    setData("keterangan", e.target.value)
                                }
                                value={data.keterangan}
                                style={{ minHeight: "120px" }}
                                className={`bg-gray-50 border border-gray-300 text-gray-900 text-xs 2xl:text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2 2xl:p-2.5 ${
                                    validationErrors.keterangan &&
                                    "border-red-500"
                                }`}
                                placeholder={
                                    validationErrors.keterangan
                                        ? validationErrors.keterangan
                                        : "Keterangan"
                                }
                            />
                            {validationErrors.keterangan && (
                                <p className="text-red-700 text-[10px] 2xl:text-xs mt-1 ml-1 italic">
                                    {validationErrors.keterangan}
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
