'use client'

import { useEffect, useState, useCallback } from 'react'
import { Users, X, AlertCircle, TrendingUp, CheckCircle2, Award } from 'lucide-react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { Pie } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend)

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://127.0.0.1:8000/api'

function getToken() { return typeof window !== 'undefined' ? localStorage.getItem('token') ?? '' : '' }
function authHeaders(): HeadersInit {
  return { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` }
}

interface DashboardData {
  nama_kelas: string
  total_anak: number
  BB: number
  MB: number
  BSH: number
  BSB: number
  belum_dinilai: number
}

interface Pengumuman {
  id: number
  judul: string
  kategori: string
  tanggal: string
  posting: string
  isi: string
}

// Tipe data anak yang ditampilkan di modal
interface AnakSkala {
  id_anak: number
  nama_anak: string
  nama_kelas?: string
}

function fromApiPengumuman(item: Record<string, unknown>): Pengumuman {
  const createdAt = item.created_at as string | undefined
  const posting = createdAt
    ? 'Diposting: ' + new Date(createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : ''
  return {
    id: item.id_pengumuman as number,
    judul: item.judul_pengumuman as string,
    kategori: (item.kategori as string) ?? 'Info',
    tanggal: item.tanggal as string,
    posting,
    isi: item.isi_pengumuman as string,
  }
}

// DIUBAH: badge & dot color ditambah seperti dashboard admin
const badgeColor: Record<string, string> = {
  Kegiatan: 'bg-blue-100 text-blue-800',
  Libur:    'bg-green-100 text-green-800',
  Penting:  'bg-yellow-100 text-yellow-800',
  Info:     'bg-purple-100 text-purple-800',
}
const dotColor: Record<string, string> = {
  Kegiatan: 'bg-blue-400',
  Libur:    'bg-green-400',
  Penting:  'bg-yellow-400',
  Info:     'bg-purple-400',
}

// Label lengkap untuk judul modal
const skalaLabel: Record<string, string> = {
  BB: 'Belum Berkembang (BB)',
  MB: 'Mulai Berkembang (MB)',
  BSH: 'Berkembang Sesuai Harapan (BSH)',
  BSB: 'Berkembang Sangat Baik (BSB)',
}

// Tema visual modal per skala: gradasi header, warna avatar, & icon
const skalaTheme: Record<string, {
  gradient: string
  avatarBg: string
  avatarText: string
  ring: string
  icon: React.ComponentType<{ size?: number; className?: string }>
}> = {
  BB:  { gradient: 'from-red-500 to-rose-400',     avatarBg: 'bg-red-100',    avatarText: 'text-red-600',    ring: 'ring-red-100',    icon: AlertCircle },
  MB:  { gradient: 'from-orange-500 to-amber-400', avatarBg: 'bg-orange-100', avatarText: 'text-orange-600', ring: 'ring-orange-100', icon: TrendingUp },
  BSH: { gradient: 'from-yellow-400 to-amber-300', avatarBg: 'bg-yellow-100', avatarText: 'text-yellow-700', ring: 'ring-yellow-100', icon: CheckCircle2 },
  BSB: { gradient: 'from-green-500 to-emerald-400',avatarBg: 'bg-green-100',  avatarText: 'text-green-600',  ring: 'ring-green-100',  icon: Award },
}

export default function DashboardGuru() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [pengumuman, setPengumuman] = useState<Pengumuman[]>([])
  const [loadingDashboard, setLoadingDashboard] = useState(true)
  const [loadingPengumuman, setLoadingPengumuman] = useState(true)

  // State untuk modal daftar anak per skala
  const [selectedSkala, setSelectedSkala] = useState<string | null>(null)
  const [anakList, setAnakList] = useState<AnakSkala[]>([])
  const [loadingAnak, setLoadingAnak] = useState(false)

  const fetchDashboard = useCallback(async () => {
    setLoadingDashboard(true)
    try {
      const res = await fetch(`${API_BASE}/dashboard-guru`, { headers: authHeaders() })
      const json = await res.json()
      if (json.success) setDashboard(json.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingDashboard(false)
    }
  }, [])

  const fetchPengumuman = useCallback(async () => {
    setLoadingPengumuman(true)
    try {
      const res = await fetch(`${API_BASE}/pengumuman`)
      const json = await res.json()
      if (json.data) setPengumuman((json.data as Record<string, unknown>[]).map(fromApiPengumuman).slice(0, 3))
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingPengumuman(false)
    }
  }, [])

  useEffect(() => {
    fetchDashboard()
    fetchPengumuman()
  }, [fetchDashboard, fetchPengumuman])

  // Fetch daftar anak berdasarkan skala yang diklik
  const fetchAnakBySkala = useCallback(async (skala: string) => {
    setSelectedSkala(skala)
    setLoadingAnak(true)
    setAnakList([])
    try {
      const res = await fetch(`${API_BASE}/dashboard-guru/anak-by-skala?skala=${skala}`, { headers: authHeaders() })
      const json = await res.json()
      if (json.success) setAnakList(json.data ?? [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoadingAnak(false)
    }
  }, [])

  const closeModal = () => {
    setSelectedSkala(null)
    setAnakList([])
  }

  const stats = [
    { key: 'BB',  label: 'Belum Berkembang (BB)',           value: dashboard?.BB ?? 0,  color: 'from-red-200 to-red-100',       iconColor: 'text-red-600'    },
    { key: 'MB',  label: 'Mulai Berkembang (MB)',           value: dashboard?.MB ?? 0,  color: 'from-orange-200 to-orange-100', iconColor: 'text-orange-600' },
    { key: 'BSH', label: 'Berkembang Sesuai Harapan (BSH)', value: dashboard?.BSH ?? 0, color: 'from-yellow-200 to-yellow-100', iconColor: 'text-yellow-600' },
    { key: 'BSB', label: 'Berkembang Sangat Baik (BSB)',    value: dashboard?.BSB ?? 0, color: 'from-green-200 to-green-100',   iconColor: 'text-green-600'  },
  ]

  const pieData = {
    labels: ['BB', 'MB', 'BSH', 'BSB', 'Belum Dinilai'],
    datasets: [
      {
        data: [dashboard?.BB ?? 0, dashboard?.MB ?? 0, dashboard?.BSH ?? 0, dashboard?.BSB ?? 0, dashboard?.belum_dinilai ?? 0,],
        backgroundColor: ['#fca5a5', '#fdba74', '#93c5fd', '#86efac', '#e5e7eb'],
        borderWidth: 0,
      },
    ],
  }

  return (
    <div className="space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Guru!</h1>
        <p className="text-sm text-gray-500">
          Ringkasan perkembangan anak dan informasi terbaru
          {dashboard?.nama_kelas && <span className="ml-1 font-medium text-gray-700">— Kelas {dashboard.nama_kelas}</span>}
        </p>
      </div>

      {/* STATS */}
      {loadingDashboard ? (
        <div className="grid grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-2xl p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <button
              key={stat.key}
              type="button"
              onClick={() => fetchAnakBySkala(stat.key)}
              className={`text-left bg-gradient-to-br ${stat.color} rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer`}
            >
              <p className="text-sm text-gray-700 font-medium">{stat.label}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-3xl font-bold text-gray-800">{stat.value}</span>
                <Users size={28} className={stat.iconColor} />
              </div>
            </button>
          ))}
        </div>
      )}

      {/* CHART + TOTAL */}
      <div className="grid grid-cols-3 gap-4">

        {/* TOTAL */}
        <div className="bg-gradient-to-br from-purple-200 to-purple-100 rounded-2xl p-6 shadow-md flex flex-col justify-center items-center">
          <Users size={40} className="text-purple-600 mb-2" />
          <p className="text-sm text-gray-700">Total Anak</p>
          {loadingDashboard
            ? <div className="w-12 h-8 bg-purple-200 rounded animate-pulse mt-1" />
            : <p className="text-3xl font-bold text-gray-800">{dashboard?.total_anak ?? 0}</p>
          }
        </div>

        {/* CHART */}
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

      {/* PENGUMUMAN — disamakan dengan dashboard admin */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-semibold text-gray-800 mb-4">Pengumuman Terbaru</h2>

        {loadingPengumuman ? (
          <p className="text-sm text-gray-300 text-center py-8">Memuat...</p>
        ) : pengumuman.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">Belum ada pengumuman</p>
        ) : (
          <div className="space-y-4">
            {pengumuman.map((ann) => {
              const kat = ann.kategori ?? 'Info'
              return (
                <div key={ann.id}
                  className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor[kat] ?? 'bg-gray-100 text-gray-700'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor[kat] ?? 'bg-gray-400'}`} />
                    {kat}
                  </span>
                  <p className="font-bold text-gray-800 mt-1">{ann.judul}</p>
                  <p className="text-xs text-gray-400 mb-1">{ann.tanggal}</p>
                  <p className="text-sm text-gray-600">{ann.isi}</p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* MODAL DAFTAR ANAK PER SKALA */}
      {selectedSkala && (() => {
        const theme = skalaTheme[selectedSkala]
        const Icon = theme.icon
        return (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.15s_ease-out]"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-[scaleIn_0.18s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER GRADIEN */}
              <div className={`bg-gradient-to-r ${theme.gradient} p-5 relative`}>
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition"
                >
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
                    <Icon size={22} className="text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-base leading-tight">
                      {skalaLabel[selectedSkala] ?? selectedSkala}
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      {loadingAnak ? 'Memuat data...' : `${anakList.length} anak`}
                    </p>
                  </div>
                </div>
              </div>

              {/* LIST ANAK */}
              <div className="p-4 overflow-y-auto">
                {loadingAnak ? (
                  <div className="space-y-2">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : anakList.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className={`w-12 h-12 rounded-full ${theme.avatarBg} flex items-center justify-center mb-3`}>
                      <Icon size={22} className={theme.avatarText} />
                    </div>
                    <p className="text-sm text-gray-400">
                      Belum ada anak dengan skala ini
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-1.5">
                    {anakList.map((anak, idx) => (
                      <li
                        key={anak.id_anak}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition"
                      >
                        <span className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full ${theme.avatarBg} ${theme.avatarText} ring-4 ${theme.ring} text-sm font-bold`}>
                          {idx + 1}
                        </span>
                        <span className="text-sm font-medium text-gray-800 truncate">{anak.nama_anak}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <style jsx>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes scaleIn {
                from { opacity: 0; transform: scale(0.95) translateY(8px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
              }
            `}</style>
          </div>
        )
      })()}

    </div>
  )
}
