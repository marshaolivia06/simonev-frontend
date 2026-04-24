"use client";

import { useState } from "react";
import { User, CheckCircle, Lock } from "lucide-react";

const dataGuru = {
  nama: "Siti Rahayu",
  email: "siti.rahayu@sekolah.com",
  username: "siti.rahayu",
  password: "",
  nik: "3171234567890001",
  alamat: "Jl. Melati No. 12, Jakarta Selatan",
  telepon: "081234567890",
  kelas: ["Kelas A", "Kelas B"],
  role: "Guru",
};

export default function ProfilePage() {
  const [nama, setNama] = useState(dataGuru.nama);
  const [email, setEmail] = useState(dataGuru.email);
  const [username, setUsername] = useState(dataGuru.username);
  const [password, setPassword] = useState(dataGuru.password);
  const [nik, setNik] = useState(dataGuru.nik);
  const [alamat, setAlamat] = useState(dataGuru.alamat);
  const [telepon, setTelepon] = useState(dataGuru.telepon);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* SUCCESS POPUP */}
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
              Perubahan data profil kamu telah tersimpan.
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

      <div className="bg-white border border-gray-200 rounded-xl p-6">

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800 leading-tight">Profil Saya</p>
            <p className="text-sm text-gray-500">Kelola informasi akun kamu</p>
          </div>
        </div>

        {/* Info Kelas — read only */}
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-600 font-medium">Mengajar Kelas</span>
          <div className="flex gap-2">
            {dataGuru.kelas.map((k) => (
              <span key={k} className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">
                {k}
              </span>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} noValidate={false}>

          {/* Informasi Pribadi */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Informasi Pribadi
          </p>
          <div className="space-y-4 mb-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">NIK</label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  required
                  maxLength={16}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nomor Telepon</label>
                <input
                  type="text"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Alamat</label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                required
                rows={2}
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>

          </div>

          {/* Informasi Akun */}
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
            Informasi Akun
          </p>
          <div className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">
                  Password{" "}
                  <span className="text-gray-400 font-normal">(kosongkan jika tidak ingin ubah)</span>
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            {/* Role — read only */}
            <div>
              <label className="text-sm text-gray-600">
                Role <span className="text-gray-400 font-normal">(tidak dapat diubah)</span>
              </label>
              <div className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-400 flex items-center justify-between cursor-not-allowed">
                <span>{dataGuru.role}</span>
                <Lock size={13} className="text-gray-300" />
              </div>
            </div>

          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition active:scale-95"
            >
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}