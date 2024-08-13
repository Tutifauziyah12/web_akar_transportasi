import React from "react";
import RupiahFormat from "@/Utils/RupiahFormat";
import FormatDateRange from "@/Utils/FormatDateRange";

const PrintPendapatanTable = React.forwardRef(
    ({ sewa, category, formattedDateRange, date }, ref) => {
        let number = 1;

        let totalPendapatan = 0;
        sewa.forEach((item) => {
            if (category === "semua") {
                const totalPendapatanLainnya = item.pendapatan_lainnya.reduce(
                    (acc, pendapatan) => acc + pendapatan.total,
                    0
                );
                const totalKeseluruhan = item.total + totalPendapatanLainnya;

                if (totalKeseluruhan === item.pembayaran) {
                    totalPendapatan += totalKeseluruhan;
                } else {
                    totalPendapatan += item.pembayaran;
                }
            } else if (category === "pendapatan_sewa") {
                if (item.total === item.pembayaran) {
                    totalPendapatan += item.total;
                } else if (item.total < item.pembayaran) {
                    totalPendapatan += item.total;
                } else {
                    totalPendapatan += item.pembayaran;
                }
            } else if (category === "pendapatan_lainnya") {
                const totalPendapatanLainnya = item.pendapatan_lainnya.reduce(
                    (acc, pendapatan) => acc + pendapatan.total,
                    0
                );

                if (totalPendapatanLainnya === item.pembayaran) {
                    totalPendapatan += totalPendapatanLainnya;
                } else if (item.total > item.pembayaran) {
                    totalPendapatan += 0;
                } else {
                    totalPendapatan += item.pembayaran - item.total;
                }
            } else {
                totalPendapatan = 0;
            }
        });

        return (
            <div ref={ref} className="print:my-10 print:mx-20 print:text-[9px]">
                <div className="text-center font-semibold mb-6 text-xl 2xl:text-2xl">
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
                            <th scope="col" className="px-3 py-2  w-[20%]">
                                Jumlah
                            </th>
                        </tr>
                    </thead>
                    <tbody className="leading-relaxed">
                        {sewa && sewa.length > 0 ? (
                            sewa.map((item, index) => (
                                <React.Fragment key={index+1}>
                                    {category === "semua" ||
                                    category === "pendapatan_sewa" ? (
                                        <tr className="bg-white border-b hover:bg-gray-50 align-top">
                                            <td className="px-8 py-2">
                                                {index + 1}
                                            </td>
                                            <td className="px-3 py-2">
                                                <FormatDateRange
                                                    startDateString={
                                                        item.created_at

                                                    }
                                                    endDateString={
                                                        item.created_at

                                                    }
                                                />
                                            </td>
                                            <td className="px-3 py-2">
                                                {item.total +
                                                    item.pendapatan_lainnya.reduce(
                                                        (acc, item) =>
                                                            acc + item.total,
                                                        0
                                                    ) ===
                                                item.pembayaran ? (
                                                    <span className="bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                        Lunas
                                                    </span>
                                                ) : (
                                                    <span className="bg-yellow-100 text-yellow-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                        Termin
                                                    </span>
                                                )}
                                                <span className="font-medium">
                                                    {item.id_sewa} - Sewa
                                                </span>
                                                <br />
                                                {item.sewa_kendaraan.length >
                                                    0 && (
                                                    <span>
                                                        {item.sewa_kendaraan
                                                            .map(
                                                                (kendaraan) =>
                                                                    `${kendaraan.kendaraan.nama} (${kendaraan.kendaraan.no_registrasi})`
                                                            )
                                                            .join(", ")}
                                                    </span>
                                                )}
                                                <br />
                                                {item.total +
                                                    item.pendapatan_lainnya.reduce(
                                                        (acc, pendapatan) =>
                                                            acc +
                                                            pendapatan.total,
                                                        0
                                                    ) ===
                                                item.pembayaran ? (
                                                    <></>
                                                ) : item.pembayaran >
                                                  item.total ? (
                                                    <></>
                                                ) : (
                                                    <span className="italic">
                                                        Details : Sisa
                                                        Pembayaran{" "}
                                                        {new Intl.NumberFormat(
                                                            "id-ID",
                                                            {
                                                                style: "currency",
                                                                currency: "IDR",
                                                                minimumFractionDigits: 0,
                                                            }
                                                        ).format(
                                                            item.total +
                                                                item.pendapatan_lainnya.reduce(
                                                                    (
                                                                        acc,
                                                                        item
                                                                    ) =>
                                                                        acc +
                                                                        item.total,
                                                                    0
                                                                ) -
                                                                item.pembayaran
                                                        )}
                                                    </span>
                                                )}
                                            </td>

                                            <td className="px-3 py-2">
                                                {item.total +
                                                    item.pendapatan_lainnya.reduce(
                                                        (acc, item) =>
                                                            acc + item.total,
                                                        0
                                                    ) ===
                                                item.pembayaran ? (
                                                    <>
                                                        <span className="bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                            {item.metode}
                                                        </span>
                                                        <br />
                                                        <RupiahFormat
                                                            value={item.total}
                                                        />{" "}
                                                    </>
                                                ) : item.pembayaran >
                                                  item.total ? (
                                                    <>
                                                        <span className="bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                            {item.metode}
                                                        </span>
                                                        <br />
                                                        <RupiahFormat
                                                            value={item.total}
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <span className="bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                            {item.metode}
                                                        </span>
                                                        <br />
                                                        <RupiahFormat
                                                            value={
                                                                item.pembayaran
                                                            }
                                                        />
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        <></>
                                    )}
                                    {category === "semua" ||
                                    (category === "pendapatan_lainnya" &&
                                        item.pendapatan_lainnya &&
                                        item.pendapatan_lainnya.length > 0) ? (
                                        item.pendapatan_lainnya.map(
                                            (pendapatan, idx) => (
                                                <tr
                                                    key={`${item.id}-${idx}`}
                                                    className="bg-white border-b hover:bg-gray-50 align-top"
                                                >
                                                    <td className="px-3 py-2">
                                                        {category ===
                                                        "pendapatan_lainnya" ? (
                                                            <span className="px-5 py-2">
                                                                {number++}
                                                            </span>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {category ===
                                                        "pendapatan_lainnya" ? (
                                                            <span className="">
                                                                <FormatDateRange
                                                                    startDateString={
                                                                        item.updated_at

                                                                    }
                                                                    endDateString={
                                                                        item.updated_at
                                                                    }
                                                                />
                                                            </span>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.total +
                                                            item.pendapatan_lainnya.reduce(
                                                                (acc, item) =>
                                                                    acc +
                                                                    item.total,
                                                                0
                                                            ) ===
                                                        item.pembayaran ? (
                                                            <span className="bg-green-100 text-green-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                                Lunas
                                                            </span>
                                                        ) : (
                                                            <span className="bg-yellow-100 text-yellow-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                                Termin
                                                            </span>
                                                        )}
                                                        <span className="font-medium">
                                                            {item.kode} -
                                                            Lainnya
                                                        </span>{" "}
                                                        <br />
                                                        {pendapatan.nama} dengan
                                                        jumlah{" "}
                                                        {pendapatan.jumlah}
                                                        {item.total +
                                                            item.pendapatan_lainnya.reduce(
                                                                (
                                                                    acc,
                                                                    pendapatan
                                                                ) =>
                                                                    acc +
                                                                    pendapatan.total,
                                                                0
                                                            ) ===
                                                        item.pembayaran ? (
                                                            <></>
                                                        ) : item.pembayaran >
                                                          item.total ? (
                                                            <>
                                                                <span className="italic">
                                                                    <br />
                                                                    Details :
                                                                    Sisa
                                                                    Pembayaran{" "}
                                                                    {new Intl.NumberFormat(
                                                                        "id-ID",
                                                                        {
                                                                            style: "currency",
                                                                            currency:
                                                                                "IDR",
                                                                            minimumFractionDigits: 0,
                                                                        }
                                                                    ).format(
                                                                        item.total +
                                                                            item.pendapatan_lainnya.reduce(
                                                                                (
                                                                                    acc,
                                                                                    item
                                                                                ) =>
                                                                                    acc +
                                                                                    item.total,
                                                                                0
                                                                            ) -
                                                                            item.pembayaran
                                                                    )}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                    <td className="px-3 py-2">
                                                        {item.total +
                                                            item.pendapatan_lainnya.reduce(
                                                                (acc, item) =>
                                                                    acc +
                                                                    item.total,
                                                                0
                                                            ) ===
                                                        item.pembayaran ? (
                                                            <>
                                                                <span className="bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                                    {
                                                                        item.metode
                                                                    }
                                                                </span>
                                                                <br />
                                                                <RupiahFormat
                                                                    value={
                                                                        pendapatan.total
                                                                    }
                                                                />
                                                            </>
                                                        ) : item.pembayaran >
                                                          item.total ? (
                                                            <>
                                                                <span className="bg-indigo-100 text-indigo-800 font-medium me-2 px-2.5 py-0.5 rounded">
                                                                    {
                                                                        item.metode
                                                                    }
                                                                </span>
                                                                <RupiahFormat
                                                                    value={
                                                                        item.pembayaran -
                                                                        item.total
                                                                    }
                                                                />
                                                            </>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </td>
                                                </tr>
                                            )
                                        )
                                    ) : (
                                        <></>
                                    )}
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
                                <RupiahFormat value={totalPendapatan} />
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        );
    }
);

export default PrintPendapatanTable;
