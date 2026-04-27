"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Users } from "lucide-react";

interface Guru {
  id: number;
  nama: string;
  jenisKelamin: string;
  tanggalLahir: string;
  noTelp: string;
  email: string;
  alamat: string;
}

const dummyData: Guru[] = [
  { id: 1, nama: "Siti Rahayu, S.Pd", jenisKelamin: "Perempuan", tanggalLahir: "1990-05-12", noTelp: "081234567890", email: "siti.rahayu@smpn1batam.sch.id", alamat: "Jl. Hang Lekir No. 12, Batam Centre" },
  { id: 2, nama: "Budi Santoso, M.Pd", jenisKelamin: "Laki-laki", tanggalLahir: "1988-09-21", noTelp: "082345678901", email: "budi.santoso@smpn1batam.sch.id", alamat: "Jl. Imam Bonjol No. 45, Nagoya" },
  { id: 3, nama: "Rina Marlina, S.Pd", jenisKelamin: "Perempuan", tanggalLahir: "1992-03-10", noTelp: "083456789012", email: "rina.marlina@smpn1batam.sch.id", alamat: "Jl. Raja Ali Haji No. 8, Tiban" },
  { id: 4, nama: "Agus Wijaya, S.Pd", jenisKelamin: "Laki-laki", tanggalLahir: "1987-11-02", noTelp: "084567890123", email: "agus.wijaya@smpn1batam.sch.id", alamat: "Jl. Teuku Umar No. 23, Batu Aji" },
  { id: 5, nama: "Dewi Kusuma, M.Pd", jenisKelamin: "Perempuan", tanggalLahir: "1991-07-18", noTelp: "085678901234", email: "dewi.kusuma@smpn1batam.sch.id", alamat: "Jl. Diponegoro No. 17, Sagulung" },
  { id: 6, nama: "Hendra Gunawan, S.Pd", jenisKelamin: "Laki-laki", tanggalLahir: "1989-01-25", noTelp: "086789012345", email: "hendra.gunawan@smpn1batam.sch.id", alamat: "Jl. Sudirman No. 5, Batam Centre" },
  { id: 7, nama: "Yuliana Putri, S.Pd", jenisKelamin: "Perempuan", tanggalLahir: "1993-06-30", noTelp: "087890123456", email: "yuliana.putri@smpn1batam.sch.id", alamat: "Jl. Ahmad Yani No. 31, Sekupang" },
  { id: 8, nama: "Rudi Hermawan, M.Pd", jenisKelamin: "Laki-laki", tanggalLahir: "1986-04-14", noTelp: "088901234567", email: "rudi.hermawan@smpn1batam.sch.id", alamat: "Jl. Kartini No. 9, Nongsa" },
  { id: 9, nama: "Fitri Handayani, S.Pd", jenisKelamin: "Perempuan", tanggalLahir: "1994-02-08", noTelp: "089012345678", email: "fitri.handayani@smpn1batam.sch.id", alamat: "Jl. Patimura No. 14, Lubuk Baja" },
  { id: 10, nama: "Eko Prasetyo, M.Pd", jenisKelamin: "Laki-laki", tanggalLahir: "1985-12-19", noTelp: "081123456789", email: "eko.prasetyo@smpn1batam.sch.id", alamat: "Jl. Hang Tuah No. 7, Batam Kota" },
];

export default function DataGuruPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Guru[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Guru | null>(null);
  const [form, setForm] = useState({
    nama: "",
    jenisKelamin: "",
    tanggalLahir: "",
    noTelp: "",
    email: "",
    alamat: ""
  });

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
    setForm({ nama: "", jenisKelamin: "", tanggalLahir: "", noTelp: "", email: "", alamat: "" });
    setShowModal(true);
  };

  const handleEdit = (guru: Guru) => {
    setEditData(guru);
    setForm({
      nama: guru.nama,
      jenisKelamin: guru.jenisKelamin,
      tanggalLahir: guru.tanggalLahir,
      noTelp: guru.noTelp,
      email: guru.email,
      alamat: guru.alamat
    });
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
<div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
  <table className="w-full text-sm border-collapse table-auto">
    <thead>
      <tr className="bg-gray-200 border-b border-gray-200">
        <th className="px-3 py-3 text-center text-xs font-semibold text-black-500 uppercase tracking-wider border-r border-gray-200">No</th>
        <th className="px-3 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider border-r border-gray-200">Nama Guru</th>
        <th className="px-3 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider border-r border-gray-200">Jenis Kelamin</th>
        <th className="px-3 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider border-r border-gray-200">Tanggal Lahir</th>
        <th className="px-3 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider border-r border-gray-200">No Telp</th>
        <th className="px-3 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider border-r border-gray-200">Email</th>
        <th className="px-3 py-3 text-left text-xs font-semibold text-black-500 uppercase tracking-wider border-r border-gray-200">Alamat</th>
        <th className="px-3 py-3 text-center text-xs font-semibold text-black-500 uppercase tracking-wider">Aksi</th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filtered.map((guru, index) => (
        <tr key={guru.id} className="hover:bg-blue-50/40 transition-colors group">
          <td className="px-3 py-3 text-center text-xs text-gray-400 font-medium border-r border-gray-100">
            {index + 1}
          </td>

          <td className="px-3 py-3 border-r border-gray-100">
            <div className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                {getInitials(guru.nama)}
              </div>
              <span className="font-medium text-gray-800 text-xs leading-snug whitespace-nowrap">{guru.nama}</span>
            </div>
          </td>

          <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 whitespace-nowrap">
            {guru.jenisKelamin}
          </td>

          <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 whitespace-nowrap">
            {guru.tanggalLahir}
          </td>

          <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 tabular-nums whitespace-nowrap">
            {guru.noTelp}
          </td>

          <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100">
            <span className="truncate block max-w-[180px]">{guru.email}</span>
          </td>

          <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100">
            <span className="truncate block max-w-[160px]">{guru.alamat}</span>
          </td>

          <td className="px-3 py-3">
            <div className="flex justify-center gap-1.5 whitespace-nowrap">
              <button
                onClick={() => handleEdit(guru)}
                className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
              >
                <Pencil size={11} /> Edit
              </button>
              <button
                onClick={() => handleHapus(guru.id)}
                className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1"
              >
                <Trash2 size={11} /> Hapus
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">
                {editData ? "Edit Data Guru" : "Tambah Guru Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nama Guru *</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="Nama lengkap guru"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Jenis Kelamin</label>
                <select
                  value={form.jenisKelamin}
                  onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="">-- Pilih --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Tanggal Lahir</label>
                <input
                  type="date"
                  value={form.tanggalLahir}
                  onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">No Telp *</label>
                <input
                  type="text"
                  value={form.noTelp}
                  onChange={(e) => setForm({ ...form, noTelp: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="email@sekolah.sch.id"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Alamat</label>
                <textarea
                  value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                  rows={2}
                  placeholder="Alamat lengkap"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}