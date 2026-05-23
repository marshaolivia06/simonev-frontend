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
const nilaiOrder: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };

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

export default function DashboardAdmin() {
  const [jumlahGuru, setJumlahGuru]       = useState<number | null>(null);
  const [jumlahKelas, setJumlahKelas]     = useState<number | null>(null);
  const [jumlahAnakA, setJumlahAnakA]     = useState<number | null>(null);
  const [jumlahAnakB, setJumlahAnakB]     = useState<number | null>(null);
  const [totalAnak, setTotalAnak]         = useState<number | null>(null);
  const [perluVerif, setPerluVerif]       = useState<number | null>(null);
  const [pengumuman, setPengumuman]       = useState<any[]>([]);
  const [distribusi, setDistribusi]       = useState<Record<string, number>>({ BB: 0, MB: 0, BSH: 0, BSB: 0 });
  const [loading, setLoading]             = useState(true);

  useEffect(() => {
    const h = authHeaders();

    Promise.all([
      fetch(`${API}/guru`, { headers: h }).then(r => r.json()),
      fetch(`${API}/kelas`).then(r => r.json()),
      fetch(`${API}/anak`, { headers: h }).then(r => r.json()),
      fetch(`${API}/verifikasi`, { headers: h }).then(r => r.json()),
      fetch(`${API}/pengumuman`).then(r => r.json()),
      fetch(`${API}/observasi`, { headers: h }).then(r => r.json()),
    ]).then(([guru, kelas, anak, verif, pengumuman, observasi]) => {

      // Guru
      if (guru.success) setJumlahGuru(guru.data.length);

      // Kelas
      if (kelas.success) setJumlahKelas(kelas.data.length);

      // Anak — pisah TK A dan TK B berdasarkan nama kelas
      if (anak.success) {
        const anakData = anak.data as any[];
        setTotalAnak(anakData.length);

        const tkA = anakData.filter((a: any) =>
          (a.kelas?.nama_kelas ?? "").toLowerCase().includes("tk a")
        ).length;
        const tkB = anakData.filter((a: any) =>
          (a.kelas?.nama_kelas ?? "").toLowerCase().includes("tk b")
        ).length;
        setJumlahAnakA(tkA);
        setJumlahAnakB(tkB);
      }

      // Verifikasi — hitung yang status pending
      if (verif.success) {
        const pending = (verif.data as any[]).filter((u: any) => u.status === "pending").length;
        setPerluVerif(pending);
      }

      // Pengumuman — ambil 3 terbaru
      if (pengumuman.success) {
        setPengumuman((pengumuman.data as any[]).slice(0, 3));
      }

      // Distribusi perkembangan dari observasi
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

  const stats = [
    { label: "Jumlah Guru",          value: jumlahGuru,  color: "from-emerald-200 to-emerald-100", iconColor: "text-emerald-600", icon: Users },
    { label: "Jumlah Kelas",         value: jumlahKelas, color: "from-rose-200 to-rose-100",       iconColor: "text-rose-600",    icon: School },
    { label: "Total Anak TK A",      value: jumlahAnakA, color: "from-purple-200 to-purple-100",   iconColor: "text-purple-600",  icon: User },
    { label: "Total Anak TK B",      value: jumlahAnakB, color: "from-cyan-200 to-cyan-100",       iconColor: "text-cyan-600",    icon: Users },
    { label: "Total Anak",           value: totalAnak,   color: "from-blue-200 to-blue-100",       iconColor: "text-blue-600",    icon: GraduationCap },
    { label: "Akun Perlu Verifikasi",value: perluVerif,  color: "from-yellow-200 to-yellow-100",   iconColor: "text-yellow-600",  icon: ShieldCheck },
  ];

  const distribusiDetail = [
    { label: "Belum Berkembang (BB)",              nilai: "BB",  value: distribusi.BB  },
    { label: "Mulai Berkembang (MB)",              nilai: "MB",  value: distribusi.MB  },
    { label: "Berkembang Sesuai Harapan (BSH)",    nilai: "BSH", value: distribusi.BSH },
    { label: "Berkembang Sangat Baik (BSB)",       nilai: "BSB", value: distribusi.BSB },
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
              <span className="text-3xl font-bold text-gray-800">
                {loading ? "..." : (s.value ?? 0)}
              </span>
              <s.icon size={28} className={s.iconColor} />
            </div>
          </div>
        ))}
      </div>

      {/* DISTRIBUSI + PIE CHART */}
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

      {/* PENGUMUMAN */}
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