"use client";

import { useState } from "react";
import { Calendar, Megaphone, Pencil, Trash2, Plus, X, Eye, Tag } from "lucide-react";

type Kategori = "Kegiatan" | "Libur" | "Penting" | "Info";

interface Pengumuman {
  id: number;
  judul: string;
  kategori: Kategori;
  tanggal: string;
  posting: string;
  isi: string;
}

const dummyData: Pengumuman[] = [
  {
    id: 1,
    judul: "Libur Hari Raya",
    kategori: "Libur",
    tanggal: "16 - 30 Maret 2026",
    posting: "Diposting: 10 Maret 2026",
    isi: "Sekolah akan diliburkan selama dua minggu menjelang Hari Raya Idul Fitri.",
  },
  {
    id: 2,
    judul: "Kegiatan Outing Class",
    kategori: "Kegiatan",
    tanggal: "5 April 2026",
    posting: "Diposting: 28 Maret 2026",
    isi: "Siswa akan mengikuti kegiatan outing class ke taman edukasi sebagai sarana pembelajaran di luar kelas.",
  },
  {
    id: 3,
    judul: "Pembagian Raport",
    kategori: "Penting",
    tanggal: "20 Juni 2026",
    posting: "Diposting: 10 Juni 2026",
    isi: "Pembagian raport semester genap akan dilaksanakan di sekolah bersama wali murid.",
  },
  {
    id: 4,
    judul: "Pendaftaran Siswa Baru",
    kategori: "Info",
    tanggal: "1 - 15 Juli 2026",
    posting: "Diposting: 20 Juni 2026",
    isi: "Pendaftaran siswa baru tahun ajaran 2026/2027 telah dibuka secara online.",
  },
];

const badgeStyle: Record<Kategori, { badge: string; icon: string; glow: string; hover: string }> = {
  Libur:    { badge: "bg-green-100 text-green-700",   icon: "bg-green-100 group-hover:bg-green-600",    glow: "from-white via-green-50 to-green-100 border-green-100",    hover: "group-hover:text-green-700"  },
  Kegiatan: { badge: "bg-blue-100 text-blue-700",     icon: "bg-blue-100 group-hover:bg-blue-600",      glow: "from-white via-blue-50 to-blue-100 border-blue-100",      hover: "group-hover:text-blue-700"   },
  Penting:  { badge: "bg-yellow-100 text-yellow-700", icon: "bg-yellow-100 group-hover:bg-yellow-500",  glow: "from-white via-yellow-50 to-yellow-100 border-yellow-100", hover: "group-hover:text-yellow-600" },
  Info:     { badge: "bg-purple-100 text-purple-700", icon: "bg-purple-100 group-hover:bg-purple-600",  glow: "from-white via-purple-50 to-purple-100 border-purple-100", hover: "group-hover:text-purple-700" },
};

const postingBadge: Record<Kategori, string> = {
  Libur:    "text-green-600 bg-green-50 border-green-100 group-hover:bg-green-600 group-hover:text-white",
  Kegiatan: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
  Penting:  "text-yellow-600 bg-yellow-50 border-yellow-100 group-hover:bg-yellow-500 group-hover:text-white",
  Info:     "text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
};

const KATEGORI_LIST: Kategori[] = ["Kegiatan", "Libur", "Penting", "Info"];

const emptyForm = { judul: "", kategori: "Kegiatan" as Kategori, tanggal: "", posting: "", isi: "" };

export default function PengumumanPage() {
  const [data, setData]           = useState<Pengumuman[]>(dummyData);
  const [filterKat, setFilterKat] = useState<"Semua" | Kategori>("Semua");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData]   = useState<Pengumuman | null>(null);
  const [viewData, setViewData]   = useState<Pengumuman | null>(null);
  const [form, setForm]           = useState(emptyForm);

  const filtered = data.filter((p) => filterKat === "Semua" || p.kategori === filterKat);

  const handleTambah = () => { setEditData(null); setForm(emptyForm); setShowModal(true); };
  const handleEdit   = (item: Pengumuman) => {
    setEditData(item);
    setForm({ judul: item.judul, kategori: item.kategori, tanggal: item.tanggal, posting: item.posting, isi: item.isi });
    setShowModal(true);
  };
  const handleHapus  = (id: number) => {
    if (confirm("Yakin ingin menghapus pengumuman ini?")) setData(data.filter((p) => p.id !== id));
  };
  const handleSimpan = () => {
    if (!form.judul.trim() || !form.tanggal.trim()) { alert("Judul dan Tanggal wajib diisi!"); return; }
    if (editData) {
      setData(data.map((p) => p.id === editData.id ? { ...p, ...form } : p));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((p) => p.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  const inputCls = "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition-all bg-white";

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* HEADER */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengumuman Sekolah</h1>
          <p className="text-sm text-gray-500">Informasi terbaru terkait kegiatan dan agenda sekolah</p>
        </div>
        <button onClick={handleTambah}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm">
          <Plus size={16} /> Tambah Pengumuman
        </button>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap">
        {(["Semua", ...KATEGORI_LIST] as Array<"Semua" | Kategori>).map((k) => (
          <button key={k} onClick={() => setFilterKat(k)}
            className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
              filterKat === k ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
            }`}>
            {k}
          </button>
        ))}
      </div>

      {/* LIST */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-300">
          <Megaphone size={44} className="mb-3" />
          <p className="text-sm">Belum ada pengumuman</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((item) => {
            const s = badgeStyle[item.kategori];
            return (
              <div key={item.id}
                className={`group relative overflow-hidden bg-gradient-to-br ${s.glow} border rounded-2xl p-4 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]`}>

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/10 via-white/5 to-white/10 transition duration-500" />

                <div className="relative z-10">
                  {/* Top row */}
                  <div className="flex justify-between items-start gap-4 mb-2">
                    <div className="flex gap-3">
                      <div className={`w-11 h-11 flex items-center justify-center rounded-xl shrink-0 transition ${s.icon}`}>
                        <Megaphone size={18} className="text-current group-hover:text-white transition" />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${s.badge}`}>{item.kategori}</span>
                        <h3 className={`text-sm font-semibold text-gray-800 mt-1 transition ${s.hover}`}>{item.judul}</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                          <Calendar size={12} /> {item.tanggal}
                        </div>
                      </div>
                    </div>
                    <span className={`text-[11px] px-2 py-1 rounded-full border transition shrink-0 ${postingBadge[item.kategori]}`}>
                      {item.posting}
                    </span>
                  </div>

                  {/* Isi */}
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{item.isi}</p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
                    <button onClick={() => setViewData(item)}
                      className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
                      <Eye size={13} /> Lihat Detail
                    </button>
                    <div className="flex gap-1.5 ml-auto">
                      <button onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleHapus(item.id)}
                        className="inline-flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-3 py-1.5 rounded-lg transition-colors">
                        <Trash2 size={11} /> Hapus
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL TAMBAH / EDIT */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-bold text-gray-900">{editData ? "Edit Pengumuman" : "Tambah Pengumuman"}</h2>
                <p className="text-xs text-gray-400 mt-0.5">{editData ? "Perbarui isi pengumuman" : "Isi detail pengumuman baru"}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Judul Pengumuman</label>
                <input type="text" placeholder="Masukkan judul" value={form.judul}
                  onChange={(e) => setForm({ ...form, judul: e.target.value })} className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    <Tag size={11} className="inline mr-1" />Kategori
                  </label>
                  <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value as Kategori })} className={inputCls}>
                    {KATEGORI_LIST.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    <Calendar size={11} className="inline mr-1" />Tanggal Kegiatan
                  </label>
                  <input type="text" placeholder="cth: 5 April 2026" value={form.tanggal}
                    onChange={(e) => setForm({ ...form, tanggal: e.target.value })} className={inputCls} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Tanggal Posting</label>
                <input type="text" placeholder="cth: Diposting: 28 Maret 2026" value={form.posting}
                  onChange={(e) => setForm({ ...form, posting: e.target.value })} className={inputCls} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Isi Pengumuman</label>
                <textarea placeholder="Tulis isi pengumuman..." value={form.isi}
                  onChange={(e) => setForm({ ...form, isi: e.target.value })}
                  className={inputCls + " resize-none"} rows={4} />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setShowModal(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                Batal
              </button>
              <button onClick={handleSimpan}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
                {editData ? "Simpan Perubahan" : "Tambah"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL VIEW */}
      {viewData && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className={`bg-gradient-to-br ${badgeStyle[viewData.kategori].glow} border rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden`}>
            <div className="flex items-start justify-between px-6 py-4 border-b border-white/60">
              <div>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeStyle[viewData.kategori].badge}`}>{viewData.kategori}</span>
                <h2 className="text-sm font-bold text-gray-900 mt-2">{viewData.judul}</h2>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <Calendar size={11} /> {viewData.tanggal}
                </div>
              </div>
              <button onClick={() => setViewData(null)} className="p-1.5 rounded-lg hover:bg-white/60 text-gray-400 hover:text-gray-600">
                <X size={15} />
              </button>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-700 leading-relaxed">{viewData.isi}</p>
              <p className="text-xs text-gray-400 mt-3">{viewData.posting}</p>
            </div>
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-white/60 bg-white/40">
              <button onClick={() => { setViewData(null); handleEdit(viewData); }}
                className="flex items-center gap-1.5 border border-green-300 text-green-600 hover:bg-green-50 text-sm font-medium px-4 py-2 rounded-xl transition-colors">
                <Pencil size={13} /> Edit
              </button>
              <button onClick={() => setViewData(null)}
                className="bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}