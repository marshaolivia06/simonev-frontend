'use client'

import { Users } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const stats = [
  { label: 'Belum Berkembang (BB)', value: 5, color: 'from-red-200 to-red-100', iconColor: 'text-red-600' },
  { label: 'Mulai Berkembang (MB)', value: 8, color: 'from-orange-200 to-orange-100', iconColor: 'text-orange-600' },
  { label: 'Berkembang Sesuai Harapan (BSH)', value: 10, color: 'from-yellow-200 to-yellow-100', iconColor: 'text-yellow-600' },
  { label: 'Berkembang Sangat Baik (BSB)', value: 12, color: 'from-green-200 to-green-100', iconColor: 'text-green-600' },
]

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
]

const pieData = {
  labels: ['BB', 'MB', 'BSH', 'BSB'],
  datasets: [
    {
      data: [5, 8, 10, 12],
      backgroundColor: [
        '#fca5a5',
        '#fdba74',
        '#93c5fd',
        '#86efac',
      ],
      borderWidth: 0,
    },
  ],
}

export default function DashboardGuru() {
  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Guru!</h1>
        <p className="text-sm text-gray-500">Ringkasan perkembangan anak dan informasi terbaru</p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`bg-gradient-to-br ${stat.color} rounded-2xl p-5 shadow-md hover:shadow-lg transition`}
          >
            <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
              <Users size={28} className={stat.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* CHART + TOTAL */}
      <div className="grid grid-cols-3 gap-4">

        {/* TOTAL — sekarang di kiri */}
        <div className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-2xl p-6 shadow-md flex flex-col justify-center items-center">
          <Users size={40} className="text-purple-600 mb-2" />
          <p className="text-sm text-gray-700">Total Anak</p>
          <p className="text-3xl font-bold text-gray-800">30</p>
        </div>

        {/* CHART — sekarang di kanan */}
        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Distribusi Perkembangan Anak
          </h2>
          <div className="flex justify-center">
            <div className="w-60 h-60">
              <Pie data={pieData} />
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
              className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition"
            >
              <span className={`text-xs px-2 py-1 rounded-full font-semibold ${ann.badgeColor}`}>
                {ann.badge}
              </span>
              <p className="font-bold text-gray-800 mt-1">{ann.title}</p>
              <p className="text-xs text-gray-500">{ann.postedAt}</p>
              <p className="text-sm text-gray-700 mt-1">{ann.body}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
