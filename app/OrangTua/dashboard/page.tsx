"use client";

import { ClipboardList, TrendingUp, Megaphone, Calendar, Star } from "lucide-react";

const childInfo = {
  namaAnak: "Budi Santoso",
  kelas: "TK A",
  guruKelas: "Bu Sari",
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

const nilaiColor: Record<string, { bg: string; text: string; ring: string }> = {
  BSB: { bg: "bg-green-50", text: "text-green-700", ring: "ring-green-200" },
  BSH: { bg: "bg-yellow-50", text: "text-yellow-700", ring: "ring-yellow-200" },
  MB:  { bg: "bg-orange-50", text: "text-orange-700", ring: "ring-orange-200" },
  BB:  { bg: "bg-red-50", text: "text-red-700", ring: "ring-red-200" },
};

export default function OrangtuaDashboard() {
  const n = nilaiColor[latestProgress.label] ?? nilaiColor["BSH"];

  return (
    <div className="space-y-5">

      {/* GREETING BANNER CLEAN */}
<div className="relative rounded-2xl overflow-hidden bg-[#1976D2] p-6 shadow-lg">

  <div className="relative z-10">
    <p className="text-white/80 text-sm mb-0.5">
      Selamat datang 👋
    </p>

    <h1 className="text-white text-2xl font-bold">
      Orang Tua {childInfo.namaAnak}
    </h1>

    <p className="text-white/70 text-xs mt-1">
      {childInfo.tahunAjaran} · {childInfo.semester}
    </p>
  </div>

</div>

      {/* INFO + PROGRESS */}
      <div className="grid grid-cols-2 gap-4">

        {/* Informasi Anak */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <ClipboardList size={16} className="text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">Informasi Anak</p>
          </div>

          <div className="space-y-2.5">
            {[
              { label: "Nama Anak", value: childInfo.namaAnak },
              { label: "Kelas", value: childInfo.kelas },
              { label: "Guru Kelas", value: childInfo.guruKelas },
              { label: "Semester", value: childInfo.semester },
              { label: "Tahun Ajaran", value: childInfo.tahunAjaran },
            ].map((row) => (
              <div key={row.label} className="flex justify-between text-sm">
                <span className="text-gray-400">{row.label}</span>
                <span className="font-medium text-gray-700">{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
              <TrendingUp size={16} className="text-blue-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700">
              Perkembangan Terakhir
            </p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center text-center gap-3">

            <div className={`w-20 h-20 rounded-full ring-4 ${n.ring} ${n.bg} flex flex-col items-center justify-center`}>
              <Star size={14} className={n.text} />
              <span className={`text-xl font-bold ${n.text}`}>
                {latestProgress.label}
              </span>
            </div>

            <div>
              <p className={`text-sm font-semibold ${n.text}`}>
                {latestProgress.fullLabel}
              </p>
              <p className="text-xs text-gray-400">
                Aspek {latestProgress.aspek}
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
              <Calendar size={11} />
              {latestProgress.tanggal}
            </div>

          </div>
        </div>
      </div>

      {/* PENGUMUMAN */}
<div className="bg-white rounded-2xl p-6 shadow-md">

  <h2 className="font-semibold text-gray-800 mb-4">
    Pengumuman Terbaru
  </h2>

  <div className="space-y-4">

    {announcements.map((ann, i) => (
      <div
        key={i}
        className="
          p-4 rounded-xl
          border border-gray-100
          hover:shadow-sm hover:bg-gray-50
          transition
        "
      >

        {/* badge */}
        <span className={`text-xs px-2 py-1 rounded-full font-semibold ${ann.badgeColor}`}>
          {ann.badge}
        </span>

        {/* title */}
        <p className="font-bold text-gray-800 mt-1">
          {ann.title}
        </p>

        {/* date */}
        <p className="text-xs text-gray-500">
          {ann.postedAt}
        </p>

        {/* body */}
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