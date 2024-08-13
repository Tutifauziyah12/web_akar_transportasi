import * as yup from "yup";

export const validationSchema = yup.object().shape({
    kode: yup.string().required("Kode harus diisi"),
    nama: yup.string().required("Nama harus diisi"),
    mulai_tanggal: yup
        .date()
        .required("Mulai tanggal harus diisi")
        .typeError("Mulai tanggal harus berupa tanggal yang valid"),
    akhir_tanggal: yup
        .date()
        .required("Akhir tanggal harus diisi")
        .typeError("Akhir tanggal harus berupa tanggal yang valid"),
    kendaraan_ids: yup
        .array()
        .of(
            yup
                .number()
                .required("ID Kendaraan harus diisi")
                .positive("ID Kendaraan harus berupa angka positif")
                .integer("ID Kendaraan harus berupa angka bulat")
        )
        .min(1, "Minimal satu kendaraan harus dipilih"),
    total: yup
        .number()
        .required("Total harus diisi")
        .min(1, "Total harus lebih besar dari Rp 0"),
    tipe_pembayaran: yup.string().required("Tipe Pembayaran harus diisi"),
    metode: yup.string().required("Metode harus diisi"),
    pendapatanLainnya: yup.array().of(
        yup.object().shape({
            nama: yup.string().required("Nama harus diisi"),
            jumlah: yup
                .number()
                .required("Jumlah harus diisi")
                .positive("Jumlah harus berupa angka positif")
                .integer("Jumlah harus berupa angka bulat"),
            total: yup
                .number()
                .required("Total harus diisi")
                .min(1, "Total harus lebih besar dari Rp 0"),
            metode: yup.string().required("Metode harus diisi"),
        })
    ),
});

export const validationSchemaPengeluaran = yup.object().shape({
    kode: yup.string().required("Kode harus diisi"),
    total: yup
        .number()
        .required("Total harus diisi")
        .min(1, "Total harus lebih besar dari Rp 0"),
    metode: yup.string().required("Metode harus diisi"),
    nama: yup.string().required("Nama harus diisi"),
    tanggal: yup
        .date()
        .required("Tanggal harus diisi")
        .typeError("Tanggal harus berupa tanggal yang valid"),
});

export const validationSchemaUserCreation = yup.object().shape({
    name: yup.string().required("Nama harus diisi"),
    level: yup.string().required("Level harus diisi"),
    email: yup
        .string()
        .email("Email harus berupa email yang valid")
        .required("Email harus diisi"),
    password: yup
        .string()
        .required("Password harus diisi")
        .min(8, "Password harus memiliki panjang minimal 8 karakter"),
    password_confirmation: yup
        .string()
        .required("Konfirmasi password harus diisi")
        .oneOf(
            [yup.ref("password"), null],
            "Konfirmasi password harus cocok dengan password"
        ),
});
