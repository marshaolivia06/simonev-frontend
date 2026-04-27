"use client";

import { useState } from "react";
import { CheckCircle } from "lucide-react";

/* ──────────────────────────────────────────────────────────────
   DATA DUMMY — ganti dengan fetch dari API / database kamu.
   Struktur ini yang nantinya dikirim ke backend saat orang tua
   menekan tombol Simpan, lalu admin bisa melihat perubahan di
   halaman manajemen data anak.
   ────────────────────────────────────────────────────────────── */
const INITIAL_DATA = {
  /* akun */
  username: "budi.santoso",
  password: "",
  /* data orang tua — bisa diedit */
  namaLengkap: "Budi Santoso",
  email: "budi.santoso@gmail.com",
  telepon: "+62 812-3456-7890",
  hubungan: "Ayah",
  alamat: "Jl. Melati No. 12, RT 03/RW 07, Batam Kota, Kota Batam, Kepulauan Riau 29461",
  /* data anak — read only, dikelola admin */
  namaAnak: "Aisyah Putri Lestari",
  kelas: "TK A1",
};

export default function ProfilePage() {
  const [form, setForm]               = useState(INITIAL_DATA);
  const [showSuccess, setShowSuccess] = useState(false);

  const handle = (field: keyof typeof INITIAL_DATA) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    /*
      TODO: kirim `form` ke API kamu, contoh:
      await fetch("/api/ortu/profile", {
        method: "PUT",
        body: JSON.stringify(form),
      });
      Data yang berubah (namaLengkap, email, telepon, hubungan, alamat)
      akan masuk ke tabel data orang tua di sisi admin.
    */
    setShowSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── SUCCESS POPUP ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Profil Berhasil Diperbarui
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Perubahan data profil kamu telah tersimpan dan sudah masuk ke data admin.
            </p>
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

        {/* ── SECTION 1: Akun ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Akun
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                value={form.username}
                onChange={handle("username")}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password baru</label>
              <input
                type="password"
                value={form.password}
                onChange={handle("password")}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 2: Data Orang Tua (editable) ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Data Orang Tua / Wali
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Perubahan akan langsung masuk ke data admin.
              </p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Dapat diedit
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.namaLengkap}
                  onChange={handle("namaLengkap")}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Hubungan dengan Anak</label>
                <select
                  value={form.hubungan}
                  onChange={handle("hubungan")}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="Ayah">Ayah</option>
                  <option value="Ibu">Ibu</option>
                  <option value="Wali">Wali</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={handle("email")}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nomor Telepon</label>
                <input
                  type="text"
                  value={form.telepon}
                  onChange={handle("telepon")}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Alamat</label>
              <textarea
                value={form.alamat}
                onChange={handle("alamat")}
                rows={3}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* ── SECTION 3: Data Anak (read-only) ── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Data Anak
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Dikelola oleh admin sekolah. Hubungi admin untuk mengubah.
              </p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              Read only
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-500 w-2/5">Nama Anak</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{form.namaAnak}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Kelas</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {form.kelas}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ── Tombol Simpan ── */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition active:scale-95"
          >
            Simpan Perubahan
          </button>
        </div>

      </form>
    </div>
  );
}