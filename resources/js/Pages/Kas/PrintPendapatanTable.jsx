import React from "react";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";

const PrintPendapatanTable = React.forwardRef(
    ({ sewa, formattedDateRange, date }, ref) => {
        let number = 1;
        const totalPembayaran = sewa.reduce((acc, item) => acc + item.total, 0);

        return (
            <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
                {/* <div className="text-center font-semibold mb-6 text-xl 2xl:text-2xl">
                    <span className="block">
                        Laporan Pendapatan{" "}
                        {category === "semua"
                            ? ""
                            : category === "pendapatan_lainnya"
                            ? "Lainnya"
                            : "Sewa"}{" "}
                        Kas
                    </span>

                    <span className="block">
                        {date[0].startDate === null ? (
                            <></>
                        ) : (
                            <>
                                <div className="text-base">
                                    <span>Periode </span>
                                    <FormatDateRange
                                        startDateString={date[0].startDate}
                                        endDateString={date[0].endDate}
                                    />
                                </div>
                            </>
                        )}
                    </span>
                </div> */}

                <table className="w-full text-left rtl:text-right text-gray-500">
                    <thead className="text-md text-gray-700 uppercase bg-gray-200 h-14 rounded-lg">
                        <tr>
                            <th scope="col" className="px-8 py-2 w-[1%]">
                                No
                            </th>
                            <th scope="col" className="px-3 py-2 w-[15%]">
                                Tanggal
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Keterangan
                            </th>
                            <th scope="col" className="px-3 py-2  w-[20%]">
                                Jumlah
                            </th>
                        </tr>
                    </thead>
                    <tbody className="leading-relaxed">
                        {sewa && sewa.length > 0 ? (
                            sewa.map((item, index) => (
                                <React.Fragment key={index + 1}>
                                    <tr className="bg-white border-b hover:bg-gray-50 align-top">
                                        <td className="px-8 py-2">
                                            {index + 1}
                                        </td>
                                        <td className="px-3 py-2">
                                            <FormatDateRange
                                                startDateString={
                                                    item.created_at
                                                }
                                                endDateString={item.created_at}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            {item.sewa.total +
                                                item.sewa.pendapatan_lainnya.reduce(
                                                    (accumulator, current) =>
                                                        accumulator +
                                                        current.total,
                                                    0
                                                ) -
                                                item.sewa.history_pembayaran.reduce(
                                                    (accumulator, current) =>
                                                        accumulator +
                                                        current.total,
                                                    0
                                                ) ===
                                            0 ? (
                                                <>
                                                    <span className="bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                        Lunas
                                                    </span>
                                                    <span className="font-medium">
                                                        {item.sewa_id}
                                                    </span>
                                                    <br />
                                                    {item.sewa.nama} {" - "}
                                                    {item.sewa.sewa_kendaraan.map(
                                                        (sk, idx) => (
                                                            <span key={idx}>
                                                                {
                                                                    sk.kendaraan
                                                                        .nama
                                                                }
                                                                (
                                                                {
                                                                    sk.kendaraan
                                                                        .no_registrasi
                                                                }
                                                                )
                                                                {idx <
                                                                item.sewa
                                                                    .sewa_kendaraan
                                                                    .length -
                                                                    1
                                                                    ? ", "
                                                                    : ""}
                                                            </span>
                                                        )
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    <span className="bg-yellow-100 text-yellow-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                        Termin
                                                    </span>
                                                    <span className="font-medium">
                                                        {item.sewa_id}
                                                    </span>
                                                    <br />
                                                    {item.sewa.nama} {" - "}
                                                    {item.sewa.sewa_kendaraan.map(
                                                        (sk, idx) => (
                                                            <span key={idx}>
                                                                {
                                                                    sk.kendaraan
                                                                        .nama
                                                                }
                                                                (
                                                                {
                                                                    sk.kendaraan
                                                                        .no_registrasi
                                                                }
                                                                )
                                                                {idx <
                                                                item.sewa
                                                                    .sewa_kendaraan
                                                                    .length -
                                                                    1
                                                                    ? ", "
                                                                    : ""}
                                                            </span>
                                                        )
                                                    )}
                                                    {item.sewa.pendapatan_lainnya.map(
                                                        (sk, idx) => (
                                                            <span key={idx}>
                                                                {", "}
                                                                {sk.nama}
                                                                {"*"}
                                                                {sk.jumlah}{" "}
                                                            </span>
                                                        )
                                                    )}
                                                    <br />
                                                    Sisa Pembayaran :{" "}
                                                    <RupiahFormat
                                                        value={
                                                            item.sewa.total +
                                                            item.sewa.pendapatan_lainnya.reduce(
                                                                (
                                                                    accumulator,
                                                                    current
                                                                ) =>
                                                                    accumulator +
                                                                    current.total,
                                                                0
                                                            ) -
                                                            item.sewa.history_pembayaran.reduce(
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
                                            {/* {item.sewa.total} */}
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                {item.metode}
                                            </span>
                                            <RupiahFormat value={item.total} />
                                        </td>
                                    </tr>
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="4"
                                    className="px-3 py-2 text-center bg-white h-14"
                                >
                                    Tidak ada data pendapatan untuk ditampilkan.
                                </td>
                            </tr>
                        )}
                        <tr className="text-md text-gray-700 bg-slate-200 h-14">
                            <td
                                colSpan="3"
                                className="px-3 py-2 font-semibold text-center uppercase"
                            >
                                Total Pendapatan
                            </td>
                            <td className="px-3 py-2 font-semibold">
                                <RupiahFormat value={totalPembayaran} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PrintPendapatanTable;
