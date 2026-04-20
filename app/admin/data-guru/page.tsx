"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Guru {
  id: number;
  nama: string;
  noTelp: string;
}

const dummyData: Guru[] = [
  { id: 1, nama: "Bu Siti", noTelp: "081234567890" },
  { id: 2, nama: "Pak Budi", noTelp: "082345678901" },
  { id: 3, nama: "Bu Rina", noTelp: "083456789012" },
];

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
      const newId =
        data.length > 0 ? Math.max(...data.map((g) => g.id)) + 1 : 1;
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
            placeholder="Cari guru..."
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
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Nama Guru</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">No Telp</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-[140px]">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-gray-400 text-sm">
                  Belum ada data guru
                </td>
              </tr>
            ) : (
              filtered.map((guru, index) => (
                <tr key={guru.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  <td className="px-4 py-3 text-center font-medium text-gray-800">
                    {guru.nama}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700">
                    {guru.noTelp}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(guru)}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>

                      <button
                        onClick={() => handleHapus(guru.id)}
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
              {editData ? "Edit Data Guru" : "Tambah Data Guru"}
            </h2>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500">Nama Guru</label>
                <input
                  type="text"
                  value={form.nama}
                  onChange={(e) =>
                    setForm({ ...form, nama: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="text-xs text-gray-500">No Telp</label>
                <input
                  type="text"
                  value={form.noTelp}
                  onChange={(e) =>
                    setForm({ ...form, noTelp: e.target.value })
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