import React, { useState, useEffect, useRef, forwardRef } from "react";
import Cetak from "./Cetak";
import { useReactToPrint } from "react-to-print";
import { IoPrintSharp, IoCloseCircleOutline } from "react-icons/io5";

const MyModalCetak = ({
    show,
    handleCloseCetak,
    kendaraans,
    kode,
    children,
}) => {
    if (!show) return null;

    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-1/3 max-h-screen my-8 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Cetak Data Sewa Kendaraan</h2>
                    <button
                        className="text-gray-500 text-xs font-extrabold hover:text-red-500 2xl:text-sm px-3 py-2 rounded mr-2"
                        onClick={handleCloseCetak}
                    >
                        X
                    </button>
                </div>

                <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    {children}
                </div>

                <div className="flex justify-center items-center h-full py-4">
                    <button
                        onClick={handlePrint}
                        className="flex bg-slate-500 hover:bg-slate-700 text-xs 2xl:sm text-white font-medium py-1.5 px-2 2xl:py-2 2xl:px-4 rounded"
                    >
                        <IoPrintSharp className="text-sm 2xl:text-md mr-1" />
                        Cetak
                    </button>
                </div>

                <div className="hidden">
                    <Cetak
                        ref={componentRef}
                        kode={kode}
                        kendaraans={kendaraans}
                    />
                </div>
            </div>
        </div>
    );
};

export default MyModalCetak;
