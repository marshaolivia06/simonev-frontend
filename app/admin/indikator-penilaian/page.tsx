"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Indikator {
  id: number;
  indikator: string;
  kegiatan: string;
  aspek: string;
}

const dummyData: Indikator[] = [
  {
    id: 1,
    indikator: "Anak dapat memegang pensil dengan benar",
    kegiatan: "Menulis dan Menggambar",
    aspek: "Motorik",
  },
  {
    id: 2,
    indikator: "Anak dapat menyebutkan warna dasar",
    kegiatan: "Mengenal Warna",
    aspek: "Kognitif",
  },
  {
    id: 3,
    indikator: "Anak dapat mengucapkan kalimat sederhana",
    kegiatan: "Bercerita",
    aspek: "Bahasa",
  },
];

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
            placeholder="Cari indikator..."
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
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Indikator</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-800">Kegiatan</th>
              <th className="px-4 py-3 text-left text-sm font-bold text-gray-800 w-[140px]">Aspek</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-[140px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  Belum ada data indikator penilaian
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-black-400">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{item.indikator}</td>
                  <td className="px-4 py-3 text-gray-600">{item.kegiatan}</td>
                  <td className="px-4 py-3 text-gray-600">{item.aspek}</td>
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editData ? "Edit Indikator Penilaian" : "Tambah Indikator Penilaian"}
            </h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Indikator</label>
                <input
                  type="text"
                  value={form.indikator}
                  onChange={(e) => setForm({ ...form, indikator: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Masukkan indikator"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Kegiatan</label>
                <input
                  type="text"
                  value={form.kegiatan}
                  onChange={(e) => setForm({ ...form, kegiatan: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Masukkan kegiatan"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Aspek</label>
                <input
                  type="text"
                  value={form.aspek}
                  onChange={(e) => setForm({ ...form, aspek: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                  placeholder="Masukkan aspek"
                />
              </div>
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