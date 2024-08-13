import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UpdatePasswordForm from "./Partials/UpdatePasswordForm";
import UpdateProfileInformationForm from "./Partials/UpdateProfileInformationForm";
import { Head, Link } from "@inertiajs/react";

export default function Edit({ auth, mustVerifyEmail, status, user }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <Head title="Profile" />

            <div>
                Kamu admin, berikut tabel data user
                <Link
                    href={route("register")}
                    className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out"
                >
                    Register
                </Link>
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                    <thead className="sm:text-xs md:text-sm text-gray-700 uppercase bg-gray-200">
                        <tr>
                            <th scope="col" className="px-8 py-2">
                                No
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Nama
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Email
                            </th>
                            <th scope="col" className="px-3 py-2">
                                Level
                            </th>
                            <th scope="col" className="py-3 px-1 text-center">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {user.data.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="px-6 py-4 text-center bg-white border-b hover:bg-gray-50"
                                >
                                    User tidak ditemukan
                                </td>
                            </tr>
                        ) : (
                            user.data.map((usr, index) => (
                                <tr
                                    key={usr.id}
                                    className="bg-white border-b hover:bg-gray-50"
                                >
                                    <td className="px-8 py-2">
                                        {user.from + index}
                                    </td>
                                    <td className="px-3 py-2">{usr.name}</td>
                                    <td className="px-3 py-2">{usr.email}</td>
                                    <td className="px-3 py-2">level</td>
                                    <td className="px-3 py-2">test</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </AuthenticatedLayout>
    );
}
