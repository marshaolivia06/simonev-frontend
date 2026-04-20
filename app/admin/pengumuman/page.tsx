"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Eye, Search } from "lucide-react";

interface Pengumuman {
  id: number;
  judul: string;
  kategori: "Kegiatan" | "Libur" | "Penting";
  tanggal: string;
  isi: string;
}

const dummyData: Pengumuman[] = [
  {
    id: 1,
    judul: "Pentas Seni Akhir Tahun 2024/2025",
    kategori: "Kegiatan",
    tanggal: "2025-04-18",
    isi: "Pentas seni akan dilaksanakan pada Sabtu, 24 Mei 2025 pukul 08.00–12.00 WIB. Orang tua/wali murid diundang untuk hadir. Info kostum menyusul.",
  },
  {
    id: 2,
    judul: "Libur Hari Raya Waisak",
    kategori: "Libur",
    tanggal: "2025-04-10",
    isi: "Sekolah diliburkan pada Kamis, 12 Mei 2025 dalam rangka Hari Raya Waisak. Kegiatan belajar kembali normal pada Jumat, 13 Mei 2025.",
  },
  {
    id: 3,
    judul: "Pengumpulan Foto Buku Tahunan",
    kategori: "Penting",
    tanggal: "2025-04-05",
    isi: "Mohon orang tua mengumpulkan 3 foto terbaik anak (format JPG, min. 1MB) kepada wali kelas masing-masing paling lambat 30 April 2025.",
  },
];

const badgeStyle: Record<Pengumuman["kategori"], string> = {
  Kegiatan: "bg-blue-100 text-blue-800",
  Libur: "bg-green-100 text-green-800",
  Penting: "bg-yellow-100 text-yellow-800",
};

const formatTanggal = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

export default function PengumumanPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Pengumuman[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Pengumuman | null>(null);
  const [viewData, setViewData] = useState<Pengumuman | null>(null);
  const [form, setForm] = useState<Omit<Pengumuman, "id">>({
    judul: "",
    kategori: "Kegiatan",
    tanggal: "",
    isi: "",
  });

  const filtered = data.filter(
    (p) =>
      p.judul.toLowerCase().includes(search.toLowerCase()) ||
      p.kategori.toLowerCase().includes(search.toLowerCase()) ||
      p.tanggal.includes(search)
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ judul: "", kategori: "Kegiatan", tanggal: "", isi: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Pengumuman) => {
    setEditData(item);
    setForm({ judul: item.judul, kategori: item.kategori, tanggal: item.tanggal, isi: item.isi });
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
      setData(data.map((p) => (p.id === editData.id ? { ...p, ...form } : p)));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((p) => p.id)) + 1 : 1;
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
            placeholder="Cari pengumuman..."
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
    <th className="px-4 py-3 text-center text-sm font-bold text-black w-[48px]">No</th>
    <th className="px-4 py-3 text-left text-sm font-bold text-black">Judul</th>
    <th className="px-4 py-3 text-left text-sm font-bold text-black w-[110px]">Kategori</th>
    <th className="px-4 py-3 text-left text-sm font-bold text-black w-[120px]">Tanggal</th>
    <th className="px-4 py-3 text-center text-sm font-bold text-black w-[80px]">Detail</th>
    <th className="px-4 py-3 text-center text-sm font-bold text-black w-[140px]">Aksi</th>
  </tr>
</thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-gray-400 text-sm">
                  Belum ada pengumuman
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-black">{index + 1}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{item.judul}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeStyle[item.kategori]}`}>
                      {item.kategori}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{formatTanggal(item.tanggal)}</td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={() => setViewData(item)}
                      className="inline-flex items-center gap-1 bg-gray-100 hover:bg-gray-200 border border-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-md transition-colors"
                    >
                      <Eye size={12} /> View
                    </button>
                  </td>
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
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl">
            <h2 className="text-base font-semibold text-gray-800 mb-5">
              {editData ? "Edit Pengumuman" : "Tambah Pengumuman"}
            </h2>

            <div className="flex flex-col gap-3">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Judul</label>
                <input
                  type="text"
                  placeholder="Masukkan judul pengumuman"
                  value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Kategori</label>
                <select
                  value={form.kategori}
                  onChange={(e) => setForm({ ...form, kategori: e.target.value as Pengumuman["kategori"] })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 bg-white"
                >
                  <option value="Kegiatan">Kegiatan</option>
                  <option value="Libur">Libur</option>
                  <option value="Penting">Penting</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Tanggal Posting</label>
                <input
                  type="date"
                  value={form.tanggal}
                  onChange={(e) => setForm({ ...form, tanggal: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Isi Pengumuman</label>
                <textarea
                  placeholder="Tulis isi pengumuman..."
                  value={form.isi}
                  onChange={(e) => setForm({ ...form, isi: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 resize-none"
                  rows={4}
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

      {/* Modal View */}
      {viewData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-[420px] shadow-xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">Detail Pengumuman</h2>
              <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${badgeStyle[viewData.kategori]}`}>
                {viewData.kategori}
              </span>
            </div>
            <p className="text-base font-semibold text-gray-800 mb-1">{viewData.judul}</p>
            <p className="text-xs text-gray-400 mb-4">Diposting: {formatTanggal(viewData.tanggal)}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{viewData.isi}</p>
            <div className="flex justify-end mt-5">
              <button
                onClick={() => setViewData(null)}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
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