"use client";

import { useEffect, useState } from "react";
import { ClipboardList, TrendingUp, Calendar, Star } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
}
function authHeaders() {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

const nilaiColor: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
  BSB: { bg: "bg-green-50",  text: "text-green-700",  ring: "ring-green-300",  badge: "bg-green-500"  },
  BSH: { bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-300", badge: "bg-yellow-500" },
  MB:  { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-300", badge: "bg-orange-500" },
  BB:  { bg: "bg-red-50",    text: "text-red-700",    ring: "ring-red-300",    badge: "bg-red-500"    },
};

const nilaiFullLabel: Record<string, string> = {
  BSB: "Berkembang Sangat Baik",
  BSH: "Berkembang Sesuai Harapan",
  MB:  "Mulai Berkembang",
  BB:  "Belum Berkembang",
};

const badgeColor: Record<string, string> = {
  Kegiatan: "bg-blue-100 text-blue-800",
  Libur:    "bg-green-100 text-green-800",
  Penting:  "bg-yellow-100 text-yellow-800",
  Info:     "bg-purple-100 text-purple-800",
};

// TAMBAHAN
const dotColor: Record<string, string> = {
  Kegiatan: "bg-blue-400",
  Libur:    "bg-green-400",
  Penting:  "bg-yellow-400",
  Info:     "bg-purple-400",
};

export default function OrangtuaDashboard() {
  // anak
  const [namaAnak, setNamaAnak]       = useState("-");
  const [kelas, setKelas]             = useState("-");
  const [guruKelas, setGuruKelas]     = useState("-");
  const [semester] = useState("Semester 1");
  const [tahunAjaran] = useState("2025/2026");
  const [idAnak, setIdAnak]           = useState<number | null>(null);

  // perkembangan terakhir
  const [nilaiLabel, setNilaiLabel]   = useState<string | null>(null);
  const [aspekTerakhir, setAspekTerakhir] = useState("-");
  const [tanggalTerakhir, setTanggalTerakhir] = useState("-");

  // pengumuman
  const [pengumuman, setPengumuman]   = useState<any[]>([]);

  const [loading, setLoading]         = useState(true);

  useEffect(() => {
    const h = authHeaders();

    // 1. Fetch profil untuk dapat data anak
    fetch(`${API}/profil`, { headers: h })
      .then(r => r.json())
      .then(json => {
        if (!json.success) return;
        const ot = json.data.orang_tua ?? json.data.orangTua;
        const anak = ot?.anak?.[0];
        if (anak) {
          setNamaAnak(anak.nama_anak ?? "-");
          setKelas(anak.kelas?.nama_kelas ?? "-");
          setIdAnak(anak.id_anak);

          // ambil wali kelas dari data kelas jika ada
          setGuruKelas(anak.kelas?.wali_kelas ?? "-");

          // 2. Fetch observasi anak untuk perkembangan terakhir
          fetch(`${API}/observasi/anak/${anak.id_anak}?semester=${encodeURIComponent(semester)}`, { headers: h })
            .then(r => r.json())
            .then(obs => {
              if (obs.success && obs.data.riwayat.length > 0) {
                const last = obs.data.riwayat[obs.data.riwayat.length - 1];
                setNilaiLabel(last.nilai ?? null);
                setAspekTerakhir(last.indikator?.aspek?.nama_aspek ?? "-");
                setTanggalTerakhir(last.tanggal ?? "-");
              }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});

    // 3. Fetch pengumuman
    fetch(`${API}/pengumuman`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setPengumuman(json.data.slice(0, 3));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const n = nilaiColor[nilaiLabel ?? ""] ?? nilaiColor["BSH"];

  return (
    <div className="space-y-5">

      {/* GREETING BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-200 to-blue-100 p-6 shadow-sm">
        <div className="relative z-10">
          <p className="text-gray-600 text-sm mb-0.5">
            Selamat datang 👋
          </p>
          <h1 className="text-gray-900 text-2xl font-bold">
            Orang Tua {loading ? "..." : namaAnak}
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            {tahunAjaran} · {semester}
          </p>
        </div>
      </div>

      {/* INFO + PROGRESS */}
      <div className="grid grid-cols-2 gap-4">

        {/* Informasi Anak */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ClipboardList size={18} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-white">Informasi Anak</p>
          </div>

          <div className="px-5 py-4 space-y-0 divide-y divide-gray-100">
            {[
              { label: "Nama Anak",    value: namaAnak },
              { label: "Kelas",        value: kelas },
              { label: "Guru Kelas",   value: guruKelas },
              { label: "Semester",     value: semester },
              { label: "Tahun Ajaran", value: tahunAjaran },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-gray-400 font-medium">{row.label}</span>
                <span className="font-semibold text-gray-800 text-right max-w-[55%] leading-snug">
                  {loading ? "..." : row.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Perkembangan Terakhir */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-white">Perkembangan Terakhir</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-5 py-6">
            {loading ? (
              <p className="text-gray-300 text-sm">Memuat...</p>
            ) : nilaiLabel ? (
              <>
                <div className={`relative w-24 h-24 rounded-full ring-4 ${n.ring} ${n.bg} flex flex-col items-center justify-center shadow-inner`}>
                  <Star size={13} className={`${n.text} mb-0.5`} />
                  <span className={`text-2xl font-extrabold ${n.text} leading-none`}>
                    {nilaiLabel}
                  </span>
                  <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${n.badge} border-2 border-white`} />
                </div>

                <div className="space-y-0.5">
                  <p className="text-sm font-bold text-gray-800 leading-snug">
                    {nilaiFullLabel[nilaiLabel] ?? nilaiLabel}
                  </p>
                  <p className="text-xs text-gray-400 font-medium">
                    Aspek {aspekTerakhir}
                  </p>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-medium">
                  <Calendar size={11} />
                  {tanggalTerakhir}
                </div>
              </>
            ) : (
              <p className="text-gray-300 text-sm">Belum ada penilaian</p>
            )}
          </div>
        </div>
      </div>

      {/* PENGUMUMAN */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-semibold text-gray-800 mb-4">
          Pengumuman Terbaru
        </h2>

        {loading ? (
          <p className="text-sm text-gray-300 text-center py-8">Memuat...</p>
        ) : pengumuman.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">Belum ada pengumuman</p>
        ) : (
          <div className="space-y-4">
            {pengumuman.map((ann: any) => {
              const kat = ann.kategori ?? "Info"
              return (
                <div key={ann.id_pengumuman}
                  className="p-4 rounded-xl border border-gray-100 hover:shadow-sm hover:bg-gray-50 transition">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor[kat] ?? "bg-gray-100 text-gray-700"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor[kat] ?? "bg-gray-400"}`} />
                    {kat}
                  </span>
                  <p className="font-bold text-gray-800 mt-1">{ann.judul_pengumuman}</p>
                  <p className="text-xs text-gray-400 mb-1">{ann.tanggal}</p>
                  <p className="text-sm text-gray-600 leading-relaxed">{ann.isi_pengumuman}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  );
}