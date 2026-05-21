"use client";

import { useState, useEffect } from "react";
import { Pencil, Trash2, Plus, Search, X, Users } from "lucide-react";

interface Guru {
  id_guru: number;
  nik: string;
  nama_guru: string;
  jenis_kelamin: "L" | "P";
  tanggal_lahir: string;
  no_telp: string;
  email: string;
  alamat: string;
  nama_lembaga: string;
  jabatan: string;
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

const getToken = () => localStorage.getItem("token") ?? "";

const authHeaders = () => ({
  "Content-Type": "application/json",
  "Authorization": `Bearer ${getToken()}`,
});

// ── FIX 2: Jabatan pilihan tetap ─────────────────────────────
const jabatanOptions = [
  "Guru Kelas",
  "Guru Mata Pelajaran",
  "Wali Kelas",
  "Kepala Sekolah",
  "Staf Pengajar",
];

export default function DataGuruPage() {
  const [search, setSearch]       = useState("");
  const [data, setData]           = useState<Guru[]>([]);
  const [loading, setLoading]     = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData]   = useState<Guru | null>(null);
  const [saving, setSaving]       = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const [form, setForm] = useState({
    nik:            "",
    nama_guru:      "",
    jenis_kelamin:  "" as "L" | "P" | "",
    tanggal_lahir:  "",
    no_telp:        "",
    email:          "",
    alamat:         "",
    nama_lembaga:   "",
    jabatan:        "",
  });

  // ── Fetch semua guru ──────────────────────────────────────
  const fetchGuru = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${BASE_URL}/guru`, {
        headers: authHeaders(),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();
      setData(json.data ?? []);
    } catch {
      setError("Gagal mengambil data guru. Pastikan kamu sudah login.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchGuru(); }, []);

  // ── Filter + sort ─────────────────────────────────────────
  const filtered = data
    .filter((g) =>
      g.nama_guru.toLowerCase().includes(search.toLowerCase()) ||
      g.nik.includes(search) ||
      (g.no_telp ?? "").includes(search) ||
      (g.email ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (g.alamat ?? "").toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => a.nama_guru.localeCompare(b.nama_guru));

  // ── Tambah ───────────────────────────────────────────────
  const handleTambah = () => {
    setEditData(null);
    setForm({
      nik: "", nama_guru: "", jenis_kelamin: "", tanggal_lahir: "",
      no_telp: "", email: "", alamat: "", nama_lembaga: "", jabatan: "",
    });
    setShowModal(true);
  };

  // ── Edit ─────────────────────────────────────────────────
  const handleEdit = (guru: Guru) => {
    setEditData(guru);
    setForm({
      nik:           guru.nik,
      nama_guru:     guru.nama_guru,
      jenis_kelamin: guru.jenis_kelamin,
      tanggal_lahir: guru.tanggal_lahir ?? "",
      no_telp:       guru.no_telp ?? "",
      email:         guru.email ?? "",
      alamat:        guru.alamat ?? "",
      nama_lembaga:  guru.nama_lembaga ?? "",
      jabatan:       guru.jabatan ?? "",
    });
    setShowModal(true);
  };

  // ── Hapus ─────────────────────────────────────────────────
  const handleHapus = async (id_guru: number) => {
    if (!confirm("Yakin ingin hapus data ini?")) return;
    try {
      const res = await fetch(`${BASE_URL}/guru/${id_guru}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (!res.ok) throw new Error();
      setData((prev) => prev.filter((g) => g.id_guru !== id_guru));
    } catch {
      alert("Gagal menghapus data.");
    }
  };

  // ── Simpan (tambah / edit) ────────────────────────────────
  const handleSimpan = async () => {
    // FIX 1: Validasi NIK harus tepat 16 digit angka
    if (!form.nik.trim()) {
      alert("NIK wajib diisi!");
      return;
    }
    if (!/^\d{16}$/.test(form.nik.trim())) {
      alert("NIK harus berupa 16 digit angka!");
      return;
    }
    if (!form.nama_guru.trim()) {
      alert("Nama Guru wajib diisi!");
      return;
    }
    if (!form.jenis_kelamin) {
      alert("Jenis Kelamin wajib dipilih!");
      return;
    }

    setSaving(true);
    try {
      const url    = editData
        ? `${BASE_URL}/guru/${editData.id_guru}`
        : `${BASE_URL}/guru`;
      const method = editData ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(form),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        if (json.errors) {
          const msgs = Object.values(json.errors).flat().join("\n");
          alert(`Validasi gagal:\n${msgs}`);
        } else {
          alert(json.message ?? "Gagal menyimpan data.");
        }
        return;
      }

      await fetchGuru();
      setShowModal(false);
    } catch {
      alert("Terjadi kesalahan koneksi.");
    } finally {
      setSaving(false);
    }
  };

  // ── Helper ───────────────────────────────────────────────
  const getInitials = (nama: string) =>
    nama.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-violet-100 text-violet-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  const labelJK = (jk: string) => jk === "L" ? "Laki-laki" : jk === "P" ? "Perempuan" : "-";

  // ── Render ───────────────────────────────────────────────
  return (
    <div className="w-full font-sans">

      {/* Header bar */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white rounded-lg p-2">
            <Users size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900 leading-tight">Data Guru</h1>
            <p className="text-xs text-gray-400">{data.length} guru terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari nama, NIK, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 w-56 transition-all"
            />
          </div>
          <button
            onClick={handleTambah}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors"
          >
            <Plus size={15} /> Tambah Guru
          </button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-x-auto">
        {loading ? (
          <div className="py-16 text-center text-sm text-gray-400">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center text-sm text-gray-400">Tidak ada data guru.</div>
        ) : (
          <table className="w-full text-sm border-collapse table-auto">
            <thead>
              <tr className="bg-gray-200 border-b border-gray-200">
                {["No", "Nama Guru", "NIK", "Lembaga", "Jabatan", "Jenis Kelamin", "No Telp", "Email", "Aksi"].map((h, i) => (
                  <th key={i} className="px-3 py-3 text-xs font-semibold text-black uppercase tracking-wider border-r border-gray-200 last:border-r-0 text-left first:text-center last:text-center">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((guru, index) => (
                <tr key={guru.id_guru} className="hover:bg-blue-50/40 transition-colors">
                  <td className="px-3 py-3 text-center text-xs text-gray-400 font-medium border-r border-gray-100">{index + 1}</td>
                  <td className="px-3 py-3 border-r border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                        {getInitials(guru.nama_guru)}
                      </div>
                      <span className="font-medium text-gray-800 text-xs whitespace-nowrap">{guru.nama_guru}</span>
                    </div>
                  </td>
                  <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 whitespace-nowrap">{guru.nik}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 whitespace-nowrap">{guru.nama_lembaga ?? "-"}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 whitespace-nowrap">{guru.jabatan ?? "-"}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 whitespace-nowrap">{labelJK(guru.jenis_kelamin)}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100 tabular-nums whitespace-nowrap">{guru.no_telp ?? "-"}</td>
                  <td className="px-3 py-3 text-gray-600 text-xs border-r border-gray-100">
                    <span className="truncate block max-w-[180px]">{guru.email ?? "-"}</span>
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex justify-center gap-1.5">
                      <button onClick={() => handleEdit(guru)} className="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Pencil size={11} /> Edit
                      </button>
                      <button onClick={() => handleHapus(guru.id_guru)} className="bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
                        <Trash2 size={11} /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-800">
                {editData ? "Edit Data Guru" : "Tambah Guru Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {/* FIX 1: NIK — maxLength 16, hanya angka, counter digit */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 flex items-center justify-between">
                  <span>NIK *</span>
                  <span className={`text-xs tabular-nums ${form.nik.length === 16 ? "text-green-500" : "text-gray-400"}`}>
                    {form.nik.length}/16
                  </span>
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={16}
                  value={form.nik}
                  onChange={(e) => {
                    // hanya izinkan digit
                    const val = e.target.value.replace(/\D/g, "").slice(0, 16);
                    setForm({ ...form, nik: val });
                  }}
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-colors ${
                    form.nik.length > 0 && form.nik.length !== 16
                      ? "border-red-300 focus:border-red-400"
                      : form.nik.length === 16
                      ? "border-green-300 focus:border-green-400"
                      : "border-gray-200 focus:border-blue-400"
                  }`}
                  placeholder="16 digit NIK"
                />
                {form.nik.length > 0 && form.nik.length !== 16 && (
                  <p className="text-xs text-red-500 mt-1">NIK harus tepat 16 digit angka.</p>
                )}
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nama Guru *</label>
                <input type="text" value={form.nama_guru}
                  onChange={(e) => setForm({ ...form, nama_guru: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="Nama lengkap guru" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Jenis Kelamin *</label>
                <select value={form.jenis_kelamin}
                  onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value as "L" | "P" | "" })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400">
                  <option value="">-- Pilih --</option>
                  <option value="L">Laki-laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Tanggal Lahir</label>
                <input type="date" value={form.tanggal_lahir}
                  onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">No Telp</label>
                <input type="text" inputMode="numeric" value={form.no_telp}
                  onChange={(e) => setForm({ ...form, no_telp: e.target.value.replace(/\D/g, "") })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="08xxxxxxxxxx" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Email</label>
                <input type="email" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="email@sekolah.sch.id" />
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Nama Lembaga</label>
                <input type="text" value={form.nama_lembaga}
                  onChange={(e) => setForm({ ...form, nama_lembaga: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                  placeholder="Nama sekolah / lembaga" />
              </div>

              {/* FIX 2: Jabatan → dropdown pilihan tetap */}
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Jabatan</label>
                <select
                  value={form.jabatan}
                  onChange={(e) => setForm({ ...form, jabatan: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400"
                >
                  <option value="">-- Pilih Jabatan --</option>
                  {jabatanOptions.map((j) => (
                    <option key={j} value={j}>{j}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">Alamat</label>
                <textarea value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 resize-none"
                  rows={2} placeholder="Alamat lengkap" />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-5">
              <button onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleSimpan} disabled={saving}
                className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white rounded-lg font-medium">
                {saving ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}