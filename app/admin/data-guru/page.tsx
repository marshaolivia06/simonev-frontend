"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Users } from "lucide-react";

interface Guru {
  id: number;
  nama: string;
  noTelp: string;
  email: string;
  alamat: string;
}

const dummyData: Guru[] = [
  { id: 1, nama: "Siti Rahayu, S.Pd", noTelp: "081234567890", email: "siti.rahayu@smpn1batam.sch.id", alamat: "Jl. Hang Lekir No. 12, Batam Centre" },
  { id: 2, nama: "Budi Santoso, M.Pd", noTelp: "082345678901", email: "budi.santoso@smpn1batam.sch.id", alamat: "Jl. Imam Bonjol No. 45, Nagoya" },
  { id: 3, nama: "Rina Marlina, S.Pd", noTelp: "083456789012", email: "rina.marlina@smpn1batam.sch.id", alamat: "Jl. Raja Ali Haji No. 8, Tiban" },
  { id: 4, nama: "Agus Wijaya, S.Pd", noTelp: "084567890123", email: "agus.wijaya@smpn1batam.sch.id", alamat: "Jl. Teuku Umar No. 23, Batu Aji" },
  { id: 5, nama: "Dewi Kusuma, M.Pd", noTelp: "085678901234", email: "dewi.kusuma@smpn1batam.sch.id", alamat: "Jl. Diponegoro No. 17, Sagulung" },
  { id: 6, nama: "Hendra Gunawan, S.Pd", noTelp: "086789012345", email: "hendra.gunawan@smpn1batam.sch.id", alamat: "Jl. Sudirman No. 5, Batam Centre" },
  { id: 7, nama: "Yuliana Putri, S.Pd", noTelp: "087890123456", email: "yuliana.putri@smpn1batam.sch.id", alamat: "Jl. Ahmad Yani No. 31, Sekupang" },
  { id: 8, nama: "Rudi Hermawan, M.Pd", noTelp: "088901234567", email: "rudi.hermawan@smpn1batam.sch.id", alamat: "Jl. Kartini No. 9, Nongsa" },
  { id: 9, nama: "Fitri Handayani, S.Pd", noTelp: "089012345678", email: "fitri.handayani@smpn1batam.sch.id", alamat: "Jl. Patimura No. 14, Lubuk Baja" },
  { id: 10, nama: "Eko Prasetyo, M.Pd", noTelp: "081123456789", email: "eko.prasetyo@smpn1batam.sch.id", alamat: "Jl. Hang Tuah No. 7, Batam Kota" },
];

export default function DataGuruPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Guru[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Guru | null>(null);
  const [form, setForm] = useState({ nama: "", noTelp: "", email: "", alamat: "" });

  const filtered = data
    .filter(
      (g) =>
        g.nama.toLowerCase().includes(search.toLowerCase()) ||
        g.noTelp.includes(search) ||
        g.email.toLowerCase().includes(search.toLowerCase()) ||
        g.alamat.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.nama.localeCompare(b.nama));

  const handleTambah = () => {
    setEditData(null);
    setForm({ nama: "", noTelp: "", email: "", alamat: "" });
    setShowModal(true);
  };

  const handleEdit = (guru: Guru) => {
    setEditData(guru);
    setForm({ nama: guru.nama, noTelp: guru.noTelp, email: guru.email, alamat: guru.alamat });
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      setData(data.filter((g) => g.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.nama.trim() || !form.noTelp.trim()) {
      alert("Nama Guru dan No Telp wajib diisi!");
      return;
    }
    if (editData) {
      setData(data.map((g) => g.id === editData.id ? { ...g, ...form } : g));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((g) => g.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  const getInitials = (nama: string) =>
    nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  return (
    <div className="w-full font-sans">

      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          {/* 🔥 DIUBAH JADI HIJAU */}
          <div className="bg-green-500 text-white rounded-lg p-2">
            <Users size={18} />
          </div>

          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">Data Guru</h1>
            <p className="text-xs text-gray-400">{data.length} guru terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, email, alamat..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all"
            />
          </div>

          <button
            onClick={handleTambah}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Plus size={15} />
            Tambah Guru
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[52px] border-r border-gray-200">No</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[210px] border-r border-gray-200">Nama Guru</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[148px] border-r border-gray-200">No Telp</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[235px] border-r border-gray-200">Email</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Alamat</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-16 text-gray-400 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <Users size={32} className="text-gray-200" />
                    <span>Tidak ada data guru ditemukan</span>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((guru, index) => (
                <tr key={guru.id} className="hover:bg-blue-50/40 transition-colors group">
                  <td className="px-4 py-3.5 text-center text-xs text-gray-400 font-medium border-r border-gray-100">
                    {index + 1}
                  </td>

                  <td className="px-5 py-3.5 border-r border-gray-100">
                    <div className="flex items-center gap-2.5">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                        {getInitials(guru.nama)}
                      </div>
                      <span className="font-medium text-gray-800 text-sm leading-snug">{guru.nama}</span>
                    </div>
                  </td>

                  <td className="px-5 py-3.5 text-gray-600 text-sm border-r border-gray-100 tabular-nums">
                    {guru.noTelp}
                  </td>

                  <td className="px-5 py-3.5 text-gray-600 text-sm border-r border-gray-100">
                    <span className="truncate block max-w-[220px]">{guru.email}</span>
                  </td>

                  <td className="px-5 py-3.5 text-gray-600 text-sm border-r border-gray-100">
                    {guru.alamat}
                  </td>

                 <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(guru)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                      >
                        <Pencil size={12} /> Edit
                      </button>

                      <button
                        onClick={() => handleHapus(guru.id)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Menampilkan <span className="font-medium text-gray-600">{filtered.length}</span> dari <span className="font-medium text-gray-600">{data.length}</span> data
            </span>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {editData ? "Edit Data Guru" : "Tambah Data Guru"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editData ? "Perbarui informasi guru" : "Isi data guru baru"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {[
                { label: "Nama Guru", key: "nama", type: "text", placeholder: "Contoh: Siti Rahayu, S.Pd" },
                { label: "No Telp", key: "noTelp", type: "text", placeholder: "Contoh: 081234567890" },
                { label: "Email", key: "email", type: "email", placeholder: "Contoh: nama@sekolah.sch.id" },
                { label: "Alamat", key: "alamat", type: "text", placeholder: "Contoh: Jl. Sudirman No. 1" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-gray-600 mb-1.5">{label}</label>
                  <input
                    type={type}
                    placeholder={placeholder}
                    value={form[key as keyof typeof form]}
                    onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                  />
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                {editData ? "Simpan Perubahan" : "Tambah Data"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}