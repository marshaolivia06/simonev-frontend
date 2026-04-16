"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
  kelas: string;
}

const kelasList = ["TK A", "TK B"];

// ✅ DIUBAH: jadi kosong
const dummyData: Anak[] = [];

export default function DataAnakPage() {
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [data, setData] = useState<Anak[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Anak | null>(null);
  const [form, setForm] = useState({ namaAnak: "", orangTua: "", kelas: "TK A" });

  const filtered = data.filter((a) => {
    const matchSearch =
      a.namaAnak.toLowerCase().includes(search.toLowerCase()) ||
      a.orangTua.toLowerCase().includes(search.toLowerCase());
    const matchKelas = filterKelas ? a.kelas === filterKelas : true;
    return matchSearch && matchKelas;
  });

  const handleTambah = () => {
    setEditData(null);
    setForm({ namaAnak: "", orangTua: "", kelas: "TK A" });
    setShowModal(true);
  };

  const handleEdit = (anak: Anak) => {
    setEditData(anak);
    setForm({ namaAnak: anak.namaAnak, orangTua: anak.orangTua, kelas: anak.kelas });
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setData(data.filter((a) => a.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.namaAnak.trim() || !form.orangTua.trim()) {
      alert("Nama Anak dan Orang Tua wajib diisi!");
      return;
    }
    if (editData) {
      setData(data.map((a) => a.id === editData.id ? { ...a, ...form } : a));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((a) => a.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Kelas ▾</option>
            {kelasList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 w-48"
        />
      </div>

      <div className="mb-4">
        <button
          onClick={handleTambah}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          Tambah
        </button>
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg border border-black overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-center font-bold text-gray-900 w-16 border border-black">No</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Nama Anak</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Orang Tua</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 w-32 border border-black">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((anak, index) => (
              <tr key={anak.id}>
                <td className="px-4 py-2 text-center text-gray-700 border border-black">{index + 1}.</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{anak.namaAnak}</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{anak.orangTua}</td>
                <td className="px-4 py-2 text-center border border-black">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleEdit(anak)}
                      className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleHapus(anak.id)}
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
              {editData ? "Edit Data Anak" : "Tambah Data Anak"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nama Anak</label>
                <input
                  type="text"
                  value={form.namaAnak}
                  onChange={(e) => setForm({ ...form, namaAnak: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Masukkan nama anak"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Orang Tua</label>
                <input
                  type="text"
                  value={form.orangTua}
                  onChange={(e) => setForm({ ...form, orangTua: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Nama orang tua"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Kelas</label>
                <select
                  value={form.kelas}
                  onChange={(e) => setForm({ ...form, kelas: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {kelasList.map((k) => (
                    <option key={k} value={k}>{k}</option>
                  ))}
                </select>
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