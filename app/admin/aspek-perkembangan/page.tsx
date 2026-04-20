"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Aspek {
  id: number;
  nama: string;
}

const dummyData: Aspek[] = [
  { id: 1, nama: "Motorik" },
  { id: 2, nama: "Kognitif" },
  { id: 3, nama: "Bahasa" },
];

export default function AspekPerkembanganPage() {
  const [data, setData] = useState<Aspek[]>(dummyData);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Aspek | null>(null);
  const [form, setForm] = useState({ nama: "" });

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ nama: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Aspek) => {
    setEditData(item);
    setForm({ nama: item.nama });
    setShowModal(true);
  };

  const handleSimpan = () => {
    if (!form.nama.trim()) {
      alert("Nama aspek tidak boleh kosong!");
      return;
    }
    if (editData) {
      setData(data.map((d) => d.id === editData.id ? { ...d, nama: form.nama } : d));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData([...data, { id: newId, nama: form.nama }]);
    }
    setShowModal(false);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      setData(data.filter((item) => item.id !== id));
    }
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
            placeholder="Cari aspek..."
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
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Nama Aspek</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-[140px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={3} className="text-center py-12 text-gray-400 text-sm">
                  Belum ada data aspek perkembangan
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-black-400">{index + 1}</td>
                  <td className="px-4 py-3 text-center font-medium text-gray-800">{item.nama}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md transition-colors"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleHapus(item.id)}
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

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editData ? "Edit Aspek Perkembangan" : "Tambah Aspek Perkembangan"}
            </h2>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Nama Aspek</label>
              <input
                type="text"
                placeholder="Masukkan nama aspek"
                value={form.nama}
                onChange={(e) => setForm({ nama: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
              />
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
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