"use client";

import { useState, useEffect } from "react";
import { Search, Users, Pencil, Trash2, X } from "lucide-react";

interface OrangTua {
  nama_orangtua: string;
  pekerjaan: string | null;
  no_telp: string | null;
  alamat: string | null;
  user: { email: string } | null;
}

interface Anak {
  id_anak: number;
  nama_anak: string;
  jenis_kelamin: string;
  tanggal_lahir: string | null;
  kelas: { nama_kelas: string } | null;
  orang_tua: OrangTua | null;
}

interface KelasOption {
  id_kelas: number;
  nama_kelas: string;
}

const avatarColors = [
  "bg-blue-100 text-blue-600", "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600", "bg-pink-100 text-pink-600",
  "bg-orange-100 text-orange-600", "bg-teal-100 text-teal-600",
  "bg-yellow-100 text-yellow-600", "bg-red-100 text-red-600",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const emptyForm = {
  nama_anak: "",
  id_kelas: "",
  jenis_kelamin: "L",
  tanggal_lahir: "",
};

export default function DataAnakAdminPage() {
  const [data, setData]               = useState<Anak[]>([])
  const [kelasList, setKelasList]     = useState<KelasOption[]>([])
  const [search, setSearch]           = useState("")
  const [kelasFilter, setKelasFilter] = useState("Semua")
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState("")
  const [showModal, setShowModal]     = useState(false)
  const [showHapus, setShowHapus]     = useState(false)
  const [hapusId, setHapusId]         = useState<number | null>(null)
  const [editData, setEditData]       = useState<Anak | null>(null)
  const [form, setForm]               = useState(emptyForm)
  const [saving, setSaving]           = useState(false)

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : ""
  const headers = {
    "Authorization": `Bearer ${token}`,
    "Accept": "application/json",
    "Content-Type": "application/json",
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      const [resAnak, resKelas] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/anak`, { headers }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/kelas`, { headers }),
      ])
      const dataAnak  = await resAnak.json()
      const dataKelas = await resKelas.json()

      if (dataAnak.success)  setData(dataAnak.data)
      if (dataKelas.success) setKelasList(dataKelas.data)
    } catch {
      setError("Gagal memuat data.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

  const filtered = data.filter((a) => {
    const matchSearch =
      a.nama_anak.toLowerCase().includes(search.toLowerCase()) ||
      (a.orang_tua?.nama_orangtua ?? "").toLowerCase().includes(search.toLowerCase())
    const matchKelas =
      kelasFilter === "Semua" || a.kelas?.nama_kelas === kelasFilter
    return matchSearch && matchKelas
  })

  const handleEdit = (anak: Anak) => {
    setEditData(anak)
    setForm({
      nama_anak:     anak.nama_anak,
      id_kelas:      anak.kelas
        ? String(kelasList.find(k => k.nama_kelas === anak.kelas?.nama_kelas)?.id_kelas ?? "")
        : "",
      jenis_kelamin: anak.jenis_kelamin,
      tanggal_lahir: anak.tanggal_lahir ?? "",
    })
    setShowModal(true)
  }

  const handleSimpan = async () => {
    if (!form.nama_anak.trim() || !form.id_kelas) return
    setSaving(true)
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anak/${editData!.id_anak}`, {
        method: "PUT",
        headers,
        body: JSON.stringify(form),
      })
      const json = await res.json()

      if (json.success) {
        setShowModal(false)
        fetchData()
      } else {
        setError(json.message || "Gagal menyimpan.")
      }
    } catch {
      setError("Gagal terhubung ke server.")
    } finally {
      setSaving(false)
    }
  }

  const handleHapusKonfirm = (id: number) => { setHapusId(id); setShowHapus(true) }

  const handleHapus = async () => {
    if (!hapusId) return
    try {
      const res  = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/anak/${hapusId}`, {
        method: "DELETE", headers,
      })
      const json = await res.json()
      if (json.success) fetchData()
    } catch {
      setError("Gagal menghapus data.")
    } finally {
      setShowHapus(false)
      setHapusId(null)
    }
  }

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300"
  const labelCls = "block text-xs font-medium text-gray-600 mb-1.5"

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <p className="text-gray-400 text-sm">Memuat data anak...</p>
    </div>
  )

  return (
    <div className="max-w-full">

      {/* Modal Edit */}
      {showModal && editData && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">Edit Data Anak</h2>
                <p className="text-xs text-gray-400 mt-0.5">Perbarui informasi anak</p>
              </div>
              <button onClick={() => setShowModal(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-3 max-h-[70vh] overflow-y-auto">

              {/* Info orang tua — read only */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 space-y-1">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Info Orang Tua
                </p>
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">Nama:</span>{" "}
                  {editData.orang_tua?.nama_orangtua ?? "-"}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">Pekerjaan:</span>{" "}
                  {editData.orang_tua?.pekerjaan ?? "-"}
                </p>
                <p className="text-xs text-gray-600">
                  <span className="text-gray-400">Email:</span>{" "}
                  {editData.orang_tua?.user?.email ?? "-"}
                </p>
              </div>

              <div>
                <label className={labelCls}>Nama Anak</label>
                <input type="text" placeholder="Masukkan nama anak"
                  value={form.nama_anak}
                  onChange={(e) => setForm({ ...form, nama_anak: e.target.value })}
                  className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Kelas</label>
                  <select value={form.id_kelas}
                    onChange={(e) => setForm({ ...form, id_kelas: e.target.value })}
                    className={inputCls}>
                    <option value="">Pilih kelas</option>
                    {kelasList.map((k) => (
                      <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Jenis Kelamin</label>
                  <select value={form.jenis_kelamin}
                    onChange={(e) => setForm({ ...form, jenis_kelamin: e.target.value })}
                    className={inputCls}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Tanggal Lahir</label>
                <input type="date" value={form.tanggal_lahir}
                  onChange={(e) => setForm({ ...form, tanggal_lahir: e.target.value })}
                  className={inputCls} />
              </div>

            </div>

            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setShowModal(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleSimpan} disabled={saving}
                className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
                {saving ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showHapus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Hapus Data Anak?</h3>
            <p className="text-sm text-gray-500 mb-5">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowHapus(false)}
                className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">
                Batal
              </button>
              <button onClick={handleHapus}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg">
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600 mb-4">
          ⚠ {error}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mt-0.5">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800 leading-tight">Data Anak</p>
            <p className="text-sm text-gray-500">{data.length} anak terdaftar</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 ml-auto">
          <select value={kelasFilter} onChange={(e) => setKelasFilter(e.target.value)}
            className="bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none text-gray-700">
            <option value="Semua">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k.id_kelas} value={k.nama_kelas}>{k.nama_kelas}</option>
            ))}
          </select>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari anak..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none w-44" />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "1000px", borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-10 border-r border-b border-gray-300">No</th>
                <th className="px-3 py-3 text-left font-bold text-black whitespace-nowrap min-w-[150px] border-r border-b border-gray-300">Nama Anak</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-20 border-r border-b border-gray-300">Kelas</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap min-w-[110px] border-r border-b border-gray-300">Jenis Kelamin</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-28 border-r border-b border-gray-300">Tanggal Lahir</th>
                <th className="px-3 py-3 text-left font-bold text-black whitespace-nowrap min-w-[130px] border-r border-b border-gray-300">Nama Orangtua</th>
                <th className="px-3 py-3 text-left font-bold text-black whitespace-nowrap min-w-[120px] border-r border-b border-gray-300">Pekerjaan Orangtua</th>
                <th className="px-3 py-3 text-left font-bold text-black whitespace-nowrap min-w-[140px] border-r border-b border-gray-300">Email</th>
                <th className="px-3 py-3 text-left font-bold text-black whitespace-nowrap min-w-[140px] border-r border-b border-gray-300">Alamat</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-28 border-b border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">
                    Belum ada data anak
                  </td>
                </tr>
              ) : (
                filtered.map((anak, index) => (
                  <tr key={anak.id_anak}
                    className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-200">{index + 1}</td>
                    <td className="px-3 py-3 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                          {getInitials(anak.nama_anak)}
                        </div>
                        <span className="font-medium text-gray-800 whitespace-nowrap">{anak.nama_anak}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-xs whitespace-nowrap border-r border-gray-200">
                      {anak.kelas?.nama_kelas ?? <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-3 py-3 text-center border-r border-gray-200">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${anak.jenis_kelamin === "P" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                        {anak.jenis_kelamin === "P" ? "Perempuan" : "Laki-laki"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-700 text-xs whitespace-nowrap border-r border-gray-200">
                      {anak.tanggal_lahir ?? <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-3 py-3 text-gray-700 text-xs whitespace-nowrap border-r border-gray-200">
                      {anak.orang_tua?.nama_orangtua ?? <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-3 py-3 text-gray-700 text-xs whitespace-nowrap border-r border-gray-200">
                      {anak.orang_tua?.pekerjaan ?? <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-3 py-3 text-gray-700 text-xs border-r border-gray-200">
                      {anak.orang_tua?.user?.email ?? <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-3 py-3 text-gray-700 text-xs border-r border-gray-200">
                      {anak.orang_tua?.alamat ?? <span className="text-gray-400 italic">-</span>}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-1.5 whitespace-nowrap">
                        <button onClick={() => handleEdit(anak)}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md transition-colors">
                          <Pencil size={11} /> Edit
                        </button>
                        <button onClick={() => handleHapusKonfirm(anak.id_anak)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md transition-colors">
                          <Trash2 size={11} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}