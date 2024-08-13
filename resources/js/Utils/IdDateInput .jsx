import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import id from "date-fns/locale/id";

registerLocale("id", id);
setDefaultLocale("id");

const IdDateInput = ({ id, value, onChange, errors }) => {
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        if (value) {
            const parts = value.split('/'); // Split date string by '/'
            if (parts.length === 3) {
                const year = parseInt(parts[0], 10);
                const month = parseInt(parts[1], 10) - 1; // Month is zero-indexed in Date object
                const day = parseInt(parts[2], 10);
                const parsedDate = new Date(year, month, day);
                setSelectedDate(parsedDate);
            } else {
                setSelectedDate(null);
            }
        } else {
            setSelectedDate(null);
        }
    }, [value]);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        const dateValue = date ? date.toISOString().split("T")[0] : "";
        onChange({
            value: dateValue,
        });
    };

    return (
        <div>
            <DatePicker
                selected={selectedDate}
                onChange={handleDateChange}
                dateFormat="dd MMMM yyyy"
                locale="id"
                placeholderText="Pilih Tanggal"
                customInput={
                    <input
                        type="text"
                        id={id}
                        className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 ${
                            errors[id] && "border-red-500"
                        }`}
                        placeholder={
                            errors[id]
                                ? errors[id]
                                : id === "mulai_tanggal"
                                ? "Mulai Tanggal"
                                : "Akhir Tanggal"
                        }
                        value={
                            selectedDate
                                ? selectedDate.toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                  })
                                : ""
                        }
                        readOnly
                    />
                }
            />
            {errors[id] && (
                <p className="text-red-700 text-xs mt-1 ml-1">{errors[id]}</p>
            )}
        </div>
    );
};

export default IdDateInput;
