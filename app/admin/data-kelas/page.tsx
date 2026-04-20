"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Kelas {
  id: number;
  namaKelas: string;
  waliKelas: string;
  tahunAjaran: string;
}

// ✅ Dummy Data (3)
const dummyData: Kelas[] = [
  { id: 1, namaKelas: "TK A", waliKelas: "Bu Siti", tahunAjaran: "2024/2025" },
  { id: 2, namaKelas: "TK B", waliKelas: "Pak Budi", tahunAjaran: "2024/2025" },
  { id: 3, namaKelas: "Playgroup", waliKelas: "Bu Rina", tahunAjaran: "2024/2025" },
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
    setForm(kelas);
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      setData(data.filter((k) => k.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.namaKelas.trim() || !form.waliKelas.trim() || !form.tahunAjaran.trim()) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editData) {
      setData(data.map((k) => (k.id === editData.id ? { ...k, ...form } : k)));
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((k) => k.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }

    setShowModal(false);
  };

  return (
    <div className="w-full">

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleTambah}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
        >
          <Plus size={15} />
          Tambah
        </button>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari kelas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none w-48"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-[48px]">No</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Nama Kelas</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Wali Kelas</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Tahun Ajaran</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-[140px]">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  Belum ada data kelas
                </td>
              </tr>
            ) : (
              filtered.map((kelas, index) => (
                <tr key={kelas.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  <td className="px-4 py-3 text-center font-medium text-gray-800">
                    {kelas.namaKelas}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700">
                    {kelas.waliKelas}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700">
                    {kelas.tahunAjaran}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(kelas)}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>

                      <button
                        onClick={() => handleHapus(kelas.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-md transition-colors"
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editData ? "Edit Data Kelas" : "Tambah Data Kelas"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Nama Kelas</label>
                <input
                  type="text"
                  value={form.namaKelas}
                  onChange={(e) =>
                    setForm({ ...form, namaKelas: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Wali Kelas</label>
                <input
                  type="text"
                  value={form.waliKelas}
                  onChange={(e) =>
                    setForm({ ...form, waliKelas: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">Tahun Ajaran</label>
                <input
                  type="text"
                  value={form.tahunAjaran}
                  onChange={(e) =>
                    setForm({ ...form, tahunAjaran: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                onClick={handleSimpan}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
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