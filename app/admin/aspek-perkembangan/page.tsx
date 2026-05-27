"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, X, BookOpen } from "lucide-react";

interface Aspek {
  id_aspek: number;
  nama_aspek: string;
  definisi_aspek: string;
}

const aspekOptions = [
  "Nilai Agama dan Moral",
  "Motorik",
  "Kognitif",
  "Bahasa",
  "Sosial-Emosional",
  "Kreativitas/Seni",
];

export default function AspekPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Aspek[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Aspek | null>(null);
  const [form, setForm] = useState({ nama_aspek: "", definisi_aspek: "" });
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const headers = {
    "Accept": "application/json",
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aspek`, { headers });
      const json = await res.json();
      if (json.success) setData(json.data);
    } catch {
      alert("Gagal memuat data aspek.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = data.filter(
    (a) =>
      a.nama_aspek.toLowerCase().includes(search.toLowerCase()) ||
      (a.definisi_aspek ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ nama_aspek: "", definisi_aspek: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Aspek) => {
    setEditData(item);
    setForm({ nama_aspek: item.nama_aspek, definisi_aspek: item.definisi_aspek ?? "" });
    setShowModal(true);
  };

  const handleHapus = async (id: number) => {
    if (!confirm("Yakin ingin hapus data ini?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/aspek/${id}`, {
        method: "DELETE",
        headers,
      });
      const json = await res.json();
      if (json.success) fetchData();
      else alert(json.message || "Gagal menghapus data.");
    } catch {
      alert("Gagal terhubung ke server.");
    }
  };

  const handleSimpan = async () => {
    if (!form.nama_aspek.trim()) {
      alert("Aspek wajib dipilih!");
      return;
    }
    setLoadingSubmit(true);
    try {
      const url = editData
        ? `${process.env.NEXT_PUBLIC_API_URL}/aspek/${editData.id_aspek}`
        : `${process.env.NEXT_PUBLIC_API_URL}/aspek`;

      const res = await fetch(url, {
        method: editData ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          nama_aspek: form.nama_aspek,
          definisi_aspek: form.definisi_aspek,
        }),
      });
      const json = await res.json();
      if (json.success) {
        setShowModal(false);
        fetchData();
      } else {
        alert(json.message || "Gagal menyimpan data.");
      }
    } catch {
      alert("Gagal terhubung ke server.");
    }
    setLoadingSubmit(false);
  };

  return (
    <div className="w-full font-sans">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white rounded-lg p-2">
            <BookOpen size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">
              Aspek Perkembangan
            </h1>
            <p className="text-xs text-gray-400">
              {data.length} aspek terdaftar
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Cari aspek..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all"
            />
          </div>

          <button
            onClick={handleTambah}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm shadow-green-200"
          >
            <Plus size={13} />
            Tambah Aspek
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[40px] border-r border-gray-200">
                No
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[180px] border-r border-gray-200">
                Nama Aspek
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">
                Definisi
              </th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[150px]">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400 text-sm">
                  Memuat data...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-16 text-gray-400 text-sm">
                  Tidak ada data aspek
                </td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr
                  key={item.id_aspek}
                  className="hover:bg-blue-50/40 transition-colors"
                >
                  <td className="px-4 py-3.5 text-center text-xs text-gray-400 font-medium border-r border-gray-100">
                    {index + 1}
                  </td>
                  <td className="px-5 py-3.5 border-r border-gray-100">
                    <span className="font-medium text-gray-800 text-sm block whitespace-normal break-words">
                      {item.nama_aspek}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 text-sm border-r border-gray-100">
                    <span className="block whitespace-normal break-words leading-relaxed">
                      {item.definisi_aspek}
                    </span>
                  </td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center justify-center gap-1.5">
                      <button
                        onClick={() => handleEdit(item)}
                        className="inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-2.5 py-1.5 rounded-md transition-all"
                      >
                        <Pencil size={11} /> Edit
                      </button>
                      <button
                        onClick={() => handleHapus(item.id_aspek)}
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
          <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
            <span className="text-xs text-gray-400">
              Menampilkan{" "}
              <span className="font-medium text-gray-600">{filtered.length}</span>{" "}
              dari{" "}
              <span className="font-medium text-gray-600">{data.length}</span>{" "}
              data
            </span>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {editData ? "Edit Aspek" : "Tambah Aspek"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editData ? "Perbarui aspek" : "Tambah aspek baru"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Nama Aspek
                </label>
                <select
                  value={form.nama_aspek}
                  onChange={(e) => setForm({ ...form, nama_aspek: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">Pilih Aspek</option>
                  {aspekOptions.map((a) => (
                    <option key={a}>{a}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Definisi
                </label>
                <textarea
                  rows={4}
                  value={form.definisi_aspek}
                  onChange={(e) => setForm({ ...form, definisi_aspek: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                disabled={loadingSubmit}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm shadow-green-200 disabled:opacity-60"
              >
                {loadingSubmit ? "Menyimpan..." : editData ? "Simpan Perubahan" : "Tambah Data"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
