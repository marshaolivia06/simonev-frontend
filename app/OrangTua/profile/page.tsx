"use client";

import { useState, useEffect } from "react";
import { CheckCircle } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
}
function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

export default function ProfilePage() {
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError]             = useState("");

  // user
  const [userId, setUserId]       = useState<number | null>(null);
  const [username, setUsername]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");

  // orang tua
  const [orangTuaId, setOrangTuaId]   = useState<number | null>(null);
  const [namaLengkap, setNamaLengkap] = useState("");
  const [hubungan, setHubungan]       = useState("Ayah");
  const [pekerjaan, setPekerjaan]     = useState("");
  const [telepon, setTelepon]         = useState("");
  const [alamat, setAlamat]           = useState("");

  // anak (read only)
  const [namaAnak, setNamaAnak]           = useState("-");
  const [kelas, setKelas]                 = useState("-");
  const [jenisKelamin, setJenisKelamin]   = useState("-");
  const [tanggalLahir, setTanggalLahir]   = useState("-");

  useEffect(() => {
    fetch(`${API}/profil`, { headers: authHeaders() })
      .then(r => r.json())
      .then(json => {
        if (!json.success) { setError("Gagal memuat profil."); return; }
        const user = json.data;
        setUserId(user.id);
        setUsername(user.username);
        setEmail(user.email);

        const ot = user.orang_tua ?? user.orangTua;
        if (ot) {
          setOrangTuaId(ot.id_orangtua);
          setNamaLengkap(ot.nama_orangtua ?? "");
          setHubungan(ot.hubungan ?? "Ayah");
          setPekerjaan(ot.pekerjaan ?? "");
          setTelepon(ot.no_telp ?? "");
          setAlamat(ot.alamat ?? "");

          // ambil data anak pertama
          const anak = ot.anak?.[0];
          if (anak) {
            setNamaAnak(anak.nama_anak ?? "-");
            setKelas(anak.kelas?.nama_kelas ?? "-");
            setJenisKelamin(anak.jenis_kelamin === "P" ? "Perempuan" : anak.jenis_kelamin === "L" ? "Laki-laki" : "-");
            setTanggalLahir(anak.tanggal_lahir ?? "-");
          }
        }
      })
      .catch(() => setError("Gagal terhubung ke server."))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // 1. Update user (username, email, password)
      const userPayload: Record<string, string> = { username, email };
      if (password) userPayload.password = password;

      const resUser = await fetch(`${API}/profil`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(userPayload),
      });
      const jsonUser = await resUser.json();
      if (!jsonUser.success) { setError(jsonUser.message || "Gagal update akun."); return; }

      // 2. Update data orang tua
      if (orangTuaId) {
        const resOt = await fetch(`${API}/orang-tua/${orangTuaId}`, {
          method: "PUT",
          headers: authHeaders(),
          body: JSON.stringify({
            nama_orangtua: namaLengkap,
            hubungan,
            pekerjaan,
            no_telp: telepon,
            alamat,
            email,
          }),
        });
        const jsonOt = await resOt.json();
        if (!jsonOt.success) { setError(jsonOt.message || "Gagal update data orang tua."); return; }
      }

      setPassword("");
      setShowSuccess(true);
    } catch {
      setError("Gagal terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64 text-gray-400 text-sm">
      Memuat profil...
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* SUCCESS POPUP */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Profil Berhasil Diperbarui
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Perubahan data profil kamu telah tersimpan dan sudah masuk ke data admin.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
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

        {/* SECTION 1: AKUN */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Akun
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Password baru</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Kosongkan jika tidak ingin mengubah"
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: ORANG TUA */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Data Orang Tua / Wali
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Perubahan akan langsung masuk ke data admin.
              </p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
              Dapat diedit
            </span>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Nama Lengkap</label>
                <input
                  type="text"
                  value={namaLengkap}
                  onChange={(e) => setNamaLengkap(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Hubungan dengan Anak</label>
                <select
                  value={hubungan}
                  onChange={(e) => setHubungan(e.target.value)}
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
                >
                  <option value="Ayah">Ayah</option>
                  <option value="Ibu">Ibu</option>
                  <option value="Wali">Wali</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Pekerjaan</label>
              <input
                type="text"
                value={pekerjaan}
                onChange={(e) => setPekerjaan(e.target.value)}
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-600">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <div>
                <label className="text-sm text-gray-600">Nomor Telepon</label>
                <input
                  type="text"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                  required
                  className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Alamat</label>
              <textarea
                value={alamat}
                onChange={(e) => setAlamat(e.target.value)}
                rows={3}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: DATA ANAK */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                Data Anak
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Dikelola oleh admin sekolah. Hubungi admin untuk mengubah.
              </p>
            </div>
            <span className="inline-block px-2.5 py-0.5 bg-gray-100 text-gray-500 rounded-full text-xs font-medium">
              Read only
            </span>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="px-4 py-3 text-gray-500 w-2/5">Nama Anak</td>
                  <td className="px-4 py-3 text-gray-800 font-medium">{namaAnak}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Kelas</td>
                  <td className="px-4 py-3">
                    <span className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {kelas}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Jenis Kelamin</td>
                  <td className="px-4 py-3 text-gray-800">{jenisKelamin}</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-gray-500">Tanggal Lahir</td>
                  <td className="px-4 py-3 text-gray-800">{tanggalLahir}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-500 hover:bg-green-600 disabled:opacity-60 text-white px-8 py-2.5 rounded-lg text-sm font-medium transition active:scale-95"
          >
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
        </div>

      </form>
    </div>
  );
}