'use client'

import { Users } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const stats = [
  { label: 'Jumlah anak dengan skala BSB', value: 12, color: 'bg-pink-100 border-pink-200', iconColor: 'text-pink-600', textColor: 'text-pink-800' },
  { label: 'Jumlah anak dengan skala MB', value: 8, color: 'bg-rose-100 border-rose-200', iconColor: 'text-rose-600', textColor: 'text-rose-800' },
  { label: 'Jumlah anak dengan skala BSH', value: 10, color: 'bg-yellow-100 border-yellow-200', iconColor: 'text-yellow-600', textColor: 'text-yellow-800' },
  { label: 'Jumlah Anak dikelas', value: 30, color: 'bg-purple-100 border-purple-200', iconColor: 'text-purple-600', textColor: 'text-purple-800' },
]

// ✅ sama kayak sebelumnya
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
]

const pieData = {
  labels: ['BSB', 'MB', 'BSH'],
  datasets: [
    {
      data: [12, 8, 10],
      backgroundColor: ['#f48fb1', '#ffcc80', '#a5d6a7'],
      borderWidth: 1,
    },
  ],
}

export default function DashboardGuru() {

  return (
    <div>
      {/* Baris atas - 3 kartu */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {stats.slice(0, 3).map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-5 flex flex-col gap-3`}>
            <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.label} :</p>
            <div className="flex items-center gap-3">
              <Users size={32} className={stat.iconColor} />
              <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Baris bawah - 1 kartu + pie chart */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className={`${stats[3].color} border rounded-xl p-5 flex flex-col gap-3`}>
          <p className={`text-sm font-semibold ${stats[3].textColor}`}>{stats[3].label} :</p>
          <div className="flex items-center gap-3">
            <Users size={32} className={stats[3].iconColor} />
            <span className={`text-3xl font-bold ${stats[3].textColor}`}>{stats[3].value}</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-center">
          <div className="w-44 h-44">
            <Pie data={pieData} />
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
  )
}