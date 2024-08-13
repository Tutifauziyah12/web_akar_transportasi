import React from "react";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";

const PrintPengeluaranTable = React.forwardRef(
    ({ pengeluaran, formattedDateRange, date }, ref) => {
        let totalPengeluaran = 0;
        pengeluaran.forEach((item) => {
            totalPengeluaran += item.total;
        });

        return (
            <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
                <div className="text-center font-semibold mb-6 text-xl 2xl:text-2xl">
                    <span className="block">Laporan Pengeluran Kas</span>

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
                </div>

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
                            <th scope="col" className="px-3 py-2 w-[15%]">
                                Jumlah
                            </th>
                        </tr>
                    </thead>
                    <tbody className="leading-relaxed">
                        {pengeluaran && pengeluaran.length > 0 ? (
                            pengeluaran.map((item, index) => (
                                <React.Fragment key={index + 1}>
                                    <tr className="bg-white border-b hover:bg-gray-50 align-top">
                                        <td className="px-8 py-2">
                                            {index + 1}
                                        </td>
                                        <td className="px-3 py-2">
                                            <FormatDateRange
                                                startDateString={item.tanggal}
                                                endDateString={item.tanggal}
                                            />
                                        </td>
                                        <td className="px-3 py-2">
                                            <span className="font-medium">
                                                {item.id_pengeluarans}
                                                {" - "}
                                                {item.nama}
                                            </span>
                                            <br />
                                            Detail : {item.keterangan}
                                        </td>

                                        <td className="px-3 py-2">
                                            <span className="bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                {item.metode}
                                            </span>
                                            <br />
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
                                    Tidak ada data pengeluaran untuk
                                    ditampilkan.
                                </td>
                            </tr>
                        )}
                        <tr className="text-md text-gray-700 bg-slate-200 h-14">
                            <td
                                colSpan="3"
                                className="px-3 py-2 font-semibold text-center uppercase"
                            >
                                Total Pengeluran
                            </td>
                            <td className="px-3 py-2 font-semibold">
                                <RupiahFormat value={totalPengeluaran} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PrintPengeluaranTable;
