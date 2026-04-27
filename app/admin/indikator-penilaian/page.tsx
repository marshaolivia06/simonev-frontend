"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, X, ClipboardList } from "lucide-react";

interface Indikator {
  id: number;
  indikator: string;
  kegiatan: string;
  aspek: string;
}

const aspekOptions = [
  "Nilai Agama dan Moral",
  "Motorik",
  "Kognitif",
  "Bahasa",
  "Sosial-Emosional",
  "Kreativitas/Seni",
];

const dummyData: Indikator[] = [
  { id: 1, indikator: "Anak dapat memegang pensil dengan benar", kegiatan: "Menulis dan Menggambar", aspek: "Motorik" },
  { id: 2, indikator: "Anak dapat menyebutkan warna dasar", kegiatan: "Mengenal Warna", aspek: "Kognitif" },
  { id: 3, indikator: "Anak dapat mengucapkan kalimat sederhana", kegiatan: "Bercerita", aspek: "Bahasa" },
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
    <div className="w-full font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white rounded-lg p-2">
            <ClipboardList size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">Indikator Penilaian</h1>
            <p className="text-xs text-gray-400">{data.length} indikator terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari indikator..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all"
            />
          </div>
          <button
            onClick={handleTambah}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Plus size={15} />
            Tambah Indikator
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[52px] border-r border-gray-200">No</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Indikator</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider border-r border-gray-200">Kegiatan</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-[180px] border-r border-gray-200">Aspek</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider w-[140px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-400 text-sm">Belum ada data indikator penilaian</td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3.5 text-center text-xs text-gray-400 font-medium border-r border-gray-100">{index + 1}</td>
                  <td className="px-5 py-3.5 border-r border-gray-100">
                    <span className="font-medium text-gray-800 text-sm">{item.indikator}</span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm border-r border-gray-100">{item.kegiatan}</td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm border-r border-gray-100">{item.aspek}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-md transition-all"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleHapus(item.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-md transition-all"
                      >
                        <Trash2 size={11} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50">
            <span className="text-xs text-gray-400">
              Menampilkan <span className="font-medium text-gray-600">{filtered.length}</span> dari <span className="font-medium text-gray-600">{data.length}</span> data
            </span>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {editData ? "Edit Indikator Penilaian" : "Tambah Indikator Penilaian"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editData ? "Perbarui data indikator" : "Isi data indikator baru"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={15} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Indikator</label>
                <input
                  type="text"
                  value={form.indikator}
                  onChange={(e) => setForm({ ...form, indikator: e.target.value })}
                  placeholder="Masukkan indikator penilaian"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kegiatan</label>
                <input
                  type="text"
                  value={form.kegiatan}
                  onChange={(e) => setForm({ ...form, kegiatan: e.target.value })}
                  placeholder="Masukkan nama kegiatan"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Aspek</label>
                <select
                  value={form.aspek}
                  onChange={(e) => setForm({ ...form, aspek: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="">Pilih Aspek</option>
                  {aspekOptions.map((a) => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm shadow-green-200 transition-colors"
              >
                {editData ? "Simpan Perubahan" : "Tambah Data"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}