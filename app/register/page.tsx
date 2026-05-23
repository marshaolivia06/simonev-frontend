"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, CheckCircle, BookOpen, User } from "lucide-react";

type Role = "guru" | "ortu" | "";

const inputClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-[#1a7bbf] focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400";
const selectClass = "w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-[#1a7bbf] focus:ring-2 focus:ring-blue-100 transition-all appearance-none";
const labelClass = "block text-xs font-semibold text-gray-600 mb-1";

const jabatanOptions = ["Guru Kelas", "Guru Mata Pelajaran", "Wali Kelas", "Kepala Sekolah", "Staf Pengajar"];
const hubunganOptions = ["Ayah", "Ibu", "Wali"];

export default function RegisterPage() {
  const router = useRouter()
  const [role, setRole] = useState<Role>("")
  const [showPassword, setShowPassword] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [nikError, setNikError] = useState("")
  const [nipError, setNipError] = useState("")

  // ← PERUBAHAN: state kelas dinamis dari API
  const [kelasOptions, setKelasOptions] = useState<string[]>([])
  const [loadingKelas, setLoadingKelas] = useState(false)

  const [formGuru, setFormGuru] = useState({
    namaLengkap: "", username: "", email: "", password: "",
    konfirmasiPassword: "", noHp: "", nik: "", nip: "",
    alamat: "", jabatan: "", tanggalLahir: "", suratTugas: null as File | null,
  })

  const [formOrtu, setFormOrtu] = useState({
    namaLengkap: "", username: "", email: "", password: "",
    konfirmasiPassword: "", noHp: "", nik: "", hubungan: "",
    namaAnak: "", tanggalLahirAnak: "", kelasAnak: "", alamat: "",
    fotoKtp: null as File | null,
  })

  // ← PERUBAHAN: fetch kelas dari API saat role "ortu" dipilih
  useEffect(() => {
    if (role !== "ortu") return
    setLoadingKelas(true)
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kelas`, {
      headers: { "Accept": "application/json" },
    })
      .then((r) => r.json())
      .then((data) => {
        const list = data.data ?? data
        const names = list.map((k: { nama_kelas: string }) => k.nama_kelas)
        setKelasOptions(names)
      })
      .catch(() => setKelasOptions([]))
      .finally(() => setLoadingKelas(false))
  }, [role])

  const handleSubmit = async () => {
    setError("")

    const form = role === "guru" ? formGuru : formOrtu
    if (!form.namaLengkap || !form.username || !form.email || !form.password || !form.noHp || !form.nik) {
      setError("Harap lengkapi semua field yang wajib diisi.")
      return
    }
    if (form.password !== form.konfirmasiPassword) {
      setError("Password dan konfirmasi password tidak sama.")
      return
    }
    if (form.nik.length !== 16) {
      setNikError("NIK harus 16 digit angka.")
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append("nama", form.namaLengkap)
      formData.append("username", form.username)
      formData.append("email", form.email)
      formData.append("password", form.password)
      formData.append("nik", form.nik)
      formData.append("no_telp", form.noHp)
      formData.append("role", role === "guru" ? "guru" : "orang_tua")

      if (role === "guru") {
        formData.append("nip", formGuru.nip)
        formData.append("alamat", formGuru.alamat)
        formData.append("jabatan", formGuru.jabatan)
        if (formGuru.tanggalLahir) formData.append("tanggal_lahir", formGuru.tanggalLahir)
        if (formGuru.suratTugas) formData.append("surat_tugas", formGuru.suratTugas)
      } else {
        formData.append("hubungan", formOrtu.hubungan)
        formData.append("nama_anak", formOrtu.namaAnak)
        formData.append("kelas_anak", formOrtu.kelasAnak)
        formData.append("alamat", formOrtu.alamat)
        if (formOrtu.tanggalLahirAnak) formData.append("tanggal_lahir_anak", formOrtu.tanggalLahirAnak)
        if (formOrtu.fotoKtp) formData.append("foto_ktp", formOrtu.fotoKtp)
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/register`, {
        method: "POST",
        headers: { "Accept": "application/json" },
        body: formData,
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || "Pendaftaran gagal.")
        setLoading(false)
        return
      }

      setSubmitted(true)

    } catch {
      setError("Gagal terhubung ke server.")
    }

    setLoading(false)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#1976D2] flex items-center justify-center p-4">
        <div className="bg-[#d9d9d9] rounded-[20px] max-w-md w-full p-10 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={36} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pendaftaran Terkirim!</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-5">
            Data registrasi kamu sudah diterima dan sedang{" "}
            <strong>menunggu verifikasi admin</strong>.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-xs text-yellow-700 text-left mb-6">
            ⏳ Proses verifikasi biasanya memakan waktu <strong>1–2 hari kerja</strong>.
          </div>
          <button
            onClick={() => router.push("/login")}
            className="w-full py-2.5 bg-[#1a7bbf] text-white font-bold text-sm rounded-lg hover:bg-[#155f99] transition"
          >
            Ke Halaman Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#1976D2] flex items-center justify-center p-4 py-8">
      <div className="bg-[#d9d9d9] rounded-[20px] flex overflow-hidden max-w-3xl w-full">

        {/* LEFT */}
        <div className="w-64 shrink-0 bg-[#1976D2] flex flex-col items-center justify-center p-8 text-center gap-4">
          <div className="flex flex-col items-center gap-3">
            <img src="/logo.png" alt="Logo SIMONEV" className="w-27 h-16 object-contain drop-shadow-md" />
            <div className="text-white">
              <p className="font-bold text-lg leading-tight tracking-wide">SIMONEV</p>
              <p className="text-xs text-white/70 leading-tight mt-1">
                Sistem Monitoring dan Evaluasi<br />Perkembangan Anak Usia Dini
              </p>
            </div>
          </div>
          <div className="border-t border-white/20 w-full pt-4">
            <p className="text-xs text-white/60 leading-relaxed">
              Daftarkan akun kamu untuk mengakses sistem. Akun akan diverifikasi admin terlebih dahulu.
            </p>
          </div>
          <a href="/login" className="mt-2 text-xs text-white/80 hover:text-white underline underline-offset-2 transition">
            Sudah punya akun? Masuk
          </a>
        </div>

        {/* RIGHT */}
        <div className="flex-1 p-8 overflow-y-auto max-h-[90vh]">
          <p className="text-lg font-semibold text-gray-800 mb-1">Buat Akun Baru</p>
          <p className="text-xs text-gray-500 mb-5">Lengkapi data di bawah untuk mendaftar</p>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600 mb-4">
              ⚠ {error}
            </div>
          )}

          {/* Pilih Role */}
          <div className="mb-5">
            <label className={labelClass}>Daftar sebagai <span className="text-red-500">*</span></label>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setRole("guru")}
                className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all text-left ${role === "guru" ? "border-[#1a7bbf] bg-blue-50" : "border-gray-300 bg-white hover:border-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${role === "guru" ? "bg-[#1a7bbf]" : "bg-gray-200"}`}>
                  <BookOpen size={15} className={role === "guru" ? "text-white" : "text-gray-500"} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${role === "guru" ? "text-[#1a7bbf]" : "text-gray-700"}`}>Guru</p>
                  <p className="text-xs text-gray-400">Tenaga pengajar</p>
                </div>
              </button>

              <button onClick={() => setRole("ortu")}
                className={`flex items-center gap-3 border-2 rounded-xl px-4 py-3 transition-all text-left ${role === "ortu" ? "border-[#1a7bbf] bg-blue-50" : "border-gray-300 bg-white hover:border-gray-400"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${role === "ortu" ? "bg-[#1a7bbf]" : "bg-gray-200"}`}>
                  <User size={15} className={role === "ortu" ? "text-white" : "text-gray-500"} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${role === "ortu" ? "text-[#1a7bbf]" : "text-gray-700"}`}>Orang Tua</p>
                  <p className="text-xs text-gray-400">Wali murid</p>
                </div>
              </button>
            </div>
          </div>

          {role && (
            <>
              {/* Informasi Akun */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Informasi Akun</p>

                <div>
                  <label className={labelClass}>Nama Lengkap <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Sesuai KTP" className={inputClass}
                    value={role === "guru" ? formGuru.namaLengkap : formOrtu.namaLengkap}
                    onChange={(e) => role === "guru"
                      ? setFormGuru({ ...formGuru, namaLengkap: e.target.value })
                      : setFormOrtu({ ...formOrtu, namaLengkap: e.target.value })} />
                </div>

                <div>
                  <label className={labelClass}>Username <span className="text-red-500">*</span></label>
                  <input type="text" placeholder="Buat username unik" className={inputClass}
                    value={role === "guru" ? formGuru.username : formOrtu.username}
                    onChange={(e) => role === "guru"
                      ? setFormGuru({ ...formGuru, username: e.target.value })
                      : setFormOrtu({ ...formOrtu, username: e.target.value })} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Email <span className="text-red-500">*</span></label>
                    <input type="email" placeholder="email@contoh.com" className={inputClass}
                      value={role === "guru" ? formGuru.email : formOrtu.email}
                      onChange={(e) => role === "guru"
                        ? setFormGuru({ ...formGuru, email: e.target.value })
                        : setFormOrtu({ ...formOrtu, email: e.target.value })} />
                  </div>
                  <div>
                    <label className={labelClass}>No. HP <span className="text-red-500">*</span></label>
                    <input type="tel" placeholder="08xx-xxxx-xxxx" className={inputClass}
                      value={role === "guru" ? formGuru.noHp : formOrtu.noHp}
                      onChange={(e) => role === "guru"
                        ? setFormGuru({ ...formGuru, noHp: e.target.value })
                        : setFormOrtu({ ...formOrtu, noHp: e.target.value })} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className={labelClass}>Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} placeholder="Min. 6 karakter" className={inputClass + " pr-10"}
                        value={role === "guru" ? formGuru.password : formOrtu.password}
                        onChange={(e) => role === "guru"
                          ? setFormGuru({ ...formGuru, password: e.target.value })
                          : setFormOrtu({ ...formOrtu, password: e.target.value })} />
                      <button type="button" onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Konfirmasi Password <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input type={showKonfirmasi ? "text" : "password"} placeholder="Ulangi password" className={inputClass + " pr-10"}
                        value={role === "guru" ? formGuru.konfirmasiPassword : formOrtu.konfirmasiPassword}
                        onChange={(e) => role === "guru"
                          ? setFormGuru({ ...formGuru, konfirmasiPassword: e.target.value })
                          : setFormOrtu({ ...formOrtu, konfirmasiPassword: e.target.value })} />
                      <button type="button" onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        {showKonfirmasi ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Verifikasi */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-4 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                  Data Verifikasi {role === "guru" ? "Guru" : "Orang Tua"}
                </p>

                <div>
                  <label className={labelClass}>NIK (16 digit) <span className="text-red-500">*</span></label>
                  <input type="text" maxLength={16} placeholder="Nomor Induk Kependudukan"
                    className={inputClass + " font-mono tracking-widest"}
                    value={role === "guru" ? formGuru.nik : formOrtu.nik}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "")
                      if (role === "guru") setFormGuru({ ...formGuru, nik: val })
                      else setFormOrtu({ ...formOrtu, nik: val })
                      if (val.length === 16) setNikError("")
                      else if (val.length > 0) setNikError("NIK harus 16 digit angka.")
                      else setNikError("")
                    }} />
                  {nikError && <p className="text-xs text-red-500 mt-1">⚠ {nikError}</p>}
                  {!nikError && (role === "guru" ? formGuru.nik : formOrtu.nik).length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      {(role === "guru" ? formGuru.nik : formOrtu.nik).length}/16 digit
                      {(role === "guru" ? formGuru.nik : formOrtu.nik).length === 16 && (
                        <span className="text-green-500 ml-1">✓ Valid</span>
                      )}
                    </p>
                  )}
                </div>

                {role === "guru" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>NIP <span className="text-gray-400 font-normal">(opsional)</span></label>
                        <input type="text" maxLength={18} placeholder="Kosongkan jika tidak ada"
                          className={inputClass + " font-mono"}
                          value={formGuru.nip}
                          onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, "")
                            setFormGuru({ ...formGuru, nip: val })
                            if (val.length === 0) setNipError("")
                            else if (val.length === 18) setNipError("")
                            else setNipError("NIP harus 18 digit angka.")
                          }} />
                        {nipError && <p className="text-xs text-red-500 mt-1">⚠ {nipError}</p>}
                      </div>
                      <div>
                        <label className={labelClass}>Jabatan <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select className={selectClass} value={formGuru.jabatan}
                            onChange={(e) => setFormGuru({ ...formGuru, jabatan: e.target.value })}>
                            <option value="">Pilih jabatan</option>
                            {jabatanOptions.map((j) => <option key={j}>{j}</option>)}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Tanggal Lahir <span className="text-gray-400 font-normal">(opsional)</span></label>
                      <input type="date" className={inputClass}
                        value={formGuru.tanggalLahir}
                        onChange={(e) => setFormGuru({ ...formGuru, tanggalLahir: e.target.value })} />
                    </div>

                    <div>
                      <label className={labelClass}>Alamat <span className="text-red-500">*</span></label>
                      <textarea rows={2} placeholder="Alamat lengkap sesuai KTP"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-[#1a7bbf] focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder-gray-400"
                        value={formGuru.alamat}
                        onChange={(e) => setFormGuru({ ...formGuru, alamat: e.target.value })} />
                    </div>

                    <div>
                      <label className={labelClass}>Upload Surat Tugas <span className="text-gray-400 font-normal">(opsional)</span></label>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => setFormGuru({ ...formGuru, suratTugas: e.target.files?.[0] ?? null })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1a7bbf] hover:file:bg-blue-100" />
                      <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG — maks. 5MB</p>
                    </div>
                  </>
                )}

                {role === "ortu" && (
                  <>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className={labelClass}>Hubungan dengan Anak <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select className={selectClass} value={formOrtu.hubungan}
                            onChange={(e) => setFormOrtu({ ...formOrtu, hubungan: e.target.value })}>
                            <option value="">Pilih</option>
                            {hubunganOptions.map((h) => <option key={h}>{h}</option>)}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                        </div>
                      </div>
                      <div>
                        {/* ← PERUBAHAN: dropdown kelas dari API */}
                        <label className={labelClass}>Kelas Anak <span className="text-red-500">*</span></label>
                        <div className="relative">
                          <select
                            className={selectClass}
                            value={formOrtu.kelasAnak}
                            disabled={loadingKelas}
                            onChange={(e) => setFormOrtu({ ...formOrtu, kelasAnak: e.target.value })}
                          >
                            <option value="">
                              {loadingKelas ? "Memuat kelas..." : "Pilih kelas"}
                            </option>
                            {kelasOptions.map((k) => <option key={k}>{k}</option>)}
                          </select>
                          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▾</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className={labelClass}>Nama Anak <span className="text-red-500">*</span></label>
                      <input type="text" placeholder="Nama lengkap anak" className={inputClass}
                        value={formOrtu.namaAnak}
                        onChange={(e) => setFormOrtu({ ...formOrtu, namaAnak: e.target.value })} />
                    </div>

                    {/* ← TAMBAHAN: Tanggal Lahir Anak */}
                    <div>
                      <label className={labelClass}>Tanggal Lahir Anak <span className="text-gray-400 font-normal">(opsional)</span></label>
                      <input type="date" className={inputClass}
                        value={formOrtu.tanggalLahirAnak}
                        onChange={(e) => setFormOrtu({ ...formOrtu, tanggalLahirAnak: e.target.value })} />
                    </div>

                    <div>
                      <label className={labelClass}>Alamat Rumah <span className="text-red-500">*</span></label>
                      <textarea rows={2} placeholder="Alamat lengkap sesuai KTP"
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm outline-none focus:border-[#1a7bbf] focus:ring-2 focus:ring-blue-100 transition-all resize-none placeholder-gray-400"
                        value={formOrtu.alamat}
                        onChange={(e) => setFormOrtu({ ...formOrtu, alamat: e.target.value })} />
                    </div>

                    <div>
                      <label className={labelClass}>Upload Foto KTP <span className="text-gray-400 font-normal">(opsional)</span></label>
                      <input type="file" accept=".jpg,.jpeg,.png"
                        onChange={(e) => setFormOrtu({ ...formOrtu, fotoKtp: e.target.files?.[0] ?? null })}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-[#1a7bbf] hover:file:bg-blue-100" />
                      <p className="text-xs text-gray-400 mt-1">JPG, PNG — maks. 5MB</p>
                    </div>
                  </>
                )}
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 text-xs text-[#1a7bbf] leading-relaxed mb-4">
                ℹ️ Akun kamu akan berstatus <strong>Pending</strong> hingga diverifikasi admin.
                Proses membutuhkan <strong>1–2 hari kerja</strong>.
              </div>

              <button onClick={handleSubmit} disabled={loading}
                className="w-full py-2.5 bg-[#1a7bbf] text-white font-bold text-sm rounded-xl hover:bg-[#155f99] transition disabled:opacity-60">
                {loading ? "Mengirim..." : "Kirim Pendaftaran"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}