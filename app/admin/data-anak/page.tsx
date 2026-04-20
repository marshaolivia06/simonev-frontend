"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
  kelas: string;
}

const kelasList = ["TK A", "TK B"];

// ✅ Dummy Data
const dummyData: Anak[] = [
  { id: 1, namaAnak: "Aisyah", orangTua: "Ibu Sari", kelas: "TK A" },
  { id: 2, namaAnak: "Bima", orangTua: "Pak Andi", kelas: "TK B" },
  { id: 3, namaAnak: "Citra", orangTua: "Ibu Lina", kelas: "TK A" },
];

export default function DataAnakPage() {
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [data, setData] = useState<Anak[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Anak | null>(null);
  const [form, setForm] = useState({
    namaAnak: "",
    orangTua: "",
    kelas: "TK A",
  });

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
    setForm(anak);
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
      setData(data.map((a) => (a.id === editData.id ? { ...a, ...form } : a)));
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((a) => a.id)) + 1 : 1;
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
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full"
        >
          <Plus size={15} />
          Tambah
        </button>

        <div className="flex items-center gap-2">
          {/* Filter kecil */}
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="bg-gray-100 rounded-full px-3 py-2 text-sm focus:outline-none"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari anak..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none w-48"
            />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-[48px]">No</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Nama Anak</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Orang Tua</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800">Kelas</th>
              <th className="px-4 py-3 text-center text-sm font-bold text-gray-800 w-[140px]">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-12 text-gray-400 text-sm">
                  Belum ada data anak
                </td>
              </tr>
            ) : (
              filtered.map((anak, index) => (
                <tr key={anak.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-center">{index + 1}</td>

                  <td className="px-4 py-3 text-center font-medium text-gray-800">
                    {anak.namaAnak}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700">
                    {anak.orangTua}
                  </td>

                  <td className="px-4 py-3 text-center text-gray-700">
                    {anak.kelas}
                  </td>

                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(anak)}
                        className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md"
                      >
                        <Pencil size={12} /> Edit
                      </button>

                      <button
                        onClick={() => handleHapus(anak.id)}
                        className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-md"
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

      {/* Modal tetap sama style */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editData ? "Edit Data Anak" : "Tambah Data Anak"}
            </h2>

            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nama Anak"
                value={form.namaAnak}
                onChange={(e) =>
                  setForm({ ...form, namaAnak: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />

              <input
                type="text"
                placeholder="Orang Tua"
                value={form.orangTua}
                onChange={(e) =>
                  setForm({ ...form, orangTua: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              />

              <select
                value={form.kelas}
                onChange={(e) =>
                  setForm({ ...form, kelas: e.target.value })
                }
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm"
              >
                {kelasList.map((k) => (
                  <option key={k} value={k}>{k}</option>
                ))}
              </select>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-300 text-gray-600 text-sm px-4 py-2 rounded-lg"
              >
                Batal
              </button>

              <button
                onClick={handleSimpan}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-lg"
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