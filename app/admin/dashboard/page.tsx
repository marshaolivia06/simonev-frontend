"use client";

import { Users, School, GraduationCap, ShieldCheck } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

/* ── Stat cards ── */
const stats = [
  { label: "Jumlah Guru",       value: 12,  color: "from-emerald-200 to-emerald-100", iconColor: "text-emerald-600", icon: Users },
  { label: "Jumlah Kelas",      value: 8,   color: "from-rose-200 to-rose-100",       iconColor: "text-rose-600",    icon: School },
  { label: "Total Anak",        value: 148, color: "from-blue-200 to-blue-100",       iconColor: "text-blue-600",    icon: GraduationCap },
  { label: "Akun Perlu Verifikasi", value: 3, color: "from-yellow-200 to-yellow-100", iconColor: "text-yellow-600",  icon: ShieldCheck },
];

/* ── Distribusi tingkat perkembangan seluruh anak ── */
const distribusiData = {
  labels: ["BB", "MB", "BSH", "BSB"],
  datasets: [
    {
      data: [8, 22, 75, 43],
      backgroundColor: ["#fca5a5", "#fdba74", "#93c5fd", "#86efac"],
      borderWidth: 0,
    },
  ],
};

const distribusiDetail = [
  { label: "Belum Berkembang (BB)",           value: 8,  color: "bg-red-100 text-red-700" },
  { label: "Mulai Berkembang (MB)",           value: 22, color: "bg-orange-100 text-orange-700" },
  { label: "Berkembang Sesuai Harapan (BSH)", value: 75, color: "bg-blue-100 text-blue-700" },
  { label: "Berkembang Sangat Baik (BSB)",    value: 43, color: "bg-green-100 text-green-700" },
];

/* ── Pengumuman ── */
const announcements = [
  {
    badge: "Kegiatan",
    badgeColor: "bg-blue-100 text-blue-800",
    dot: "bg-blue-400",
    title: "Pentas Seni Akhir Tahun 2024/2025",
    postedAt: "18 April 2025",
    body: "Pentas seni akan dilaksanakan pada Sabtu, 24 Mei 2025 pukul 08.00–12.00 WIB.",
  },
  {
    badge: "Libur",
    badgeColor: "bg-green-100 text-green-800",
    dot: "bg-green-400",
    title: "Libur Hari Raya Waisak",
    postedAt: "10 April 2025",
    body: "Sekolah diliburkan pada 12 Mei 2025 dan kembali aktif seperti biasa.",
  },
  {
    badge: "Penting",
    badgeColor: "bg-yellow-100 text-yellow-800",
    dot: "bg-yellow-400",
    title: "Pengumpulan Foto Buku Tahunan",
    postedAt: "5 April 2025",
    body: "Mohon orang tua mengumpulkan foto anak sebelum 30 April 2025.",
  },
];

export default function DashboardAdmin() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Admin!</h1>
        <p className="text-sm text-gray-500">Ringkasan data sekolah dan informasi terbaru</p>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-md hover:shadow-lg transition`}>
            <p className="text-sm font-medium text-gray-700">{s.label}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-3xl font-bold text-gray-800">{s.value}</span>
              <s.icon size={28} className={s.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* DISTRIBUSI + LEGENDA */}
      <div className="grid grid-cols-3 gap-4">

        {/* Legenda distribusi */}
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-center space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-1">Distribusi Perkembangan</p>
          {distribusiDetail.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 flex-1">{d.label}</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${d.color}`}>{d.value}</span>
            </div>
          ))}
        </div>

        {/* Pie chart */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Grafik Perkembangan Seluruh Anak
          </h2>
          <div className="flex justify-center">
            <div className="w-56 h-56">
              <Pie
                data={distribusiData}
                options={{
                  plugins: {
                    legend: {
                      position: "right",
                      labels: { boxWidth: 12, font: { size: 11 } },
                    },
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* PENGUMUMAN */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-semibold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        <div className="space-y-4">
          {announcements.map((ann, i) => (
            <div key={i} className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
              <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${ann.badgeColor}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${ann.dot}`} />
                {ann.badge}
              </span>
              <p className="font-bold text-gray-800 mt-1">{ann.title}</p>
              <p className="text-xs text-gray-400 mb-1">{ann.postedAt}</p>
              <p className="text-sm text-gray-600">{ann.body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}