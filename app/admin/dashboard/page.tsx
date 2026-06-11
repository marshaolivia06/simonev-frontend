"use client";

import { useEffect, useState } from "react";
import { Users, User, School, GraduationCap, ShieldCheck, X, AlertCircle, TrendingUp, CheckCircle2, Award } from "lucide-react";
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

const kelasColors = [
  { color: "from-purple-200 to-purple-100", iconColor: "text-purple-600" },
  { color: "from-cyan-200 to-cyan-100",     iconColor: "text-cyan-600" },
  { color: "from-orange-200 to-orange-100", iconColor: "text-orange-600" },
  { color: "from-pink-200 to-pink-100",     iconColor: "text-pink-600" },
  { color: "from-teal-200 to-teal-100",     iconColor: "text-teal-600" },
];

// Versi gradien lebih kuat untuk header modal, selaras dengan kelasColors di atas
const kelasModalTheme = [
  { gradient: "from-purple-500 to-fuchsia-400", avatarBg: "bg-purple-100", avatarText: "text-purple-600", ring: "ring-purple-100" },
  { gradient: "from-cyan-500 to-sky-400",       avatarBg: "bg-cyan-100",   avatarText: "text-cyan-600",   ring: "ring-cyan-100" },
  { gradient: "from-orange-500 to-amber-400",   avatarBg: "bg-orange-100", avatarText: "text-orange-600", ring: "ring-orange-100" },
  { gradient: "from-pink-500 to-rose-400",      avatarBg: "bg-pink-100",   avatarText: "text-pink-600",   ring: "ring-pink-100" },
  { gradient: "from-teal-500 to-emerald-400",   avatarBg: "bg-teal-100",   avatarText: "text-teal-600",   ring: "ring-teal-100" },
];

const nilaiToNum: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };
const numToNilai: Record<number, string> = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };

// Label lengkap untuk judul modal distribusi
const skalaLabel: Record<string, string> = {
  BB: "Belum Berkembang (BB)",
  MB: "Mulai Berkembang (MB)",
  BSH: "Berkembang Sesuai Harapan (BSH)",
  BSB: "Berkembang Sangat Baik (BSB)",
};

// Tema visual modal per skala distribusi
const skalaTheme: Record<string, {
  gradient: string;
  avatarBg: string;
  avatarText: string;
  ring: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}> = {
  BB:  { gradient: "from-red-500 to-rose-400",      avatarBg: "bg-red-100",    avatarText: "text-red-600",    ring: "ring-red-100",    icon: AlertCircle },
  MB:  { gradient: "from-orange-500 to-amber-400",  avatarBg: "bg-orange-100", avatarText: "text-orange-600", ring: "ring-orange-100", icon: TrendingUp },
  BSH: { gradient: "from-yellow-400 to-amber-300",  avatarBg: "bg-yellow-100", avatarText: "text-yellow-700", ring: "ring-yellow-100", icon: CheckCircle2 },
  BSB: { gradient: "from-green-500 to-emerald-400", avatarBg: "bg-green-100",  avatarText: "text-green-600",  ring: "ring-green-100",  icon: Award },
};

// Anak dalam satu kategori distribusi
interface AnakDistribusi {
  id_anak: number;
  nama_anak: string;
  nama_kelas?: string;
}

// Item generik untuk daftar di dalam modal
interface ModalItem {
  primary: string;
  secondary?: string;
}

// Konten modal generik (dipakai untuk semua card & distribusi)
interface ModalContent {
  title: string;
  unit: string; // "anak", "guru", "kelas", "akun"
  gradient: string;
  avatarBg: string;
  avatarText: string;
  ring: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  items: ModalItem[];
  emptyText: string;
}

export default function DashboardAdmin() {
  const [jumlahGuru,   setJumlahGuru]   = useState<number | null>(null);
  const [jumlahKelas,  setJumlahKelas]  = useState<number | null>(null);
  const [totalAnak,    setTotalAnak]    = useState<number | null>(null);
  const [perluVerif,   setPerluVerif]   = useState<number | null>(null);
  const [pengumuman,   setPengumuman]   = useState<any[]>([]);
  const [distribusi,   setDistribusi]   = useState<Record<string, number>>({ BB: 0, MB: 0, BSH: 0, BSB: 0 });
  const [anakPerKelas, setAnakPerKelas] = useState<Record<string, number>>({});
  const [anakByKategori, setAnakByKategori] = useState<Record<string, AnakDistribusi[]>>({ BB: [], MB: [], BSH: [], BSB: [] });
  const [loading,      setLoading]      = useState(true);

  // Data mentah untuk ditampilkan di modal masing-masing card
  const [guruData,  setGuruData]  = useState<any[]>([]);
  const [kelasData, setKelasData] = useState<any[]>([]);
  const [anakData,  setAnakData]  = useState<any[]>([]);
  const [verifData, setVerifData] = useState<any[]>([]);

  // State modal generik (dipakai untuk card total maupun distribusi)
  const [modalContent, setModalContent] = useState<ModalContent | null>(null);

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

      if (guru.success) {
        setJumlahGuru(guru.data.length);
        setGuruData(guru.data);
      }

      if (kelas.success && anak.success) {
        setJumlahKelas(kelas.data.length);
        setTotalAnak((anak.data as any[]).length);
        setKelasData(kelas.data);
        setAnakData(anak.data);

        const initKelas = (kelas.data as any[]).reduce<Record<string, number>>((acc, k) => {
          acc[k.nama_kelas] = 0;
          return acc;
        }, {});

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
        const pending = (verif.data as any[]).filter((u: any) => u.status === "pending");
        setPerluVerif(pending.length);
        setVerifData(pending);
      }

      if (pengumuman.success) {
        setPengumuman((pengumuman.data as any[]).slice(0, 3));
      }

      // ── Distribusi: hitung nilai rata-rata per anak, bukan per observasi ──
      if (observasi.success && anak.success) {
        const anakList: any[] = anak.data;

        // Kumpulkan semua nilai observasi per id_anak
        const nilaiPerAnak: Record<number, number[]> = {};
        (observasi.data as any[]).forEach((o: any) => {
          const idAnak = o.id_anak ?? o.anak?.id_anak;
          const nilaiNum = nilaiToNum[o.nilai];
          if (idAnak !== undefined && nilaiNum !== undefined) {
            if (!nilaiPerAnak[idAnak]) nilaiPerAnak[idAnak] = [];
            nilaiPerAnak[idAnak].push(nilaiNum);
          }
        });

        // Hitung rata-rata per anak → konversi ke kategori nilai
        const dist: Record<string, number> = { BB: 0, MB: 0, BSH: 0, BSB: 0 };
        const byKategori: Record<string, AnakDistribusi[]> = { BB: [], MB: [], BSH: [], BSB: [] };

        anakList.forEach((a: any) => {
          const vals = nilaiPerAnak[a.id_anak];
          if (!vals || vals.length === 0) return; // anak belum punya observasi, skip
          const rata = vals.reduce((sum, v) => sum + v, 0) / vals.length;
          const kategori = numToNilai[Math.round(rata)];
          if (kategori && dist[kategori] !== undefined) {
            dist[kategori]++;
            byKategori[kategori].push({
              id_anak: a.id_anak,
              nama_anak: a.nama_anak,
              nama_kelas: a.kelas?.nama_kelas,
            });
          }
        });

        // Urutkan tiap kategori berdasarkan nama
        Object.keys(byKategori).forEach((k) => {
          byKategori[k].sort((x, y) => x.nama_anak.localeCompare(y.nama_anak));
        });

        setDistribusi(dist);
        setAnakByKategori(byKategori);
      }

      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // ── Pembuka modal untuk tiap jenis card ──────────────────────────────

  const openGuruModal = () => setModalContent({
    title: "Daftar Guru",
    unit: "guru",
    gradient: "from-emerald-500 to-teal-400",
    avatarBg: "bg-emerald-100", avatarText: "text-emerald-600", ring: "ring-emerald-100",
    icon: Users,
    items: guruData
      .map((g: any) => ({ primary: g.nama_guru, secondary: g.jabatan || g.nama_lembaga || undefined }))
      .sort((a, b) => a.primary.localeCompare(b.primary)),
    emptyText: "Belum ada data guru",
  });

  const openKelasModal = () => setModalContent({
    title: "Daftar Kelas",
    unit: "kelas",
    gradient: "from-rose-500 to-pink-400",
    avatarBg: "bg-rose-100", avatarText: "text-rose-600", ring: "ring-rose-100",
    icon: School,
    items: kelasData
      .map((k: any) => ({ primary: k.nama_kelas, secondary: k.wali_kelas ? `Wali Kelas: ${k.wali_kelas}` : "Belum ada wali kelas" }))
      .sort((a, b) => a.primary.localeCompare(b.primary)),
    emptyText: "Belum ada data kelas",
  });

  const openTotalAnakModal = () => setModalContent({
    title: "Daftar Seluruh Anak",
    unit: "anak",
    gradient: "from-blue-500 to-sky-400",
    avatarBg: "bg-blue-100", avatarText: "text-blue-600", ring: "ring-blue-100",
    icon: GraduationCap,
    items: anakData
      .map((a: any) => ({ primary: a.nama_anak, secondary: a.kelas?.nama_kelas ? `Kelas ${a.kelas.nama_kelas}` : undefined }))
      .sort((a, b) => a.primary.localeCompare(b.primary)),
    emptyText: "Belum ada data anak",
  });

  const openVerifModal = () => setModalContent({
    title: "Akun Perlu Verifikasi",
    unit: "akun",
    gradient: "from-yellow-500 to-amber-400",
    avatarBg: "bg-yellow-100", avatarText: "text-yellow-700", ring: "ring-yellow-100",
    icon: ShieldCheck,
    items: verifData.map((u: any) => ({
      primary: u.name ?? u.nama ?? "-",
      secondary: u.email ?? u.role ?? undefined,
    })),
    emptyText: "Tidak ada akun yang perlu diverifikasi",
  });

  const openKelasAnakModal = (namaKelas: string, themeIdx: number) => {
    const theme = kelasModalTheme[themeIdx % kelasModalTheme.length];
    setModalContent({
      title: `Daftar Anak Kelas ${namaKelas}`,
      unit: "anak",
      ...theme,
      icon: User,
      items: anakData
        .filter((a: any) => a.kelas?.nama_kelas === namaKelas)
        .map((a: any) => ({ primary: a.nama_anak }))
        .sort((a, b) => a.primary.localeCompare(b.primary)),
      emptyText: "Belum ada anak di kelas ini",
    });
  };

  const openDistribusiModal = (nilai: string) => {
    const theme = skalaTheme[nilai];
    setModalContent({
      title: skalaLabel[nilai] ?? nilai,
      unit: "anak",
      ...theme,
      items: (anakByKategori[nilai] ?? []).map((a) => ({
        primary: a.nama_anak,
        secondary: a.nama_kelas ? `Kelas ${a.nama_kelas}` : undefined,
      })),
      emptyText: "Belum ada anak dengan kategori ini",
    });
  };

  // ── Susunan stats ─────────────────────────────────────────────────────

  const statsStatis = [
    { label: "Jumlah Guru",           value: jumlahGuru,  color: "from-emerald-200 to-emerald-100", iconColor: "text-emerald-600", icon: Users,         onClick: openGuruModal },
    { label: "Jumlah Kelas",          value: jumlahKelas, color: "from-rose-200 to-rose-100",       iconColor: "text-rose-600",    icon: School,        onClick: openKelasModal },
    { label: "Total Anak",            value: totalAnak,   color: "from-blue-200 to-blue-100",       iconColor: "text-blue-600",    icon: GraduationCap, onClick: openTotalAnakModal },
    { label: "Akun Perlu Verifikasi", value: perluVerif,  color: "from-yellow-200 to-yellow-100",   iconColor: "text-yellow-600",  icon: ShieldCheck,   onClick: openVerifModal },
  ];

  const statsKelas = Object.entries(anakPerKelas).map(([namaKelas, jumlah], i) => {
    const theme = kelasColors[i % kelasColors.length];
    return {
      label: `Total Anak ${namaKelas}`,
      value: jumlah,
      ...theme,
      icon: User,
      onClick: () => openKelasAnakModal(namaKelas, i),
    };
  });

  const allStats = [...statsStatis, ...statsKelas];

  const totalDistribusi = distribusi.BB + distribusi.MB + distribusi.BSH + distribusi.BSB;

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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {allStats.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={s.onClick}
            disabled={loading}
            className={`text-left bg-gradient-to-br ${s.color} rounded-2xl p-5 shadow-md hover:shadow-lg hover:scale-[1.02] transition cursor-pointer disabled:cursor-default`}>
            <p className="text-sm font-medium text-gray-700">{s.label}</p>
            <div className="flex items-center justify-between mt-3">
              <span className="text-3xl font-bold text-gray-800">
                {loading ? "..." : (s.value ?? 0)}
              </span>
              <s.icon size={28} className={s.iconColor} />
            </div>
          </button>
        ))}
      </div>

      {/* Distribusi + Pie chart */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-6 shadow-md flex flex-col justify-center space-y-3">
          <div>
            <p className="text-sm font-semibold text-gray-700">Distribusi Perkembangan</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Nilai rata-rata per anak
              {!loading && totalDistribusi > 0 && (
                <span className="ml-1 text-gray-500">({totalDistribusi} anak dinilai)</span>
              )}
            </p>
          </div>
          {distribusiDetail.map((d) => (
            <button
              key={d.label}
              type="button"
              onClick={() => openDistribusiModal(d.nilai)}
              disabled={loading}
              className="flex items-center justify-between rounded-lg px-1.5 py-1 -mx-1.5 transition hover:bg-gray-50 cursor-pointer disabled:cursor-default"
            >
              <span className="text-xs text-gray-600 flex-1 text-left">{d.label}</span>
              <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-semibold ${nilaiColorMap[d.nilai]}`}>
                {loading ? "-" : d.value}
              </span>
            </button>
          ))}
          {!loading && totalDistribusi === 0 && (
            <p className="text-xs text-gray-300 text-center pt-2">Belum ada data penilaian</p>
          )}
        </div>

        <div className="col-span-2 bg-white rounded-2xl p-6 shadow-md">
          <h2 className="text-sm font-semibold text-gray-700 mb-1">
            Grafik Perkembangan Seluruh Anak
          </h2>
          <p className="text-xs text-gray-400 mb-4">Berdasarkan nilai rata-rata per anak — klik segmen untuk lihat detail anak</p>
          <div className="flex justify-center">
            <div className="w-56 h-56">
              {loading ? (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  Memuat...
                </div>
              ) : totalDistribusi === 0 ? (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">
                  Belum ada data
                </div>
              ) : (
                <Pie
                  data={distribusiData}
                  options={{
                    onClick: (_evt, elements) => {
                      if (elements.length > 0) {
                        const idx = elements[0].index;
                        const label = distribusiData.labels[idx];
                        openDistribusiModal(label);
                      }
                    },
                    onHover: (evt, elements) => {
                      const target = evt.native?.target as HTMLElement | undefined;
                      if (target) target.style.cursor = elements.length > 0 ? "pointer" : "default";
                    },
                    plugins: {
                      legend: {
                        position: "right",
                        labels: { boxWidth: 12, font: { size: 11 } },
                      },
                      tooltip: {
                        callbacks: {
                          label: (ctx) => {
                            const val = ctx.parsed;
                            const pct = totalDistribusi > 0 ? Math.round((val / totalDistribusi) * 100) : 0;
                            return ` ${val} anak (${pct}%)`;
                          },
                        },
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

      {/* MODAL GENERIK — dipakai untuk semua card total & distribusi */}
      {modalContent && (() => {
        const Icon = modalContent.icon;
        return (
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-[fadeIn_0.15s_ease-out]"
            onClick={() => setModalContent(null)}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-[scaleIn_0.18s_ease-out]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER GRADIEN */}
              <div className={`bg-gradient-to-r ${modalContent.gradient} p-5 relative`}>
                <button
                  onClick={() => setModalContent(null)}
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
                      {modalContent.title}
                    </h3>
                    <p className="text-xs text-white/80 mt-0.5">
                      {modalContent.items.length > 0
                        ? `${modalContent.items.length} ${modalContent.unit}`
                        : `Belum ada ${modalContent.unit}`}
                    </p>
                  </div>
                </div>
              </div>

              {/* LIST ITEM */}
              <div className="p-4 overflow-y-auto">
                {modalContent.items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className={`w-12 h-12 rounded-full ${modalContent.avatarBg} flex items-center justify-center mb-3`}>
                      <Icon size={22} className={modalContent.avatarText} />
                    </div>
                    <p className="text-sm text-gray-400">
                      {modalContent.emptyText}
                    </p>
                  </div>
                ) : (
                  <ul className="space-y-1.5">
                    {modalContent.items.map((item, idx) => (
                      <li
                        key={`${item.primary}-${idx}`}
                        className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-gray-50 transition"
                      >
                        <span className={`w-9 h-9 shrink-0 flex items-center justify-center rounded-full ${modalContent.avatarBg} ${modalContent.avatarText} ring-4 ${modalContent.ring} text-sm font-bold`}>
                          {idx + 1}
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{item.primary}</p>
                          {item.secondary && (
                            <p className="text-xs text-gray-400 truncate">{item.secondary}</p>
                          )}
                        </div>
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
        );
      })()}

    </div>
  );
}
