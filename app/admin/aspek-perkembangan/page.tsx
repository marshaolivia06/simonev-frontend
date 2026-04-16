"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface Aspek {
  id: number;
  nama: string;
}

const dummyData: Aspek[] = [];

export default function AspekPerkembanganPage() {
  const [data, setData] = useState<Aspek[]>(dummyData);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nama: "" });

  const filtered = data.filter((item) =>
    item.nama.toLowerCase().includes(search.toLowerCase())
  );

  // TAMBAH
  const handleTambah = () => {
    setForm({ nama: "" });
    setShowModal(true);
  };

  // SIMPAN
  const handleSimpan = () => {
    if (!form.nama.trim()) {
      alert("Nama aspek tidak boleh kosong!");
      return;
    }

    const newId =
      data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;

    setData([...data, { id: newId, nama: form.nama }]);
    setShowModal(false);
  };

  // HAPUS
  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      setData(data.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="max-w-6xl mx-auto">

      {/* TOOLBAR */}
      <div className="flex items-center justify-between mb-3">

        <button
          onClick={handleTambah}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          Tambah
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm w-48"
        />

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-lg border border-black overflow-hidden">
        <table className="w-full text-sm border-collapse">

          <thead>
            <tr className="bg-gray-200">

              <th className="px-4 py-2 text-center border border-black font-bold">
                No
              </th>

              <th className="w-[70%] px-4 py-2 text-center border border-black font-bold">
                Nama Aspek
              </th>

              <th className="w-[30%] px-4 py-2 text-center border border-black font-bold">
                Aksi
              </th>

            </tr>
          </thead>

          <tbody>
            {filtered.map((item, index) => (
              <tr key={item.id}>

                <td className="px-4 py-2 text-center border border-black">
                  {index + 1}.
                </td>

                <td className="px-4 py-2 border border-black">
                  {item.nama}
                </td>

                <td className="px-4 py-2 border border-black">
                  <div className="flex justify-center gap-1.5">

                    <button className="bg-yellow-400 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                      <Pencil size={11} /> Edit
                    </button>

                    <button
                      onClick={() => handleHapus(item.id)}
                      className="bg-red-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1"
                    >
                      <Trash2 size={11} /> Hapus
                    </button>

                  </div>
                </td>

              </tr>
            ))}

            {/* EMPTY ROW */}
            {Array.from({ length: Math.max(0, 15 - filtered.length) }).map(
              (_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="px-4 py-2 border border-black">&nbsp;</td>
                  <td className="px-4 py-2 border border-black">&nbsp;</td>
                  <td className="px-4 py-2 border border-black">&nbsp;</td>
                </tr>
              )
            )}
          </tbody>

        </table>
      </div>

      {/* MODAL TAMBAH */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg w-80">

            <h2 className="font-bold mb-3">Tambah Aspek</h2>

            <input
              type="text"
              placeholder="Nama aspek"
              value={form.nama}
              onChange={(e) => setForm({ nama: e.target.value })}
              className="w-full border px-3 py-2 rounded mb-3"
            />

            <div className="flex justify-end gap-2">

              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Batal
              </button>

              <button
                onClick={handleSimpan}
                className="px-3 py-1 bg-blue-600 text-white rounded"
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