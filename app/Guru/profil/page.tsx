"use client";

import { useState, useEffect, useRef } from "react";
import { User, CheckCircle, Lock, Upload, X } from "lucide-react";

export default function ProfilePage() {
  const [nama, setNama] = useState("")
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [nik, setNik] = useState("")
  const [nip, setNip] = useState("")
  const [alamat, setAlamat] = useState("")
  const [telepon, setTelepon] = useState("")
  const [jenisKelamin, setJenisKelamin] = useState("")
  const [tanggalLahir, setTanggalLahir] = useState("")
  const [role, setRole] = useState("")
  const [jabatan, setJabatan] = useState("")
  const [kelas, setKelas] = useState<string[]>([])
  const [fotoTtd, setFotoTtd] = useState<File | null>(null)
  const [fotoTtdPreview, setFotoTtdPreview] = useState<string | null>(null)
  const [existingFotoTtd, setExistingFotoTtd] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace("/api", "") ?? ""

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token")
        const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" }

        const [resProfile, resKelas] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/profil`, { headers }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/kelas`, { headers }),
        ])

        const data = await resProfile.json()
        const dataKelas = await resKelas.json()

        if (data.success) {
          const user = data.data
          const guru = data.data.guru

          setUsername(user.username || "")
          setEmail(user.email || "")
          setRole(user.role || "")

          if (guru) {
            setNama(guru.nama_guru || "")
            setNik(guru.nik || "")
            setNip(guru.nip || "")
            setAlamat(guru.alamat || "")
            setTelepon(guru.no_telp || "")
            setJabatan(guru.jabatan || "-")
            setJenisKelamin(
              guru.jenis_kelamin === "L" ? "Laki-laki" :
              guru.jenis_kelamin === "P" ? "Perempuan" : ""
            )
            setTanggalLahir(guru.tanggal_lahir || "")
            if (guru.foto_ttd) {
              setExistingFotoTtd(`${API_BASE}/storage/${guru.foto_ttd}`)
            }

            if (dataKelas.success) {
              const kelasGuru = (dataKelas.data as any[])
                .filter((k: any) => k.wali_kelas?.toLowerCase() === guru.nama_guru?.toLowerCase())
                .map((k: any) => k.nama_kelas)
              setKelas(kelasGuru)
            }
          }
        }
      } catch {
        setError("Gagal memuat profil.")
      } finally {
        setLoading(false)
      }
    }
    fetchProfile()
  }, [])

  const handleFotoTtdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null
    setFotoTtd(file)
    if (file) setFotoTtdPreview(URL.createObjectURL(file))
  }

  const handleRemoveFoto = () => {
    setFotoTtd(null)
    setFotoTtdPreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!jenisKelamin) { setError("Jenis kelamin harus dipilih."); return }

    try {
      const token = localStorage.getItem("token")
      const headers = { "Authorization": `Bearer ${token}`, "Accept": "application/json" }

      const formData = new FormData()
      formData.append("nama", nama)
      formData.append("email", email)
      formData.append("username", username)
      formData.append("nik", nik)
      formData.append("nip", nip)
      formData.append("alamat", alamat)
      formData.append("no_telp", telepon)
      formData.append("jenis_kelamin", jenisKelamin === "Laki-laki" ? "L" : "P")
      formData.append("tanggal_lahir", tanggalLahir)
      if (password) formData.append("password", password)
      if (fotoTtd) formData.append("foto_ttd", fotoTtd)
      formData.append("_method", "PUT")

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profil`, {
        method: "POST",
        headers,
        body: formData,
      })

      const data = await res.json()

      if (data.success) {
        setShowSuccess(true)
        setPassword("")
        setFotoTtd(null)
        setFotoTtdPreview(null)
      } else {
        setError(data.message || "Gagal menyimpan perubahan.")
      }
    } catch {
      setError("Gagal terhubung ke server.")
    }
  }

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
            <p className="text-sm text-gray-500 mb-5">Perubahan data profil kamu telah tersimpan.</p>
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

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
            <User size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-base font-bold text-gray-800 leading-tight">Profil Saya</p>
            <p className="text-sm text-gray-500">Kelola informasi akun kamu</p>
          </div>
        </div>

        {kelas.length > 0 && (
          <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 flex items-center justify-between">
            <span className="text-sm text-gray-600 font-medium">Mengajar/Mengampu Kelas</span>
            <div className="flex gap-2">
              {kelas.map((k) => (
                <span key={k} className="text-sm font-bold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">{k}</span>
              ))}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit}>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Informasi Pribadi</p>
          <div className="space-y-4 mb-6">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input type="text" value={nama} onChange={(e) => setNama(e.target.value)} required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-sm text-gray-600">NIK</label>
                <input type="text" value={nik} onChange={(e) => setNik(e.target.value)} maxLength={16}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">NIP <span className="text-gray-400 font-normal">(18 digit)</span></label>
                <input type="text" value={nip} onChange={(e) => setNip(e.target.value.replace(/\D/g, ""))} maxLength={18}
                  placeholder="Kosongkan jika tidak ada"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 font-mono" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Jabatan</label>
                <div className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-500 flex items-center gap-2 cursor-not-allowed">
                  <Lock size={13} className="text-gray-300" />
                  <span>{jabatan || "-"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Jenis Kelamin</label>
                <select value={jenisKelamin} onChange={(e) => setJenisKelamin(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white">
                  <option value="" disabled>-- Pilih Jenis Kelamin --</option>
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-gray-600">Tanggal Lahir</label>
                <input type="date" value={tanggalLahir} onChange={(e) => setTanggalLahir(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nomor Telepon</label>
                <input type="text" value={telepon} onChange={(e) => setTelepon(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Alamat</label>
              <textarea value={alamat} onChange={(e) => setAlamat(e.target.value)} rows={2}
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none" />
            </div>

            {/* Upload TTD Guru */}
            <div>
              <label className="text-sm text-gray-600">Foto Tanda Tangan</label>
              <p className="text-xs text-gray-400 mb-2">Akan digunakan di laporan PDF. Background putih/transparan. JPG, PNG — maks. 2MB.</p>

              {(fotoTtdPreview || existingFotoTtd) ? (
                <div className="border border-gray-200 rounded-lg p-4 flex items-center gap-4">
                  <img
                    src={fotoTtdPreview ?? existingFotoTtd ?? ""}
                    alt="Tanda Tangan"
                    className="h-20 object-contain border border-gray-100 rounded bg-gray-50 px-2"
                  />
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 font-medium">
                      {fotoTtd ? fotoTtd.name : "Tanda tangan tersimpan"}
                    </p>
                    <p className="text-xs text-gray-400">
                      {fotoTtd ? `${(fotoTtd.size / 1024).toFixed(0)} KB` : ""}
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
              <input ref={fileInputRef} type="file" accept=".jpg,.jpeg,.png" onChange={handleFotoTtdChange} className="hidden" />
            </div>

          </div>

          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Informasi Akun</p>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Username</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
              <div>
                <label className="text-sm text-gray-600">Password <span className="text-gray-400 font-normal">(kosongkan jika tidak ingin ubah)</span></label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••"
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300" />
              </div>
            </div>
            <div>
              <label className="text-sm text-gray-600">Role <span className="text-gray-400 font-normal">(tidak dapat diubah)</span></label>
              <div className="w-full mt-1 border border-gray-200 rounded-lg px-4 py-2 text-sm bg-gray-100 text-gray-400 flex items-center justify-between cursor-not-allowed">
                <span>{role}</span>
                <Lock size={13} className="text-gray-300" />
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <button type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition active:scale-95">
              Simpan Perubahan
            </button>
          </div>

        </form>
      </div>
    </div>
  )
}