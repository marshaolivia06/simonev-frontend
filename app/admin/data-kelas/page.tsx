"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, X, Users } from "lucide-react";

interface Kelas {
  id: number;
  namaKelas: string;
  waliKelas: string;
  tahunAjaran: string;
}

const dummyData: Kelas[] = [
  { id: 1, namaKelas: "TK A1", waliKelas: "Siti Rahayu, S.Pd", tahunAjaran: "2024/2025" },
  { id: 2, namaKelas: "TK A2", waliKelas: "Dewi Lestari, S.Pd", tahunAjaran: "2024/2025" },
  { id: 3, namaKelas: "TK B1", waliKelas: "Budi Santoso, M.Pd", tahunAjaran: "2024/2025" },
  { id: 4, namaKelas: "TK B2", waliKelas: "Rina Marlina, S.Pd", tahunAjaran: "2024/2025" },
  { id: 5, namaKelas: "Playgroup A", waliKelas: "Ani Wijaya, S.Pd", tahunAjaran: "2024/2025" },
  { id: 6, namaKelas: "TK A3", waliKelas: "Cinta Laura, S.Pd", tahunAjaran: "2025/2026"},
  {id: 7, namaKelas: "TK A4", waliKelas: "Agus Pratama, S.Pd", tahunAjaran: "2025/2026"},
  {id: 8, namaKelas: "Playgroup B", waliKelas: "Fatimah Larasati, S.Pd", tahunAjaran: "2025/2026"},
  
];

export default function DataKelasPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Kelas[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Kelas | null>(null);
  const [form, setForm] = useState({
    namaKelas: "",
    waliKelas: "",
    tahunAjaran: "",
  });

  const filtered = data
    .filter(
      (k) =>
        k.namaKelas.toLowerCase().includes(search.toLowerCase()) ||
        k.waliKelas.toLowerCase().includes(search.toLowerCase()) ||
        k.tahunAjaran.includes(search)
    )
    .sort((a, b) => a.namaKelas.localeCompare(b.namaKelas));

  const handleTambah = () => {
    setEditData(null);
    setForm({ namaKelas: "", waliKelas: "", tahunAjaran: "" });
    setShowModal(true);
  };

  const handleEdit = (kelas: Kelas) => {
    setEditData(kelas);
    setForm(kelas);
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      setData(data.filter((k) => k.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.namaKelas || !form.waliKelas || !form.tahunAjaran) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editData) {
      setData(data.map((k) => (k.id === editData.id ? { ...k, ...form } : k)));
    } else {
      const newId = data.length ? Math.max(...data.map((k) => k.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }

    setShowModal(false);
  };

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  return (
    <div className="w-full font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white rounded-lg p-2">
            <Users size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Data Kelas</h1>
            <p className="text-xs text-gray-400">{data.length} kelas terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas..."
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs w-56 focus:outline-none"
            />
          </div>

          <button
            onClick={handleTambah}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
          >
            <Plus size={15} />
            Tambah
          </button>
        </div>
      </div>

      {/* TABLE (FIXED STYLE LIKE DATA GURU) */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[60px] border-r border-gray-300">No</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Nama Kelas</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Wali Kelas</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Tahun Ajaran</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[140px]">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">
                  Tidak ada data
                </td>
              </tr>
            ) : (
              filtered.map((k, i) => (
                <tr key={k.id} className="hover:bg-gray-50">

                  <td className="text-center px-4 py-3 text-gray-500 border-r border-gray-200">
                    {i + 1}
                  </td>

                  {/* NAMA KELAS */}
                  <td className="px-5 py-3 border-r border-gray-200 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>
                        {getInitials(k.namaKelas)}
                      </div>
                      {k.namaKelas}
                    </div>
                  </td>

                  {/* WALI KELAS (STYLE GURU) */}
                  <td className="px-5 py-3 border-r border-gray-200 text-gray-700 font-medium">
                    {k.waliKelas}
                  </td>

                  <td className="px-5 py-3 border-r border-gray-200 text-gray-600">
                    {k.tahunAjaran}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(k)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                      >
                        <Pencil size={12} /> Edit
                      </button>

                      <button
                        onClick={() => handleHapus(k.id)}
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
      </div>

      {/* MODAL (tidak diubah) */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="font-semibold mb-4">
              {editData ? "Edit Kelas" : "Tambah Kelas"}
            </h2>

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Nama Kelas"
              value={form.namaKelas}
              onChange={(e) => setForm({ ...form, namaKelas: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded mb-2"
              placeholder="Wali Kelas"
              value={form.waliKelas}
              onChange={(e) => setForm({ ...form, waliKelas: e.target.value })}
            />

            <input
              className="w-full border p-2 rounded mb-4"
              placeholder="Tahun Ajaran"
              value={form.tahunAjaran}
              onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })}
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                Batal
              </button>
              <button onClick={handleSimpan} className="px-3 py-1 bg-green-500 text-white rounded">
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}