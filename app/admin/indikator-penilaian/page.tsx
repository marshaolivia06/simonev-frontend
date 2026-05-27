"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, X, ClipboardList } from "lucide-react";

interface Aspek {
  id_aspek: number;
  nama_aspek: string;
}

interface Indikator {
  id_indikator: number;
  nama_indikator: string;
  nama_kegiatan: string;
  id_aspek: number;
  aspek?: Aspek;
}

export default function IndikatorPenilaianPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Indikator[]>([]);
  const [aspekList, setAspekList] = useState<Aspek[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Indikator | null>(null);
  const [form, setForm] = useState({ nama_indikator: "", nama_kegiatan: "", id_aspek: "" });
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
      const [resIndikator, resAspek] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/indikator`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/aspek`, { headers }),
      ]);
      const jsonIndikator = await resIndikator.json();
      const jsonAspek = await resAspek.json();
      if (jsonIndikator.success) setData(jsonIndikator.data);
      if (jsonAspek.success) setAspekList(jsonAspek.data);
    } catch {
      alert("Gagal memuat data.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filtered = data.filter(
    (d) =>
      d.nama_indikator.toLowerCase().includes(search.toLowerCase()) ||
      (d.nama_kegiatan ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (d.aspek?.nama_aspek ?? "").toLowerCase().includes(search.toLowerCase())
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ nama_indikator: "", nama_kegiatan: "", id_aspek: "" });
    setShowModal(true);
  };

  const handleEdit = (item: Indikator) => {
    setEditData(item);
    setForm({
      nama_indikator: item.nama_indikator,
      nama_kegiatan: item.nama_kegiatan ?? "",
      id_aspek: String(item.id_aspek),
    });
    setShowModal(true);
  };

  const handleHapus = async (id: number) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/indikator/${id}`, {
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
    if (!form.nama_indikator.trim() || !form.nama_kegiatan.trim() || !form.id_aspek) {
      alert("Semua field wajib diisi!");
      return;
    }
    setLoadingSubmit(true);
    try {
      const url = editData
        ? `${process.env.NEXT_PUBLIC_API_URL}/indikator/${editData.id_indikator}`
        : `${process.env.NEXT_PUBLIC_API_URL}/indikator`;

      const res = await fetch(url, {
        method: editData ? "PUT" : "POST",
        headers,
        body: JSON.stringify({
          nama_indikator: form.nama_indikator,
          nama_kegiatan: form.nama_kegiatan,
          id_aspek: Number(form.id_aspek),
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
        <table className="w-full text-sm border-collapse table-fixed">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[40px] border-r border-gray-200">No</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Indikator</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider border-r border-gray-200">Kegiatan</th>
              <th className="px-5 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-[160px] border-r border-gray-200">Aspek</th>
              <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider w-[150px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-400 text-sm">Memuat data...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-16 text-gray-400 text-sm">Belum ada data indikator penilaian</td>
              </tr>
            ) : (
              filtered.map((item, index) => (
                <tr key={item.id_indikator} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-4 py-3.5 text-center text-xs text-gray-400 font-medium border-r border-gray-100">{index + 1}</td>
                  <td className="px-5 py-3.5 border-r border-gray-100">
                    <span className="font-medium text-gray-800 text-sm block whitespace-normal break-words">{item.nama_indikator}</span>
                  </td>
                  <td className="px-5 py-3.5 border-r border-gray-100">
                    <span className="text-gray-600 text-sm block whitespace-normal break-words">{item.nama_kegiatan}</span>
                  </td>
                  <td className="px-5 py-3.5 border-r border-gray-100">
                    <span className="text-gray-600 text-sm block whitespace-normal break-words">{item.aspek?.nama_aspek ?? "-"}</span>
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
                        onClick={() => handleHapus(item.id_indikator)}
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

            <div className="px-6 py-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Indikator</label>
                <textarea
                  rows={3}
                  value={form.nama_indikator}
                  onChange={(e) => setForm({ ...form, nama_indikator: e.target.value })}
                  placeholder="Masukkan indikator penilaian"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Kegiatan</label>
                <textarea
                  rows={3}
                  value={form.nama_kegiatan}
                  onChange={(e) => setForm({ ...form, nama_kegiatan: e.target.value })}
                  placeholder="Masukkan nama kegiatan"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">Aspek</label>
                <select
                  value={form.id_aspek}
                  onChange={(e) => setForm({ ...form, id_aspek: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="">Pilih Aspek</option>
                  {aspekList.map((a) => (
                    <option key={a.id_aspek} value={a.id_aspek}>{a.nama_aspek}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                onClick={() => setShowModal(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
              >
                Batal
              </button>
              <button
                onClick={handleSimpan}
                disabled={loadingSubmit}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-5 py-2 rounded-lg shadow-sm shadow-green-200 transition-colors disabled:opacity-60"
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
