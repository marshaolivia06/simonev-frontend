"use client";

import { useState, useEffect, useRef } from "react";
import { CheckCircle, Lock, Upload, X } from "lucide-react";

export default function ProfileAdminPage() {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [namaSekolah, setNamaSekolah] = useState("")
  const [emailSekolah, setEmailSekolah] = useState("")
  const [telepon, setTelepon] = useState("")
  const [alamat, setAlamat] = useState("")
  const [namaKS, setNamaKS] = useState("")
  const [nipKS, setNipKS] = useState("")
  const [fotoTtdKS, setFotoTtdKS] = useState<File | null>(null)
  const [fotoTtdKSPreview, setFotoTtdKSPreview] = useState<string | null>(null)
  const [existingFotoTtdKS, setExistingFotoTtdKS] = useState<string | null>(null)
  const [terdaftarSejak, setTerdaftarSejak] = useState("-")
  const [terakhirLogin, setTerakhirLogin] = useState("-")
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? ""

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        }
        const [resUser, resSekolah] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/profil`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/profil-sekolah`, { headers }),
        ])
        const dataUser = await resUser.json()
        const dataSekolah = await resSekolah.json()

        if (dataUser.success) {
          const user = dataUser.data
          setUsername(user.username || "")
          setEmail(user.email || "")
          setTerdaftarSejak(user.created_at
            ? new Date(user.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
            : "-")
          setTerakhirLogin(user.last_login
            ? new Date(user.last_login).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }) + " WIB"
            : "-")
        }

        if (dataSekolah.success && dataSekolah.data) {
          const s = dataSekolah.data
          setNamaSekolah(s.nama_sekolah || "")
          setEmailSekolah(s.email || "")
          setTelepon(s.telepon || "")
          setAlamat(s.alamat || "")
          setNamaKS(s.nama_kepala_sekolah || "")
          setNipKS(s.nip_kepala_sekolah || "")
          if (s.foto_ttd_ks) {
            setExistingFotoTtdKS(`${API_BASE}/storage/${s.foto_ttd_ks}`)
          }
        }
      } catch {
        setError("Gagal memuat profil.")
      } finally {
        setLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleFotoTtdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setFotoTtdKS(file)
    if (file) {
      const url = URL.createObjectURL(file)
      setFotoTtdKSPreview(url)
    }
  }

  const handleRemoveFoto = () => {
    setFotoTtdKS(null)
    setFotoTtdKSPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    try {
      const token = localStorage.getItem("token")
      const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" }

      // Update akun
      const bodyUser: Record<string, string> = { username, email }
      if (password) bodyUser.password = password

      const resUser = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profil`, {
        method: "PUT",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(bodyUser),
      })
      const dataUser = await resUser.json()
      if (!dataUser.success) {
        setError(dataUser.message || "Gagal menyimpan akun.")
        return
      }

      // Update profil sekolah (pakai FormData karena ada file)
      const formData = new FormData()
      formData.append("nama_sekolah", namaSekolah)
      formData.append("email", emailSekolah)
      formData.append("telepon", telepon)
      formData.append("alamat", alamat)
      formData.append("nama_kepala_sekolah", namaKS)
      formData.append("nip_kepala_sekolah", nipKS)
      if (fotoTtdKS) formData.append("foto_ttd_ks", fotoTtdKS)
      formData.append("_method", "PUT")

      const resSekolah = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profil-sekolah`, {
        method: "POST",
        headers,
        body: formData,
      })
      const dataSekolah = await resSekolah.json()

      if (dataSekolah.success) {
        setShowSuccess(true)
        setPassword("")
        setFotoTtdKS(null)
        setFotoTtdKSPreview(null)
        if (dataSekolah.data?.foto_ttd_ks) {
          setExistingFotoTtdKS(`${API_BASE}/storage/${dataSekolah.data.foto_ttd_ks}`)
        }
      } else {
        setError(dataSekolah.message || "Gagal menyimpan profil sekolah.")
      }
    } catch {
      setError("Gagal terhubung ke server.")
    }
  }

  const inputCls = "w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-400 text-sm">Memuat profil...</p>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Profil Berhasil Diperbarui</h3>
            <p className="text-sm text-gray-500 mb-5">Perubahan data profil telah tersimpan.</p>
            <button onClick={() => setShowSuccess(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition">
              Oke
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600">
          ⚠ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Akun */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Akun</p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Password baru <span className="text-gray-400 font-normal">(kosongkan jika tidak ingin mengubah)</span></label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputCls} />
            </div>
            <div>
              <label className="text-sm text-gray-600">Role <span className="text-gray-400 font-normal">(tidak dapat diubah)</span></label>
              <div className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-400 flex items-center justify-between cursor-not-allowed">
                <span>admin</span>
                <Lock size={13} className="text-gray-300" />
              </div>
            </div>
          </div>
        </div>

        {/* Profil Sekolah */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Profil Sekolah</p>
              <p className="text-xs text-gray-400 mt-0.5">Data ini akan muncul di laporan PDF.</p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Dapat diedit</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Nama Sekolah</label>
              <input type="text" value={namaSekolah} onChange={(e) => setNamaSekolah(e.target.value)} required className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Email Sekolah</label>
                <input type="email" value={emailSekolah} onChange={(e) => setEmailSekolah(e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nomor Telepon</label>
                <input type="text" value={telepon} onChange={(e) => setTelepon(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Alamat Sekolah</label>
              <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} rows={3}
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
            </div>
          </div>
        </div>

        {/* Kepala Sekolah */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Kepala Sekolah</p>
              <p className="text-xs text-gray-400 mt-0.5">Data dan tanda tangan untuk laporan PDF.</p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">Dapat diedit</span>
          </div>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nama Kepala Sekolah</label>
                <input type="text" value={namaKS} onChange={(e) => setNamaKS(e.target.value)} placeholder="Nama lengkap" className={inputCls} />
              </div>
              <div>
                <label className="text-sm text-gray-600">NIP Kepala Sekolah</label>
                <input type="text" value={nipKS} onChange={(e) => setNipKS(e.target.value.replace(/\D/g, ""))} maxLength={18} placeholder="18 digit NIP" className={inputCls + " font-mono"} />
              </div>
            </div>

            {/* Upload TTD KS */}
            <div>
              <label className="text-sm text-gray-600">Foto Tanda Tangan Kepala Sekolah</label>
              <p className="text-xs text-gray-400 mb-2">Upload foto tanda tangan dengan background putih/transparan. JPG, PNG — maks. 2MB.</p>

              {(fotoTtdKSPreview || existingFotoTtdKS) ? (
                <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                  <img
                    src={fotoTtdKSPreview ?? existingFotoTtdKS ?? ""}
                    alt="TTD Kepala Sekolah"
                    className="h-20 object-contain border border-gray-100 rounded bg-gray-50 px-2"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      {fotoTtdKS ? fotoTtdKS.name : "Tanda tangan tersimpan"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fotoTtdKS ? `${(fotoTtdKS.size / 1024).toFixed(0)} KB` : ""}
                    </p>
                  </div>
                  <button type="button" onClick={handleRemoveFoto}
                    className="text-gray-400 hover:text-red-500 transition">
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-gray-300 rounded-lg px-4 py-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition">
                  <Upload size={20} className="text-gray-400" />
                  <p className="text-sm text-gray-500">Klik untuk upload foto tanda tangan</p>
                  <p className="text-xs text-gray-400">JPG, PNG — maks. 2MB</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleFotoTtdChange}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Info Sistem */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Info Sistem</p>
              <p className="text-xs text-gray-400 mt-0.5">Data teknis yang dikelola oleh sistem.</p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">Read only</span>
          </div>
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-500 w-2/5">Status Akun</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">Aktif</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Hak Akses</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">Administrator Sistem</span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500 align-top">Keterangan</td>
                  <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed">
                    Mengelola akun guru & orang tua, menyetujui atau menolak pendaftaran, serta mengatur seluruh data sistem.
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Terdaftar Sejak</td>
                  <td className="px-4 py-3 text-gray-700">{terdaftarSejak}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Terakhir Login</td>
                  <td className="px-4 py-3 text-gray-700">{terakhirLogin}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit"
            className="bg-green-500 hover:bg-green-600 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition active:scale-95">
            Simpan Perubahan
          </button>
        </div>

      </form>
    </div>
  )
}