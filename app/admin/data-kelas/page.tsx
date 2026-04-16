"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Kelas {
  id: number;
  namaKelas: string;
  waliKelas: string;
  tahunAjaran: string;
}

// ✅ DIUBAH: kosong (biar gak ada nomor 1 palsu)
const dummyData: Kelas[] = [];

export default function DataKelasPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Kelas[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Kelas | null>(null);
  const [form, setForm] = useState({ namaKelas: "", waliKelas: "", tahunAjaran: "" });

  const filtered = data.filter(
    (k) =>
      k.namaKelas.toLowerCase().includes(search.toLowerCase()) ||
      k.waliKelas.toLowerCase().includes(search.toLowerCase()) ||
      k.tahunAjaran.includes(search)
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ namaKelas: "", waliKelas: "", tahunAjaran: "" });
    setShowModal(true);
  };

  const handleEdit = (kelas: Kelas) => {
    setEditData(kelas);
    setForm({ namaKelas: kelas.namaKelas, waliKelas: kelas.waliKelas, tahunAjaran: kelas.tahunAjaran });
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setData(data.filter((k) => k.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.namaKelas.trim() || !form.waliKelas.trim() || !form.tahunAjaran.trim()) {
      alert("Semua field wajib diisi!");
      return;
    }
    if (editData) {
      setData(data.map((k) => k.id === editData.id ? { ...k, ...form } : k));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((k) => k.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleTambah}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Tambah
        </button>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-48"
        />
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg border border-black overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200"> 
              <th className="px-4 py-2 text-center font-bold text-gray-900 w-16 border border-black">No</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Nama Kelas</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Wali Kelas</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Tahun Ajaran</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 w-32 border border-black">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((kelas, index) => (
              // ✅ BONUS: biar gak ada efek putih aneh
              <tr key={kelas.id} className="bg-white hover:bg-gray-50">
                <td className="px-4 py-2 text-center text-gray-700 border border-black">{index + 1}.</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{kelas.namaKelas}</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{kelas.waliKelas}</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{kelas.tahunAjaran}</td>
                <td className="px-4 py-2 text-center border border-black">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleEdit(kelas)}
                      className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleHapus(kelas.id)}
                      className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded transition-colors"
                    >
                      <Trash2 size={11} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 15 - filtered.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="px-4 py-2 border border-black">&nbsp;</td>
                <td className="px-4 py-2 border border-black">&nbsp;</td>
                <td className="px-4 py-2 border border-black">&nbsp;</td>
                <td className="px-4 py-2 border border-black">&nbsp;</td>
                <td className="px-4 py-2 border border-black">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-base font-semibold text-gray-800 mb-4">
              {editData ? "Edit Data Kelas" : "Tambah Data Kelas"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nama Kelas</label>
                <input
                  type="text"
                  value={form.namaKelas}
                  onChange={(e) => setForm({ ...form, namaKelas: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Contoh: TK A"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Wali Kelas</label>
                <input
                  type="text"
                  value={form.waliKelas}
                  onChange={(e) => setForm({ ...form, waliKelas: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Nama wali kelas"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Tahun Ajaran</label>
                <input
                  type="text"
                  value={form.tahunAjaran}
                  onChange={(e) => setForm({ ...form, tahunAjaran: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Contoh: 2024/2025"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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