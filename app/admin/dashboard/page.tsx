"use client";

import { Users, School, GraduationCap } from "lucide-react";

const stats = [
  { label: "Jumlah Guru", value: 12, icon: Users, color: "bg-emerald-100 border-emerald-200", iconColor: "text-emerald-600", textColor: "text-emerald-800" },
  { label: "Jumlah Kelas", value: 6, icon: School, color: "bg-rose-100 border-rose-200", iconColor: "text-rose-600", textColor: "text-rose-800" },
  { label: "Jumlah Anak", value: 148, icon: GraduationCap, color: "bg-yellow-100 border-yellow-200", iconColor: "text-yellow-600", textColor: "text-yellow-800" },
  { label: "Jumlah Anak TK A", value: 72, icon: Users, color: "bg-purple-100 border-purple-200", iconColor: "text-purple-600", textColor: "text-purple-800" },
  { label: "Jumlah Anak TK B", value: 76, icon: Users, color: "bg-orange-100 border-orange-200", iconColor: "text-orange-600", textColor: "text-orange-800" },
];

const announcements = [
  {
    badge: "Kegiatan",
    badgeColor: "bg-blue-100 text-blue-800",
    title: "Pentas Seni Akhir Tahun Ajaran 2024/2025",
    postedAt: "Diposting: 18 April 2025",
    body: "Pentas seni akan dilaksanakan pada Sabtu, 24 Mei 2025 pukul 08.00–12.00 WIB. Orang tua/wali murid diundang untuk hadir. Info kostum menyusul.",
  },
  {
    badge: "Libur",
    badgeColor: "bg-green-100 text-green-800",
    title: "Libur Hari Raya Waisak",
    postedAt: "Diposting: 10 April 2025",
    body: "Sekolah diliburkan pada Kamis, 12 Mei 2025 dalam rangka Hari Raya Waisak. Kegiatan belajar kembali normal pada Jumat, 13 Mei 2025.",
  },
  {
    badge: "Penting",
    badgeColor: "bg-yellow-100 text-yellow-800",
    title: "Pengumpulan Foto untuk Buku Tahunan",
    postedAt: "Diposting: 5 April 2025",
    body: "Mohon orang tua mengumpulkan 3 foto terbaik anak (format JPG, min. 1MB) kepada wali kelas masing-masing paling lambat 30 April 2025.",
  },
];

export default function AdminDashboard() {
  return (
    <div>
      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {stats.slice(0, 3).map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-5 flex flex-col gap-3`}>
            <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.label} :</p>
            <div className="flex items-center gap-3">
              <stat.icon size={32} className={stat.iconColor} />
              <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.slice(3).map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-5 flex flex-col gap-3`}>
            <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.label} :</p>
            <div className="flex items-center gap-3">
              <stat.icon size={32} className={stat.iconColor} />
              <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pengumuman */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        <div className="divide-y divide-gray-100">
          {announcements.map((ann, i) => (
            <div key={i} className="py-3 first:pt-0 last:pb-0">
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${ann.badgeColor}`}>
                {ann.badge}
              </span>
              <p className="text-sm font-semibold text-gray-800">{ann.title}</p>
              <p className="text-xs text-gray-400 mb-1">{ann.postedAt}</p>
              <p className="text-sm text-gray-600">{ann.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}