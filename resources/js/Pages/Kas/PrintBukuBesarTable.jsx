import React from "react";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";

const PrintBukuBesarTable = React.forwardRef(
    ({ kasList, formattedDateRange, date }, ref) => {
        let number = 1;

        let totalPendapatan = 0;

        return (
            <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
                <div className="text-center font-semibold mb-6 text-xl 2xl:text-2xl">
                    <span className="block">Laporan Buku Besar Kas</span>

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
                            <th scope="col" className="px-3 py-2 w-[10%]">
                                Tanggal
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Keterangan
                            </th>
                            <th scope="col" className="px-3 py-2 w-[15%]">
                                Debit
                            </th>
                            <th scope="col" className="px-3 py-2 w-[15%]">
                                Kredit
                            </th>
                            <th scope="col" className="px-3 py-2 w-[15%]">
                                Saldo
                            </th>
                        </tr>
                    </thead>
                    <tbody className="leading-relaxed">
                        {kasList && kasList.length > 0 ? (
                            kasList.map((item, index) => (
                                <React.Fragment key={item.id_kas}>
                                    {item.id_kas.startsWith("PS") ? (
                                        <>
                                            <tr
                                                className="bg-white border-b hover:bg-gray-50 align-top"
                                                key={`row-ps-${item.id}`}
                                            >
                                                <td className="px-8 py-2 w-28">
                                                    {index + 1}
                                                </td>
                                                <td className="px-3 py-2">
                                                    <FormatDateRange
                                                        startDateString={
                                                            item.sewa
                                                                .created_at

                                                        }
                                                        endDateString={
                                                            item.sewa
                                                                .created_at

                                                        }
                                                    />
                                                </td>
                                                <td className="px-3 py-2">
                                                    {item.sewa.total +
                                                        item.sewa.pendapatan_lainnya.reduce(
                                                            (acc, item) =>
                                                                acc +
                                                                item.total,
                                                            0
                                                        ) ===
                                                    item.sewa.pembayaran ? (
                                                        <>
                                                            <span className="bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                                Lunas
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span className="bg-yellow-100 text-yellow-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                            Termin
                                                        </span>
                                                    )}
                                                    <span className="font-medium">
                                                        {item.id_kas} - Sewa
                                                        Kendaraan
                                                    </span>
                                                    <br />
                                                    {item.sewa.sewa_kendaraan
                                                        .length > 0 && (
                                                        <span>
                                                            {item.sewa.sewa_kendaraan
                                                                .map(
                                                                    (
                                                                        kendaraan
                                                                    ) =>
                                                                        `${kendaraan.kendaraan.nama} (${kendaraan.kendaraan.no_registrasi})`
                                                                )
                                                                .join(", ")}
                                                        </span>
                                                    )}
                                                </td>

                                                <td className="px-3 py-2">
                                                    {item.sewa.total +
                                                        item.sewa.pendapatan_lainnya.reduce(
                                                            (acc, item) =>
                                                                acc +
                                                                item.total,
                                                            0
                                                        ) ===
                                                    item.sewa.pembayaran ? (
                                                        <>
                                                            <RupiahFormat
                                                                value={
                                                                    item.sewa
                                                                        .total
                                                                }
                                                            />
                                                        </>
                                                    ) : item.sewa.total >
                                                      item.sewa.pembayaran ? (
                                                        <>
                                                            <RupiahFormat
                                                                value={
                                                                    item.sewa
                                                                        .pembayaran
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RupiahFormat
                                                                value={
                                                                    item.sewa
                                                                        .total
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </td>
                                                <td className="px-3 py-2">-</td>
                                                <td className="px-3 py-2">
                                                    {item.sewa.total +
                                                        item.sewa.pendapatan_lainnya.reduce(
                                                            (acc, item) =>
                                                                acc +
                                                                item.total,
                                                            0
                                                        ) ===
                                                    item.sewa.pembayaran ? (
                                                        <>
                                                            <RupiahFormat
                                                                value={
                                                                    (totalPendapatan +=
                                                                        item
                                                                            .sewa
                                                                            .total)
                                                                }
                                                            />
                                                        </>
                                                    ) : item.sewa.total >
                                                      item.sewa.pembayaran ? (
                                                        <>
                                                            <RupiahFormat
                                                                value={
                                                                    (totalPendapatan +=
                                                                        item
                                                                            .sewa
                                                                            .pembayaran)
                                                                }
                                                            />
                                                        </>
                                                    ) : (
                                                        <>
                                                            <RupiahFormat
                                                                value={
                                                                    (totalPendapatan +=
                                                                        item
                                                                            .sewa
                                                                            .total)
                                                                }
                                                            />
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                            {item.sewa.pendapatan_lainnya &&
                                            item.sewa.pendapatan_lainnya
                                                .length > 0 ? (
                                                item.sewa.pendapatan_lainnya.map(
                                                    (pendapatan, idx) => (
                                                        <tr
                                                            className="bg-white border-b hover:bg-gray-50 align-top"
                                                            key={`row-ps-pendapatan-${item.id}-${idx}`}
                                                        >
                                                            <td className="px-3 py-2"></td>
                                                            <td className="px-3 py-2"></td>
                                                            <td className="px-3 py-2">
                                                                {item.sewa
                                                                    .total +
                                                                    item.sewa.pendapatan_lainnya.reduce(
                                                                        (
                                                                            acc,
                                                                            item
                                                                        ) =>
                                                                            acc +
                                                                            item.total,
                                                                        0
                                                                    ) ===
                                                                item.sewa
                                                                    .pembayaran ? (
                                                                    <>
                                                                        <span className="bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                                            Lunas
                                                                        </span>
                                                                    </>
                                                                ) : (
                                                                    <span className="bg-yellow-100 text-yellow-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                                        Termin
                                                                    </span>
                                                                )}
                                                                <span className="font-semibold">
                                                                    {
                                                                        item.id_kas
                                                                    }{" "}
                                                                    - Pendapatan
                                                                    Lainnya
                                                                </span>
                                                                <br />
                                                                {
                                                                    pendapatan.nama
                                                                }
                                                                <span>
                                                                    {" "}
                                                                    dengan
                                                                    jumlah{" "}
                                                                    {
                                                                        pendapatan.jumlah
                                                                    }
                                                                </span>
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {item.sewa
                                                                    .total +
                                                                    item.sewa.pendapatan_lainnya.reduce(
                                                                        (
                                                                            acc,
                                                                            item
                                                                        ) =>
                                                                            acc +
                                                                            item.total,
                                                                        0
                                                                    ) ===
                                                                item.sewa
                                                                    .pembayaran ? (
                                                                    <>
                                                                        <RupiahFormat
                                                                            value={
                                                                                pendapatan.total
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : item.sewa
                                                                      .total >
                                                                  item.sewa
                                                                      .pembayaran ? (
                                                                    <>-</>
                                                                ) : (
                                                                    <>
                                                                        <RupiahFormat
                                                                            value={
                                                                                item
                                                                                    .sewa
                                                                                    .pembayaran -
                                                                                item
                                                                                    .sewa
                                                                                    .total
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                -
                                                            </td>
                                                            <td className="px-3 py-2">
                                                                {item.sewa
                                                                    .total +
                                                                    item.sewa.pendapatan_lainnya.reduce(
                                                                        (
                                                                            acc,
                                                                            item
                                                                        ) =>
                                                                            acc +
                                                                            item.total,
                                                                        0
                                                                    ) ===
                                                                item.sewa
                                                                    .pembayaran ? (
                                                                    <>
                                                                        <RupiahFormat
                                                                            value={
                                                                                (totalPendapatan +=
                                                                                    pendapatan.total)
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : item.sewa
                                                                      .total >
                                                                  item.sewa
                                                                      .pembayaran ? (
                                                                    <>
                                                                        <RupiahFormat
                                                                            value={
                                                                                totalPendapatan
                                                                            }
                                                                        />
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <RupiahFormat
                                                                            value={
                                                                                (totalPendapatan +=
                                                                                    item
                                                                                        .sewa
                                                                                        .pembayaran -
                                                                                    item
                                                                                        .sewa
                                                                                        .total)
                                                                            }
                                                                        />
                                                                    </>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            ) : (
                                                <></>
                                            )}
                                        </>
                                    ) : (
                                        <tr
                                            className="bg-white border-b hover:bg-gray-50 align-top"
                                            key={`row-p-${item.id}`}
                                        >
                                            <td className="px-8 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        item.pengeluaran.tanggal
                                                    }
                                                    endDateString={
                                                        item.pengeluaran.tanggal
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <span className="font-semibold">
                                                    {item.pengeluaran.id_pengeluarans} -
                                                    Pengeluaran
                                                </span>
                                                <br />
                                                {item.pengeluaran.nama}
                                                <br />
                                                <span className="">
                                                    Detail :{" "}
                                                    {
                                                        item.pengeluaran
                                                            .keterangan
                                                    }
                                                </span>
                                            </td>
                                            <td className="px-3 py-2"> - </td>
                                            <td className="px-3 py-2">
                                                <RupiahFormat
                                                    value={
                                                        item.pengeluaran.total
                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                <RupiahFormat
                                                    value={
                                                        (totalPendapatan -=
                                                            item.pengeluaran
                                                                .total)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-3 py-2 text-center h-14 bg-white"
                                >
                                    Tidak ada data pendapatan untuk ditampilkan.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PrintBukuBesarTable;
