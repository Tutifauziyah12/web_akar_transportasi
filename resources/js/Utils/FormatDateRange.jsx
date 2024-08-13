import React from "react";

const formatDate = (dateString, includeYear = true) => {
    const date = new Date(dateString);
    const day = date.getDate(); // Ini akan mengembalikan angka tanpa nol di depan
    const monthOptions = { month: "long" };
    const month = date.toLocaleDateString("id-ID", monthOptions);
    const year = date.getFullYear();

    return includeYear ? `${day} ${month} ${year}` : `${day} ${month}`;
};

const FormatDateRange = ({ startDateString, endDateString }) => {
    if (!startDateString) {
        return null; // Jangan tampilkan apapun jika tanggal mulai belum diinput
    }

    const startDate = new Date(startDateString);
    const endDate = endDateString ? new Date(endDateString) : null;

    if (isNaN(startDate.getTime()) || (endDate && isNaN(endDate.getTime()))) {
        return null;
    }

    if (!endDateString) {
        return formatDate(startDateString);
    }

    if (startDate.getTime() === endDate.getTime()) {
        return formatDate(startDateString);
    } else if (
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getFullYear() === endDate.getFullYear()
    ) {
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const month = startDate.toLocaleDateString("id-ID", { month: "long" });
        const year = startDate.getFullYear();
        return `${startDay} - ${endDay} ${month} ${year}`;
    } else if (startDate.getFullYear() === endDate.getFullYear()) {
        const startFormatted = formatDate(startDateString);
        const endFormatted = formatDate(endDateString, false);
        return `${startFormatted} - ${endFormatted} ${endDate.getFullYear()}`;
    } else {
        const startFormatted = formatDate(startDateString);
        const endFormatted = formatDate(endDateString);
        return `${startFormatted} - ${endFormatted}`;
    }
};

export default FormatDateRange;
