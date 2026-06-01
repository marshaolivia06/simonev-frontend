"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, X, Users } from "lucide-react";

interface Kelas {
  id_kelas: number;
  nama_kelas: string;
   wali_kelas: string | null;
  tahun_ajaran: string;
}

interface Guru {
  id_guru: number;
  nama_guru: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

const getToken = () =>
  typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
    "Accept": "application/json",
});

// Generate tahun ajaran otomatis mulai dari sekarang + 5 tahun ke depan
const generateTahunAjaran = (): string[] => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1–12
  // Jika sudah memasuki semester 2 (Juli ke atas), tahun ajaran aktif = tahun ini/tahun depan
  const startYear = currentMonth >= 7 ? now.getFullYear() : now.getFullYear() - 1;
  return Array.from({ length: 6 }, (_, i) => `${startYear + i}/${startYear + i + 1}`);
};

export default function DataKelasPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<Kelas[]>([]);
  const [guruList, setGuruList] = useState<Guru[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Kelas | null>(null);
  const [saving, setSaving] = useState(false);

  const tahunAjaranOptions = generateTahunAjaran();
  const defaultTahunAjaran = tahunAjaranOptions[0]; // tahun ajaran sekarang

  const [form, setForm] = useState({
    nama_kelas: "",
    wali_kelas: "",
    tahun_ajaran: defaultTahunAjaran,
  });

  const fetchKelas = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/kelas`, { headers: authHeaders() });
      const json = await res.json();
      setData(json.data ?? []);
    } catch {
      alert("Gagal memuat data kelas.");
    } finally {
      setLoading(false);
    }
  };

  const fetchGuru = async () => {
    try {
      const res = await fetch(`${API_BASE}/guru`, { headers: authHeaders() });
      const json = await res.json();
      setGuruList(json.data ?? []);
    } catch {
      console.error("Gagal memuat data guru.");
    }
  };

  useEffect(() => {
    fetchKelas();
    fetchGuru();
  }, []);

  const filtered = data
  .filter((k) =>
    k.nama_kelas.toLowerCase().includes(search.toLowerCase()) ||
    (k.wali_kelas ?? "").toLowerCase().includes(search.toLowerCase()) || // ← fix
    k.tahun_ajaran.includes(search)
  ) 
    .sort((a, b) => a.nama_kelas.localeCompare(b.nama_kelas));

  const handleTambah = () => {
    setEditData(null);
    setForm({ nama_kelas: "", wali_kelas: "", tahun_ajaran: defaultTahunAjaran });
    setShowModal(true);
  };

  // SESUDAH
const handleEdit = (kelas: Kelas) => {
  setEditData(kelas);
  setForm({
    nama_kelas: kelas.nama_kelas,
    wali_kelas: kelas.wali_kelas ?? "",  // ← null jadi ""
    tahun_ajaran: kelas.tahun_ajaran,
  });
  setShowModal(true);
};

  const handleHapus = async (id: number) => {
    if (!confirm("Yakin ingin hapus data ini?")) return;
    try {
      const res = await fetch(`${API_BASE}/kelas/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setData((prev) => prev.filter((k) => k.id_kelas !== id));
    } catch {
      alert("Gagal menghapus data.");
    }
  };

  const handleSimpan = async () => {
  if (!form.nama_kelas.trim() || !form.tahun_ajaran) {
    alert("Nama kelas dan tahun ajaran wajib diisi!");
    return;
  }

  // ← Cek apakah guru sudah mengajar kelas lain
  if (form.wali_kelas) {
    const kelasGuru = data.find(
      (k) => k.wali_kelas === form.wali_kelas && k.id_kelas !== editData?.id_kelas
    );
    if (kelasGuru) {
      alert(`Guru "${form.wali_kelas}" sudah mengajar kelas "${kelasGuru.nama_kelas}". Pilih guru lain.`);
      return;
    }
  }

  setSaving(true);
    try {
      const url = editData
        ? `${API_BASE}/kelas/${editData.id_kelas}`
        : `${API_BASE}/kelas`;
      const res = await fetch(url, {
        method: editData ? "PUT" : "POST",
        headers: authHeaders(),
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setShowModal(false);
      await fetchKelas();
    } catch {
      alert("Gagal menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  return (
    <div className="w-full font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white rounded-lg p-2">
            <Users size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Data Kelas</h1>
            <p className="text-xs text-gray-400">{data.length} kelas terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kelas..."
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs w-56 focus:outline-none"
            />
          </div>
          <button
            onClick={handleTambah}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
          >
            <Plus size={15} />
            Tambah Kelas
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[60px] border-r border-gray-300">No</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Nama Kelas</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Wali Kelas</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Tahun Ajaran</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[140px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">Memuat data...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-400">Tidak ada data</td>
              </tr>
            ) : (
              filtered.map((k, i) => (
                <tr key={k.id_kelas} className="hover:bg-gray-50">
                  <td className="text-center px-4 py-3 text-gray-500 border-r border-gray-200">{i + 1}</td>
                  <td className="px-5 py-3 border-r border-gray-200 font-medium text-gray-800">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>
                        {getInitials(k.nama_kelas)}
                      </div>
                      {k.nama_kelas}
                    </div>
                  </td>
                  <td className="px-5 py-3 border-r border-gray-200 text-gray-700 font-medium">{k.wali_kelas}</td>
                  <td className="px-5 py-3 border-r border-gray-200 text-gray-600">{k.tahun_ajaran}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(k)}
                        className="bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                      >
                        <Pencil size={12} /> Edit
                      </button>
                      <button
                        onClick={() => handleHapus(k.id_kelas)}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
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

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden">

            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {editData ? "Edit Data Kelas" : "Tambah Data Kelas"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editData ? "Perbarui informasi kelas" : "Isi data kelas baru"}
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* Nama Kelas — input manual */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
  Nama Kelas <span className="text-red-500">*</span>
</label>
                <input
                  type="text"
                  value={form.nama_kelas}
                  onChange={(e) => setForm({ ...form, nama_kelas: e.target.value })}
                  placeholder="Contoh: TK A1, TK B2, Playgroup A"
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                />
              </div>

              {/* Wali Kelas — dropdown dari data guru */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
                  Wali Kelas
                </label>
                <select
                  value={form.wali_kelas}
                  onChange={(e) => setForm({ ...form, wali_kelas: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                >
                  <option value="">-- Pilih Wali Kelas --</option>
                  {guruList.map((g) => (
                    <option key={g.id_guru} value={g.nama_guru}>
                      {g.nama_guru}
                    </option>
                  ))}
                </select>
                {guruList.length === 0 && (
                  <p className="text-xs text-amber-500 mt-1">
                    Data guru belum tersedia. Tambah guru terlebih dahulu.
                  </p>
                )}
              </div>

              {/* Tahun Ajaran — dropdown dengan default otomatis */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1.5">
  Tahun Ajaran <span className="text-red-500">*</span>
  <span className="ml-1.5 text-green-600 font-normal">(otomatis tahun ini)</span>
</label>
                <select
                  value={form.tahun_ajaran}
                  onChange={(e) => setForm({ ...form, tahun_ajaran: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
                >
                  {tahunAjaranOptions.map((t, i) => (
                    <option key={t} value={t}>
                      {t}{i === 0 ? " (Sekarang)" : ""}
                    </option>
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
                disabled={saving}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
              >
                {saving ? "Menyimpan..." : editData ? "Simpan Perubahan" : "Tambah Data"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}