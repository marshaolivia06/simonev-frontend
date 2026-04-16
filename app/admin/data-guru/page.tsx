"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Guru {
  id: number;
  nama: string;
  noTelp: string;
}

// ✅ DIUBAH: jadi kosong
const dummyData: Guru[] = [];

export default function DataGuruPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Guru[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Guru | null>(null);
  const [form, setForm] = useState({ nama: "", noTelp: "" });

  const filtered = data.filter(
    (g) =>
      g.nama.toLowerCase().includes(search.toLowerCase()) ||
      g.noTelp.includes(search)
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ nama: "", noTelp: "" });
    setShowModal(true);
  };

  const handleEdit = (guru: Guru) => {
    setEditData(guru);
    setForm({ nama: guru.nama, noTelp: guru.noTelp });
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
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
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Nama Guru</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">No Telp</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 w-32 border border-black">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((guru, index) => (
              <tr key={guru.id}>
                <td className="px-4 py-2 text-center text-gray-700 border border-black">{index + 1}.</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{guru.nama}</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{guru.noTelp}</td>
                <td className="px-4 py-2 text-center border border-black">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleEdit(guru)}
                      className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleHapus(guru.id)}
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
              {editData ? "Edit Data Guru" : "Tambah Data Guru"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Nama Guru</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) => setForm({ ...form, nama: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Masukkan nama guru"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">No Telp</label>
                <input
                  type="text"
                  value={form.noTelp}
                  onChange={(e) => setForm({ ...form, noTelp: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Masukkan no telp"
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