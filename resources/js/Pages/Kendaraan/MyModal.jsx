import React from "react";

const MyModal = ({ show, handleClose, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg w-1/3 max-h-screen my-8 overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold">Tambah Data Kendaraan</h2>
                    <button
                        className="text-gray-500 text-xs font-extrabold hover:text-red-500 2xl:text-sm px-3 py-2 rounded mr-2"
                        onClick={handleClose}
                    >
                        X
                    </button>
                </div>
                <div className="p-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default MyModal;
