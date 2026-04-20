"use client";

import { ClipboardList, BarChart2 } from "lucide-react";

const childInfo = {
  namaAnak: "Budi",
  kelas: "TK A",
  guruKelas: "",
  semester: "",
  tahunAjaran: "",
};

const latestProgress = {
  label: "BSH - Berkembang Sesuai Herapan",
  tanggal: "15 Maret 2026",
};

// ✅ DIUBAH: struktur sama kayak admin
const announcements = [
  {
    badge: "Kegiatan",
    badgeColor: "bg-blue-100 text-blue-800",
    title: "Pentas Seni Akhir Tahun 2024/2025",
    postedAt: "Diposting: 18 April 2025",
    body: "Pentas seni akan dilaksanakan pada Sabtu, 24 Mei 2025 pukul 08.00–12.00 WIB.",
  },
  {
    badge: "Libur",
    badgeColor: "bg-green-100 text-green-800",
    title: "Libur Hari Raya Waisak",
    postedAt: "Diposting: 10 April 2025",
    body: "Sekolah diliburkan pada 12 Mei 2025 dan kembali aktif seperti biasa.",
  },
  {
    badge: "Penting",
    badgeColor: "bg-yellow-100 text-yellow-800",
    title: "Pengumpulan Foto Buku Tahunan",
    postedAt: "Diposting: 5 April 2025",
    body: "Mohon orang tua mengumpulkan foto anak sebelum 30 April 2025.",
  },
];

export default function OrangtuaDashboard() {
  return (
    <div>
      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Informasi Anak */}
        <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
          <ClipboardList size={36} className="text-emerald-700 mt-1 flex-shrink-0" />
          <div className="text-sm text-emerald-900 space-y-1">
            <p><span className="font-semibold">Nama Anak :</span> {childInfo.namaAnak}</p>
            <p><span className="font-semibold">Kelas :</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{childInfo.kelas}</p>
            <p><span className="font-semibold">Guru Kelas :</span> {childInfo.guruKelas}</p>
            <p><span className="font-semibold">Semester :</span> {childInfo.semester}</p>
            <p><span className="font-semibold">Tahun Ajaran :</span> {childInfo.tahunAjaran}</p>
          </div>
        </div>

        {/* Perkembangan Terakhir */}
        <div className="bg-rose-100 border border-rose-200 rounded-xl p-5 flex items-start gap-4">
          <BarChart2 size={36} className="text-rose-700 mt-1 flex-shrink-0" />
          <div className="text-sm text-rose-900 space-y-2">
            <p className="font-semibold">Perkembangan Terakhir :</p>
            <p className="font-bold text-base">{latestProgress.label}</p>
            <p>Tanggal : {latestProgress.tanggal}</p>
          </div>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Pengumuman Terbaru</h2>

        <div className="divide-y divide-gray-100">
          {announcements.map((ann, i) => (
            <div key={i} className="py-3 first:pt-0 last:pb-0">
              
              {/* Badge */}
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${ann.badgeColor}`}>
                {ann.badge}
              </span>

              {/* Judul */}
              <p className="text-sm font-bold text-black">{ann.title}</p>

              {/* Tanggal */}
              <p className="text-xs text-gray-600 mb-1">{ann.postedAt}</p>

              {/* Isi */}
              <p className="text-sm text-black">{ann.body}</p>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}