"use client";

import { ClipboardList, TrendingUp, Calendar, Star } from "lucide-react";

const childInfo = {
  namaAnak: "Aisyah Putri Lestari",
  kelas: "TK A",
  guruKelas: "Bu Sari, S.Pd",
  semester: "Semester 1",
  tahunAjaran: "2025/2026",
};

const latestProgress = {
  label: "BSH",
  fullLabel: "Berkembang Sesuai Harapan",
  tanggal: "15 Maret 2026",
  aspek: "Bahasa",
};

const announcements = [
  {
    badge: "Kegiatan",
    badgeColor: "bg-blue-100 text-blue-800",
    title: "Pentas Seni Akhir Tahun 2024/2025",
    postedAt: "18 April 2025",
    body: "Pentas seni akan dilaksanakan pada Sabtu, 24 Mei 2025 pukul 08.00–12.00 WIB.",
  },
  {
    badge: "Libur",
    badgeColor: "bg-green-100 text-green-800",
    title: "Libur Hari Raya Waisak",
    postedAt: "10 April 2025",
    body: "Sekolah diliburkan pada 12 Mei 2025 dan kembali aktif seperti biasa.",
  },
  {
    badge: "Penting",
    badgeColor: "bg-yellow-100 text-yellow-800",
    title: "Pengumpulan Foto Buku Tahunan",
    postedAt: "5 April 2025",
    body: "Mohon orang tua mengumpulkan foto anak sebelum 30 April 2025.",
  },
];

const nilaiColor: Record<string, { bg: string; text: string; ring: string; badge: string }> = {
  BSB: { bg: "bg-green-50",  text: "text-green-700",  ring: "ring-green-300",  badge: "bg-green-500"  },
  BSH: { bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-300", badge: "bg-yellow-500" },
  MB:  { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-300", badge: "bg-orange-500" },
  BB:  { bg: "bg-red-50",    text: "text-red-700",    ring: "ring-red-300",    badge: "bg-red-500"    },
};

export default function OrangtuaDashboard() {
  const n = nilaiColor[latestProgress.label] ?? nilaiColor["BSH"];

  return (
    <div className="space-y-5">

      {/* GREETING BANNER */}
      <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-200 to-blue-100 p-6 shadow-sm">
        <div className="relative z-10">
          <p className="text-gray-600 text-sm mb-0.5">
            Selamat datang 👋
          </p>
          <h1 className="text-gray-900 text-2xl font-bold">
            Orang Tua {childInfo.namaAnak}
          </h1>
          <p className="text-gray-500 text-xs mt-1">
            {childInfo.tahunAjaran} · {childInfo.semester}
          </p>
        </div>
      </div>

      {/* INFO + PROGRESS */}
      <div className="grid grid-cols-2 gap-4">

        {/* Informasi Anak */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <ClipboardList size={18} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-white">Informasi Anak</p>
          </div>

          {/* Card Body */}
          <div className="px-5 py-4 space-y-0 divide-y divide-gray-100">
            {[
              { label: "Nama Anak",    value: childInfo.namaAnak },
              { label: "Kelas",        value: childInfo.kelas },
              { label: "Guru Kelas",   value: childInfo.guruKelas },
              { label: "Semester",     value: childInfo.semester },
              { label: "Tahun Ajaran", value: childInfo.tahunAjaran },
            ].map((row) => (
              <div key={row.label} className="flex justify-between items-center py-2.5 text-sm">
                <span className="text-gray-400 font-medium">{row.label}</span>
                <span className="font-semibold text-gray-800 text-right max-w-[55%] leading-snug">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Perkembangan Terakhir */}
        <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-sm flex flex-col">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-400 px-5 py-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <TrendingUp size={18} className="text-white" />
            </div>
            <p className="text-sm font-semibold text-white">Perkembangan Terakhir</p>
          </div>

          {/* Card Body */}
          <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 px-5 py-6">

            {/* Badge nilai besar */}
            <div className={`relative w-24 h-24 rounded-full ring-4 ${n.ring} ${n.bg} flex flex-col items-center justify-center shadow-inner`}>
              <Star size={13} className={`${n.text} mb-0.5`} />
              <span className={`text-2xl font-extrabold ${n.text} leading-none`}>
                {latestProgress.label}
              </span>
              {/* dot accent */}
              <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full ${n.badge} border-2 border-white`} />
            </div>

            <div className="space-y-0.5">
              <p className="text-sm font-bold text-gray-800 leading-snug">
                {latestProgress.fullLabel}
              </p>
              <p className="text-xs text-gray-400 font-medium">
                Aspek {latestProgress.aspek}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-full font-medium">
              <Calendar size={11} />
              {latestProgress.tanggal}
            </div>

          </div>
        </div>
      </div>

      {/* PENGUMUMAN — tidak diubah */}
      <div className="bg-white rounded-2xl p-6 shadow-md">

        <h2 className="font-semibold text-gray-800 mb-4">
          Pengumuman Terbaru
        </h2>

        <div className="space-y-4">
          {announcements.map((ann, i) => (
            <div
              key={i}
              className="p-4 rounded-xl border border-gray-100 hover:shadow-sm hover:bg-gray-50 transition"
            >
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${ann.badgeColor}`}>
                {ann.badge}
              </span>

              <p className="font-bold text-gray-800 mt-1">
                {ann.title}
              </p>

              <p className="text-xs text-gray-500">
                {ann.postedAt}
              </p>

              <p className="text-sm text-gray-700 mt-1 leading-relaxed">
                {ann.body}
              </p>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}