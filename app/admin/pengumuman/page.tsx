"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Eye } from "lucide-react";

interface Pengumuman {
  id: number;
  judul: string;
  tanggal: string;
}

const dummyData: Pengumuman[] = [];

export default function PengumumanPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Pengumuman[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Pengumuman | null>(null);
  const [viewData, setViewData] = useState<Pengumuman | null>(null);
  const [form, setForm] = useState({ judul: "", tanggal: "" });

  const filtered = data.filter(
    (p) =>
      p.judul.toLowerCase().includes(search.toLowerCase()) ||
      p.tanggal.includes(search)
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ judul: "", tanggal: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Pengumuman) => {
    setEditData(item);
    setForm({ judul: item.judul, tanggal: item.tanggal });
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setData(data.filter((p) => p.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.judul.trim() || !form.tanggal.trim()) {
      alert("Judul dan Tanggal wajib diisi!");
      return;
    }

    if (editData) {
      setData(data.map((p) => p.id === editData.id ? { ...p, ...form } : p));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((p) => p.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }

    setShowModal(false);
  };

  return (
    <div className="w-full px-6">

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 mt-4">
        <button
          onClick={handleTambah}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full"
        >
          <Plus size={16} />
          tambah
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-gray-200 rounded-full px-4 py-1.5 text-sm focus:outline-none w-40"
        />
      </div>

      {/* Tabel */}
      <div className="border border-black">
        {/* ✅ INI SATU-SATUNYA PERUBAHAN */}
        <table className="w-full table-fixed text-sm border-collapse">
          <thead>
            <tr className="bg-gray-300">
              <th className="border border-black px-3 py-2 w-[60px]">No</th>

              <th className="border border-black px-3 py-2 w-[65%] text-center">
                Judul
              </th>

              <th className="border border-black px-3 py-2 w-[15%]">
                Tanggal
              </th>

              <th className="border border-black px-3 py-2 w-[10%]">
                Detail
              </th>

              <th className="border border-black px-3 py-2 w-[10%]">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id}>
                <td className="border border-black text-center">{index + 1}.</td>

                <td className="border border-black px-3 text-center">
                  {item.judul}
                </td>

                <td className="border border-black text-center">
                  {item.tanggal}
                </td>

                <td className="border border-black text-center">
                  <button
                    onClick={() => setViewData(item)}
                    className="bg-gray-300 px-3 py-1 rounded text-xs flex items-center gap-1 mx-auto"
                  >
                    <Eye size={12} /> View
                  </button>
                </td>

                <td className="border border-black">
                  <div className="flex justify-center gap-1">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-green-500 text-white px-2 py-1 text-xs rounded flex items-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>

                    <button
                      onClick={() => handleHapus(item.id)}
                      className="bg-red-500 text-white px-2 py-1 text-xs rounded flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {Array.from({ length: Math.max(0, 10 - filtered.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="border border-black">&nbsp;</td>
                <td className="border border-black">&nbsp;</td>
                <td className="border border-black">&nbsp;</td>
                <td className="border border-black">&nbsp;</td>
                <td className="border border-black">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="font-semibold mb-4">
              {editData ? "Edit Pengumuman" : "Tambah Pengumuman"}
            </h2>

            <input
              type="text"
              placeholder="Judul"
              value={form.judul}
              onChange={(e) => setForm({ ...form, judul: e.target.value })}
              className="w-full border mb-3 px-3 py-2"
            />

            <input
              type="date"
              value={form.tanggal}
              onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
              className="w-full border mb-4 px-3 py-2"
            />

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button
                onClick={handleSimpan}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal View */}
      {viewData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="font-semibold mb-4">Detail Pengumuman</h2>

            <p className="mb-2"><b>Judul:</b> {viewData.judul}</p>
            <p className="mb-4"><b>Tanggal:</b> {viewData.tanggal}</p>

            <div className="flex justify-end">
              <button
                onClick={() => setViewData(null)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}