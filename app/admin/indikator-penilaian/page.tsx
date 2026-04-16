"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Indikator {
  id: number;
  indikator: string;
  kegiatan: string;
  aspek: string;
}

const dummyData: Indikator[] = [];

export default function IndikatorPenilaianPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Indikator[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Indikator | null>(null);
  const [form, setForm] = useState({ indikator: "", kegiatan: "", aspek: "" });

  const filtered = data.filter(
    (d) =>
      d.indikator.toLowerCase().includes(search.toLowerCase()) ||
      d.kegiatan.toLowerCase().includes(search.toLowerCase()) ||
      d.aspek.toLowerCase().includes(search.toLowerCase())
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ indikator: "", kegiatan: "", aspek: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Indikator) => {
    setEditData(item);
    setForm({ indikator: item.indikator, kegiatan: item.kegiatan, aspek: item.aspek });
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setData(data.filter((d) => d.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.indikator.trim() || !form.kegiatan.trim() || !form.aspek.trim()) {
      alert("Semua field wajib diisi!");
      return;
    }
    if (editData) {
      setData(data.map((d) => d.id === editData.id ? { ...d, ...form } : d));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-3">
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
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Indikator</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Kegiatan</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 border border-black">Aspek</th>
              <th className="px-4 py-2 text-center font-bold text-gray-900 w-32 border border-black">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id}>
                <td className="px-4 py-2 text-center text-gray-700 border border-black">{index + 1}.</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{item.indikator}</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{item.kegiatan}</td>
                <td className="px-4 py-2 text-gray-700 border border-black">{item.aspek}</td>
                <td className="px-4 py-2 text-center border border-black">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded transition-colors"
                    >
                      <Pencil size={11} /> Edit
                    </button>
                    <button
                      onClick={() => handleHapus(item.id)}
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
              {editData ? "Edit Indikator Penilaian" : "Tambah Indikator Penilaian"}
            </h2>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Indikator</label>
                <input
                  type="text"
                  value={form.indikator}
                  onChange={(e) => setForm({ ...form, indikator: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Masukkan indikator"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Kegiatan</label>
                <input
                  type="text"
                  value={form.kegiatan}
                  onChange={(e) => setForm({ ...form, kegiatan: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Masukkan kegiatan"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 mb-1 block">Aspek</label>
                <input
                  type="text"
                  value={form.aspek}
                  onChange={(e) => setForm({ ...form, aspek: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Masukkan aspek"
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