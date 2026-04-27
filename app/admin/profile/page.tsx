"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

const INITIAL_DATA = {
  username: "admin.sekolah",
  password: "",
  namaLengkap: "Siti Rahayu, S.Pd.",
  email: "admin@tkpertiwi.sch.id",
  telepon: "+62 812-0001-0002",
  jabatan: "Kepala Sekolah / Admin",
  alamatSekolah: "Jl. Pendidikan No. 1, Batam Kota, Kota Batam, Kepulauan Riau 29461",
};

export default function ProfileAdminPage() {
  const [form, setForm]               = useState(INITIAL_DATA);
  const [showSuccess, setShowSuccess] = useState(false);

  const handle = (field: keyof typeof INITIAL_DATA) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  const inputCls = "w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300";

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Profil Berhasil Diperbarui</h3>
            <p className="text-sm text-gray-500 mb-5">Perubahan data profil telah tersimpan.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* SECTION 1: Akun */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Akun</p>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input type="text" value={form.username} onChange={handle("username")} required className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password baru</label>
              <input
                type="password" value={form.password} onChange={handle("password")}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className={inputCls}
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Data Admin */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Data Admin</p>
              <p className="text-xs text-gray-400 mt-0.5">Informasi pribadi administrator sekolah.</p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Dapat diedit
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input type="text" value={form.namaLengkap} onChange={handle("namaLengkap")} required className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Jabatan</label>
                <select value={form.jabatan} onChange={handle("jabatan")} className={inputCls + " bg-white"}>
                  <option value="Kepala Sekolah / Admin">Kepala Sekolah / Admin</option>
                  <option value="Operator Sekolah">Operator Sekolah</option>
                  <option value="Staf Administrasi">Staf Administrasi</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input type="email" value={form.email} onChange={handle("email")} required className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nomor Telepon</label>
                <input type="text" value={form.telepon} onChange={handle("telepon")} required className={inputCls} />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Alamat Sekolah</label>
              <textarea
                value={form.alamatSekolah} onChange={handle("alamatSekolah")} rows={3} required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: Info Sistem */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Info Sistem</p>
              <p className="text-xs text-gray-400 mt-0.5">Data teknis yang dikelola oleh sistem.</p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              Read only
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-500 w-2/5">Status Akun</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      Aktif
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Hak Akses</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                      Administrator Sistem
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500 align-top">Keterangan</td>
                  <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed">
                    Mengelola akun guru & orang tua, menyetujui atau menolak pendaftaran, serta mengatur seluruh data sistem.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Terdaftar Sejak</td>
                  <td className="px-4 py-3 text-gray-700">1 Juli 2023</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Terakhir Login</td>
                  <td className="px-4 py-3 text-gray-700">27 April 2026, 08.14 WIB</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Tombol Simpan */}
        <div className="flex justify-end">
          <button type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition active:scale-95">
            Simpan Perubahan
          </button>
        </div>

      </form>
    </div>
  );
}