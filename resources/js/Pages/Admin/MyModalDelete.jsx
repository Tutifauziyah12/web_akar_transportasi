import React, { useState, useEffect } from "react";
import axios from "axios"; // Jangan lupa impor axios jika belum diimpor

const MyModalDelete = ({ show, handleCloseDelete, handleDelete, id }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (id && show) {
            axios
                .get(`/admin/${id}`)
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user:", error);
                });
        }
    }, [id, show]);

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-96">
                <div className="flex justify-between items-center border-b pb-3">
                    <h2 className="text-xl font-semibold">Konfirmasi Hapus</h2>
                </div>
                <div className="py-4">
                    <p>
                        Apakah Anda yakin ingin menghapus Akun{" "}
                        <b>{user ? user.name : "..."}</b>?
                    </p>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                    <button
                        onClick={handleCloseDelete}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400"
                    >
                        Batal
                    </button>
                    <button
                        onClick={() => handleDelete(id)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                        Hapus
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MyModalDelete;
