"use client";

import { useEffect, useState } from "react";
import { Users, User, School, GraduationCap, ShieldCheck } from "lucide-react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

function getToken() {
  return typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : "";
}
function authHeaders(): HeadersInit {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

const nilaiColorMap: Record<string, string> = {
  BB:  "bg-red-100 text-red-700",
  MB:  "bg-orange-100 text-orange-700",
  BSH: "bg-blue-100 text-blue-700",
  BSB: "bg-green-100 text-green-700",
};

const badgeColor: Record<string, string> = {
  Kegiatan: "bg-blue-100 text-blue-800",
  Libur:    "bg-green-100 text-green-800",
  Penting:  "bg-yellow-100 text-yellow-800",
  Info:     "bg-purple-100 text-purple-800",
};
const dotColor: Record<string, string> = {
  Kegiatan: "bg-blue-400",
  Libur:    "bg-green-400",
  Penting:  "bg-yellow-400",
  Info:     "bg-purple-400",
};

// Warna card per urutan kelas (loop, bukan hardcode per kelas)
const kelasColors = [
  { color: "from-purple-200 to-purple-100", iconColor: "text-purple-600" },
  { color: "from-cyan-200 to-cyan-100",     iconColor: "text-cyan-600" },
  { color: "from-orange-200 to-orange-100", iconColor: "text-orange-600" },
  { color: "from-pink-200 to-pink-100",     iconColor: "text-pink-600" },
  { color: "from-teal-200 to-teal-100",     iconColor: "text-teal-600" },
];

export default function DashboardAdmin() {
  const [jumlahGuru,   setJumlahGuru]   = useState<number | null>(null);
  const [jumlahKelas,  setJumlahKelas]  = useState<number | null>(null);
  const [totalAnak,    setTotalAnak]    = useState<number | null>(null);
  const [perluVerif,   setPerluVerif]   = useState<number | null>(null);
  const [pengumuman,   setPengumuman]   = useState<any[]>([]);
  const [distribusi,   setDistribusi]   = useState<Record<string, number>>({ BB: 0, MB: 0, BSH: 0, BSB: 0 });
  // Dinamis: { "TK A1": 12, "TK A2": 10, ... }
  const [anakPerKelas, setAnakPerKelas] = useState<Record<string, number>>({});
  const [loading,      setLoading]      = useState(true);

  useEffect(() => {
    const h = authHeaders();
    Promise.all([
      fetch(`${API}/guru`,       { headers: h }).then(r => r.json()),
      fetch(`${API}/kelas`,      { headers: h }).then(r => r.json()),
      fetch(`${API}/anak`,       { headers: h }).then(r => r.json()),
      fetch(`${API}/verifikasi`, { headers: h }).then(r => r.json()),
      fetch(`${API}/pengumuman`).then(r => r.json()),
      fetch(`${API}/observasi`,  { headers: h }).then(r => r.json()),
    ]).then(([guru, kelas, anak, verif, pengumuman, observasi]) => {

      if (guru.success) setJumlahGuru(guru.data.length);
      if (kelas.success) setJumlahKelas(kelas.data.length);

      if (kelas.success && anak.success) {
  setJumlahKelas(kelas.data.length);
  setTotalAnak((anak.data as any[]).length); // ← ini juga perlu diset ulang

  // Inisialisasi semua kelas dari API kelas dengan nilai 0
  const initKelas = (kelas.data as any[]).reduce<Record<string, number>>((acc, k) => {
    acc[k.nama_kelas] = 0;
    return acc;
  }, {});

  // Hitung jumlah anak per kelas
  (anak.data as any[]).forEach((a: any) => {
    const namaKelas = a.kelas?.nama_kelas;
    if (namaKelas && initKelas[namaKelas] !== undefined) {
      initKelas[namaKelas]++;
    }
  });

  const sorted = Object.fromEntries(
    Object.entries(initKelas).sort(([a], [b]) => a.localeCompare(b))
  );
  setAnakPerKelas(sorted);
}

      if (verif.success) {
        const pending = (verif.data as any[]).filter((u: any) => u.status === "pending").length;
        setPerluVerif(pending);
      }

      if (pengumuman.success) {
        setPengumuman((pengumuman.data as any[]).slice(0, 3));
      }

      if (observasi.success) {
        const dist: Record<string, number> = { BB: 0, MB: 0, BSH: 0, BSB: 0 };
        (observasi.data as any[]).forEach((o: any) => {
          if (o.nilai && dist[o.nilai] !== undefined) dist[o.nilai]++;
        });
        setDistribusi(dist);
      }

      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Stats statis (guru, kelas, total anak, verifikasi)
  const statsStatis = [
    { label: "Jumlah Guru",           value: jumlahGuru,  color: "from-emerald-200 to-emerald-100", iconColor: "text-emerald-600", icon: Users },
    { label: "Jumlah Kelas",          value: jumlahKelas, color: "from-rose-200 to-rose-100",       iconColor: "text-rose-600",    icon: School },
    { label: "Total Anak",            value: totalAnak,   color: "from-blue-200 to-blue-100",       iconColor: "text-blue-600",    icon: GraduationCap },
    { label: "Akun Perlu Verifikasi", value: perluVerif,  color: "from-yellow-200 to-yellow-100",   iconColor: "text-yellow-600",  icon: ShieldCheck },
  ];

  // Stats dinamis per kelas
  const statsKelas = Object.entries(anakPerKelas).map(([namaKelas, jumlah], i) => {
    const theme = kelasColors[i % kelasColors.length];
    return { label: `Total Anak ${namaKelas}`, value: jumlah, ...theme, icon: User };
  });

  const allStats = [...statsStatis, ...statsKelas];

  const distribusiDetail = [
    { label: "Belum Berkembang (BB)",           nilai: "BB",  value: distribusi.BB  },
    { label: "Mulai Berkembang (MB)",           nilai: "MB",  value: distribusi.MB  },
    { label: "Berkembang Sesuai Harapan (BSH)", nilai: "BSH", value: distribusi.BSH },
    { label: "Berkembang Sangat Baik (BSB)",    nilai: "BSB", value: distribusi.BSB },
  ];

  const distribusiData = {
    labels: ["BB", "MB", "BSH", "BSB"],
    datasets: [{
      data: [distribusi.BB, distribusi.MB, distribusi.BSH, distribusi.BSB],
      backgroundColor: ["#fca5a5", "#fdba74", "#93c5fd", "#86efac"],
      borderWidth: 0,
    }],
  };

  return (
    <div className="space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Selamat Datang, Admin!</h1>
        <p className="text-sm text-gray-500">Ringkasan data sekolah dan informasi terbaru</p>
      </div>

      {/* Satu grid, semua card — statis + dinamis per kelas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allStats.map((s) => (
          <div key={s.label}
            className={`bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-md hover:shadow-lg transition`}>
            <p className="text-sm font-medium text-gray-700">{s.label}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-3xl font-bold text-gray-800">
                {loading ? "..." : (s.value ?? 0)}
              </span>
              <s.icon size={28} className={s.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* Distribusi + Pie chart */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-center space-y-3">
          <p className="text-sm font-semibold text-gray-700 mb-1">Distribusi Perkembangan</p>
          {distribusiDetail.map((d) => (
            <div key={d.label} className="flex items-center justify-between">
              <span className="text-xs text-gray-600 flex-1">{d.label}</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${nilaiColorMap[d.nilai]}`}>
                {loading ? "-" : d.value}
              </span>
            </div>
          ))}
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm font-semibold text-gray-700 mb-4">
            Grafik Perkembangan Seluruh Anak
          </h2>
          <div className="flex justify-center">
            <div className="w-56 h-56">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  Memuat...
                </div>
              ) : (
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white rounded-2xl p-6 shadow-md">
        <h2 className="font-semibold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        {loading ? (
          <p className="text-sm text-gray-300 text-center py-8">Memuat...</p>
        ) : pengumuman.length === 0 ? (
          <p className="text-sm text-gray-300 text-center py-8">Belum ada pengumuman</p>
        ) : (
          <div className="space-y-4">
            {pengumuman.map((ann: any) => {
              const kat = ann.kategori ?? "Info";
              return (
                <div key={ann.id_pengumuman}
                  className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition">
                  <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${badgeColor[kat] ?? "bg-gray-100 text-gray-700"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${dotColor[kat] ?? "bg-gray-400"}`} />
                    {kat}
                  </span>
                  <p className="font-bold text-gray-800 mt-1">{ann.judul_pengumuman}</p>
                  <p className="text-xs text-gray-400 mb-1">{ann.tanggal}</p>
                  <p className="text-sm text-gray-600">{ann.isi_pengumuman}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}