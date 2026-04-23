"use client";

import { useState } from "react";
import { User, BookOpen, ChevronDown, Eye, EyeOff, CheckCircle } from "lucide-react";

type Role = "guru" | "ortu" | "";

interface FormGuru {
  namaLengkap: string;
  email: string;
  password: string;
  konfirmasiPassword: string;
  noHp: string;
  nik: string;
  nipNoPegawai: string;
  namaLembaga: string;
  jabatan: string;
  suratTugas: File | null;
}

interface FormOrtu {
  namaLengkap: string;
  email: string;
  password: string;
  konfirmasiPassword: string;
  noHp: string;
  nik: string;
  hubungan: string;
  namaAnak: string;
  kelasAnak: string;
  alamat: string;
  fotoKtp: File | null;
}

const jabatanOptions = ["Guru Kelas", "Guru Mata Pelajaran", "Wali Kelas", "Kepala Sekolah", "Staf Pengajar"];
const hubunganOptions = ["Ayah", "Ibu", "Wali"];
const kelasOptions = ["TK A1", "TK A2", "TK A3", "TK B1", "TK B2", "TK B3", "Playgroup A", "Playgroup B"];

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

export default function RegisterPage() {
  const [role, setRole] = useState<Role>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showKonfirmasi, setShowKonfirmasi] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formGuru, setFormGuru] = useState<FormGuru>({
    namaLengkap: "", email: "", password: "", konfirmasiPassword: "",
    noHp: "", nik: "", nipNoPegawai: "", namaLembaga: "", jabatan: "", suratTugas: null,
  });

  const [formOrtu, setFormOrtu] = useState<FormOrtu>({
    namaLengkap: "", email: "", password: "", konfirmasiPassword: "",
    noHp: "", nik: "", hubungan: "", namaAnak: "", kelasAnak: "", alamat: "", fotoKtp: null,
  });

  const handleSubmit = () => {
    // Validasi sederhana
    const form = role === "guru" ? formGuru : formOrtu;
    if (!form.namaLengkap || !form.email || !form.password || !form.noHp || !form.nik) {
      alert("Harap lengkapi semua field yang wajib diisi.");
      return;
    }
    if (form.password !== form.konfirmasiPassword) {
      alert("Password dan konfirmasi password tidak sama.");
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl border border-gray-200 p-10 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Pendaftaran Terkirim!</h2>
          <p className="text-sm text-gray-500 leading-relaxed mb-6">
            Data registrasi kamu sudah diterima dan sedang <strong>menunggu verifikasi admin</strong>.
            Kamu akan dihubungi melalui email atau nomor HP yang didaftarkan setelah akun disetujui.
          </p>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-xs text-yellow-700 text-left">
            ⏳ Proses verifikasi biasanya memakan waktu <strong>1–2 hari kerja</strong>.
            Pastikan data yang kamu masukkan benar dan dapat diverifikasi.
          </div>
          <button
            onClick={() => { setSubmitted(false); setRole(""); }}
            className="mt-6 text-sm text-blue-500 hover:text-blue-600 font-medium"
          >
            ← Kembali ke halaman registrasi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Daftar Akun</h1>
          <p className="text-sm text-gray-500 mt-1">
            Akun akan diverifikasi admin sebelum dapat digunakan
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 space-y-5">

          {/* Pilih Role */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Daftar sebagai <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setRole("guru")}
                className={`flex flex-col items-center gap-2 border-2 rounded-xl py-4 px-3 transition-all ${
                  role === "guru"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${role === "guru" ? "bg-blue-100" : "bg-gray-200"}`}>
                  <BookOpen size={18} />
                </div>
                <span className="text-sm font-semibold">Guru</span>
                <span className="text-xs text-center leading-tight opacity-70">Tenaga pengajar atau staf sekolah</span>
              </button>

              <button
                onClick={() => setRole("ortu")}
                className={`flex flex-col items-center gap-2 border-2 rounded-xl py-4 px-3 transition-all ${
                  role === "ortu"
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 bg-gray-50 text-gray-500 hover:border-gray-300"
                }`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center ${role === "ortu" ? "bg-blue-100" : "bg-gray-200"}`}>
                  <User size={18} />
                </div>
                <span className="text-sm font-semibold">Orang Tua / Wali</span>
                <span className="text-xs text-center leading-tight opacity-70">Orang tua atau wali murid</span>
              </button>
            </div>
          </div>

          {/* Form muncul setelah pilih role */}
          {role && (
            <>
              <hr className="border-gray-200" />

              {/* ===== FIELD UMUM ===== */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Informasi Akun</p>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Sesuai KTP"
                  value={role === "guru" ? formGuru.namaLengkap : formOrtu.namaLengkap}
                  onChange={(e) =>
                    role === "guru"
                      ? setFormGuru({ ...formGuru, namaLengkap: e.target.value })
                      : setFormOrtu({ ...formOrtu, namaLengkap: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                />
              </div>

              {/* Email & No HP */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="email@contoh.com"
                    value={role === "guru" ? formGuru.email : formOrtu.email}
                    onChange={(e) =>
                      role === "guru"
                        ? setFormGuru({ ...formGuru, email: e.target.value })
                        : setFormOrtu({ ...formOrtu, email: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    No. HP <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    placeholder="08xx-xxxx-xxxx"
                    value={role === "guru" ? formGuru.noHp : formOrtu.noHp}
                    onChange={(e) =>
                      role === "guru"
                        ? setFormGuru({ ...formGuru, noHp: e.target.value })
                        : setFormOrtu({ ...formOrtu, noHp: e.target.value })
                    }
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Min. 8 karakter"
                      value={role === "guru" ? formGuru.password : formOrtu.password}
                      onChange={(e) =>
                        role === "guru"
                          ? setFormGuru({ ...formGuru, password: e.target.value })
                          : setFormOrtu({ ...formOrtu, password: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pr-10"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Konfirmasi Password <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showKonfirmasi ? "text" : "password"}
                      placeholder="Ulangi password"
                      value={role === "guru" ? formGuru.konfirmasiPassword : formOrtu.konfirmasiPassword}
                      onChange={(e) =>
                        role === "guru"
                          ? setFormGuru({ ...formGuru, konfirmasiPassword: e.target.value })
                          : setFormOrtu({ ...formOrtu, konfirmasiPassword: e.target.value })
                      }
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pr-10"
                    />
                    <button type="button" onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showKonfirmasi ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <hr className="border-gray-200" />

              {/* ===== FIELD VERIFIKASI IDENTITAS ===== */}
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                Data Verifikasi {role === "guru" ? "Guru" : "Orang Tua / Wali"}
              </p>
              <p className="text-xs text-gray-400 -mt-3">
                Data ini digunakan admin untuk memverifikasi identitas dan peran kamu.
              </p>

              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK (Nomor Induk Kependudukan) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="16 digit sesuai KTP"
                  value={role === "guru" ? formGuru.nik : formOrtu.nik}
                  onChange={(e) =>
                    role === "guru"
                      ? setFormGuru({ ...formGuru, nik: e.target.value })
                      : setFormOrtu({ ...formOrtu, nik: e.target.value })
                  }
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 font-mono tracking-widest"
                />
              </div>

              {/* ===== KHUSUS GURU ===== */}
              {role === "guru" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        NIP / No. Pegawai
                        <span className="text-gray-400 font-normal"> (opsional)</span>
                      </label>
                      <input
                        type="text"
                        placeholder="Kosongkan jika tidak ada"
                        value={formGuru.nipNoPegawai}
                        onChange={(e) => setFormGuru({ ...formGuru, nipNoPegawai: e.target.value })}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Jabatan <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formGuru.jabatan}
                          onChange={(e) => setFormGuru({ ...formGuru, jabatan: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 appearance-none pr-8"
                        >
                          <option value="">Pilih jabatan</option>
                          {jabatanOptions.map((j) => <option key={j}>{j}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Lembaga / Sekolah <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: TK Permata Bangsa"
                      value={formGuru.namaLembaga}
                      onChange={(e) => setFormGuru({ ...formGuru, namaLembaga: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Surat Tugas Mengajar
                      <span className="text-gray-400 font-normal"> (opsional, sangat disarankan)</span>
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => setFormGuru({ ...formGuru, suratTugas: e.target.files?.[0] ?? null })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Format: PDF, JPG, PNG. Maks. 5MB</p>
                  </div>
                </>
              )}

              {/* ===== KHUSUS ORANG TUA ===== */}
              {role === "ortu" && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Hubungan dengan Anak <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formOrtu.hubungan}
                          onChange={(e) => setFormOrtu({ ...formOrtu, hubungan: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 appearance-none pr-8"
                        >
                          <option value="">Pilih</option>
                          {hubunganOptions.map((h) => <option key={h}>{h}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Kelas Anak <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={formOrtu.kelasAnak}
                          onChange={(e) => setFormOrtu({ ...formOrtu, kelasAnak: e.target.value })}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 appearance-none pr-8"
                        >
                          <option value="">Pilih kelas</option>
                          {kelasOptions.map((k) => <option key={k}>{k}</option>)}
                        </select>
                        <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                          <ChevronDownIcon />
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nama Anak <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Nama lengkap anak"
                      value={formOrtu.namaAnak}
                      onChange={(e) => setFormOrtu({ ...formOrtu, namaAnak: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alamat Rumah <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Alamat lengkap sesuai KTP"
                      value={formOrtu.alamat}
                      onChange={(e) => setFormOrtu({ ...formOrtu, alamat: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Upload Foto KTP
                      <span className="text-gray-400 font-normal"> (opsional, sangat disarankan)</span>
                    </label>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => setFormOrtu({ ...formOrtu, fotoKtp: e.target.files?.[0] ?? null })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm bg-gray-50 file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <p className="text-xs text-gray-400 mt-1">Format: JPG, PNG. Maks. 5MB</p>
                  </div>
                </>
              )}

              {/* Catatan */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-3 text-xs text-blue-700 leading-relaxed">
                ℹ️ Setelah mendaftar, akun kamu akan berstatus <strong>Pending</strong> hingga diverifikasi
                oleh admin. Proses verifikasi membutuhkan waktu <strong>1–2 hari kerja</strong>.
              </div>

              {/* Tombol Daftar */}
              <button
                onClick={handleSubmit}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg text-sm transition-colors shadow-sm"
              >
                Kirim Pendaftaran
              </button>

              <p className="text-center text-xs text-gray-400">
                Sudah punya akun?{" "}
                <a href="/login" className="text-blue-500 hover:underline font-medium">Masuk di sini</a>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}