import { useState, useEffect } from "react";
import { Link } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import { Inertia } from "@inertiajs/inertia";
import logo from "../asset/Akar Transportasi Full White.png";

import {
    IoCubeOutline,
    IoAnalytics,
    IoCarSharp,
    IoExitOutline,
} from "react-icons/io5";
import { MdAccountCircle } from "react-icons/md";
import { RiArrowDropDownLine, RiArrowDropUpLine } from "react-icons/ri";
import { GiReceiveMoney, GiPayMoney } from "react-icons/gi";
import { TbReportAnalytics } from "react-icons/tb";

import { BsCash } from "react-icons/bs";
import DropDownLink from "@/Components/DropDownLink";

export default function Authenticated({ user, header, children }) {
    const [isMobileResolution, setIsMobileResolution] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobileResolution(window.innerWidth <= 768);
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const [isPendapatanOpen, setIsPendapatanOpen] = useState(() => {
        const storedState = localStorage.getItem("isPendapatanOpen");
        return storedState ? JSON.parse(storedState) : false;
    });

    const [isLaporanOpen, setIsLaporanOpen] = useState(() => {
        const storedState = localStorage.getItem("isLaporanOpen");
        return storedState ? JSON.parse(storedState) : false;
    });

    useEffect(() => {
        localStorage.setItem(
            "isPendapatanOpen",
            JSON.stringify(isPendapatanOpen)
        );
    }, [isPendapatanOpen]);

    const togglePendapatan = () => {
        setIsPendapatanOpen(!isPendapatanOpen);
    };

    useEffect(() => {
        localStorage.setItem("isLaporanOpen", JSON.stringify(isLaporanOpen));
    }, [isLaporanOpen]);

    const toggleLaporan = () => {
        setIsLaporanOpen(!isLaporanOpen);
    };

    const handleLogout = (e) => {
        e.preventDefault();
        Inertia.post(route("logout"));
    };

    const isAnyLaporanActive =
        route().current("kasPendapatan.index") ||
        route().current("kasPengeluaran.index") ||
        route().current("kasBukuBesar.index");

    const isAnyPendapatanActive =
        route().current("sewa.index") || route().current("sewaLainnya.index");

    return (
        <div className="min-h-screen bg-gray-100 text-xs 2xl:text-base">
            <div className="flex w-full bg-slate-100">
                {!isMobileResolution ? (
                    <>
                        <div className="fixed p-8 2xl:p-10 bg-slate-800 w-[17%] lg:[22%] min-h-screen flex flex-col justify-between">
                            <div>
                                <Link href="/">
                                    <img
                                        src={logo}
                                        alt="Logo"
                                        className="mx-auto h-16 2xl:h-auto w-full mb-2 2xl:mb-6"
                                    />
                                </Link>
                                <div className="text-slate-100 my-4">
                                    <nav>
                                        <div className="text-slate-400 py-2">
                                            MENU
                                        </div>
                                        <NavLink
                                            href={route("dashboard")}
                                            active={route().current(
                                                "dashboard"
                                            )}
                                            icon={IoCubeOutline}
                                        >
                                            Dashboard
                                        </NavLink>

                                        {user.level === "Pegawai" ? (
                                            <>
                                                <div>
                                                    <div
                                                        onClick={
                                                            togglePendapatan
                                                        }
                                                        className={`inline-flex items-center px-2 py-2 my-0.5 rounded-md w-full transition duration-150 ease-in-out focus:outline-none border-transparent hover:bg-white hover:bg-opacity-10 ${
                                                            !isPendapatanOpen &&
                                                            isAnyPendapatanActive
                                                                ? "bg-opacity-10 bg-white"
                                                                : ""
                                                        }`}
                                                    >
                                                        <GiReceiveMoney className="mr-2" />
                                                        <span>Pendapatan</span>
                                                        {isPendapatanOpen ? (
                                                            <RiArrowDropUpLine className="text-lg 2xl:text-2xl ml-auto" />
                                                        ) : (
                                                            <RiArrowDropDownLine className="text-lg 2xl:text-2xl ml-auto" />
                                                        )}
                                                    </div>
                                                    {isPendapatanOpen && (
                                                        <div className="">
                                                            <DropDownLink
                                                                href={route(
                                                                    "sewa.index"
                                                                )}
                                                                active={route().current(
                                                                    "sewa.index"
                                                                )}
                                                            >
                                                                <span className="px-5 2xl:px-6 text-slate-300">
                                                                    Sewa
                                                                    Kendaraan
                                                                </span>
                                                            </DropDownLink>
                                                            <DropDownLink
                                                                href={route(
                                                                    "sewaLainnya.index"
                                                                )}
                                                                active={route().current(
                                                                    "sewaLainnya.index"
                                                                )}
                                                            >
                                                                <span className="px-5 2xl:px-6 text-slate-300">
                                                                    Lainnya
                                                                </span>
                                                            </DropDownLink>
                                                        </div>
                                                    )}
                                                </div>

                                                <NavLink
                                                    href={route(
                                                        "pengeluaran.index"
                                                    )}
                                                    active={
                                                        route().current(
                                                            "pengeluaran.index"
                                                        ) ||
                                                        route().current(
                                                            "pengeluaran.create"
                                                        ) ||
                                                        route().current(
                                                            "pengeluaran.edit"
                                                        )
                                                    }
                                                    icon={GiPayMoney}
                                                >
                                                    Pengeluaran
                                                </NavLink>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                        {user.level === "Owner" ? (
                                            <>
                                                <NavLink
                                                    href={route(
                                                        "kendaraan.index"
                                                    )}
                                                    active={
                                                        (route()
                                                            .current()
                                                            .includes(
                                                                "kendaraan"
                                                            ) &&
                                                            !route()
                                                                .current()
                                                                .includes(
                                                                    "sewa_kendaraan"
                                                                )) ||
                                                        (route()
                                                            .current()
                                                            .indexOf(
                                                                "kendaraan.create"
                                                            ) !== -1 &&
                                                            !route()
                                                                .current()
                                                                .includes(
                                                                    "sewa_kendaraan"
                                                                )) ||
                                                        (route()
                                                            .current()
                                                            .includes(
                                                                "kendaraan"
                                                            ) &&
                                                            route()
                                                                .current()
                                                                .includes(
                                                                    "edit"
                                                                ) &&
                                                            !route()
                                                                .current()
                                                                .includes(
                                                                    "sewa_kendaraan"
                                                                ))
                                                    }
                                                    icon={IoCarSharp}
                                                >
                                                    Kendaraan
                                                </NavLink>

                                                <div>
                                                    <div
                                                        onClick={toggleLaporan}
                                                        className={`inline-flex items-center px-2 py-2 my-0.5 rounded-md w-full transition duration-150 ease-in-out focus:outline-none border-transparent hover:bg-white hover:bg-opacity-10 ${
                                                            !isLaporanOpen &&
                                                            isAnyLaporanActive
                                                                ? "border-indigo-200 focus:border-indigo-700 bg-white bg-opacity-10"
                                                                : ""
                                                        }`}
                                                    >
                                                        <TbReportAnalytics className="mr-2" />
                                                        <span>Laporan</span>
                                                        {isLaporanOpen ? (
                                                            <RiArrowDropUpLine className="text-lg 2xl:text-2xl ml-auto" />
                                                        ) : (
                                                            <RiArrowDropDownLine className="text-lg 2xl:text-2xl ml-auto" />
                                                        )}
                                                    </div>
                                                    {isLaporanOpen && (
                                                        <div className="">
                                                            <DropDownLink
                                                                href={route(
                                                                    "kasPendapatan.index"
                                                                )}
                                                                active={route().current(
                                                                    "kasPendapatan.index"
                                                                )}
                                                            >
                                                                <span className="px-5 2xl:px-6 text-slate-300">
                                                                    Pendapatan
                                                                    Kas
                                                                </span>
                                                            </DropDownLink>
                                                            <DropDownLink
                                                                href={route(
                                                                    "kasPengeluaran.index"
                                                                )}
                                                                active={route().current(
                                                                    "kasPengeluaran.index"
                                                                )}
                                                            >
                                                                <span className="px-5 2xl:px-6 text-slate-300">
                                                                    Pengeluaran
                                                                    Kas
                                                                </span>
                                                            </DropDownLink>
                                                            <DropDownLink
                                                                href={route(
                                                                    "kasBukuBesar.index"
                                                                )}
                                                                active={route().current(
                                                                    "kasBukuBesar.index"
                                                                )}
                                                            >
                                                                <span className="px-5 2xl:px-6 text-slate-300">
                                                                    Buku Besar
                                                                </span>
                                                            </DropDownLink>
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        ) : (
                                            <></>
                                        )}
                                    </nav>
                                </div>
                            </div>
                            <div className="text-slate-100">
                                <NavLink                                >
                                    <MdAccountCircle className="text-sm 2xl:text-xl mr-2" />
                                    {user.name}
                                </NavLink>

                                <div className="flex items-center py-2 px-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex text-gray-400 hover:text-gray-500"
                                    >
                                        <IoExitOutline className="text-sm 2xl:text-xl mr-2" />
                                        Logout
                                    </button>
                                </div>  
                            </div>
                        </div>
                        <div className="w-full m-8">
                            {header && (
                                <header className="ml-[18%]">{header}</header>
                            )}
                            <main className="ml-[18%]">{children}</main>
                        </div>
                    </>
                ) : (
                    <div className="w-full m-8">
                        <main className="">{children}</main>
                    </div>
                )}
            </div>
        </div>
    );
}
