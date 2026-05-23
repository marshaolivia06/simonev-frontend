"use client";

import { useState, useEffect } from "react";
import { FileText, User } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Kelas   { id_kelas: number; nama_kelas: string }
interface Anak    { id_anak: number;  nama_anak: string; id_kelas: number }
interface RekapAspek { aspek: string; nilai: string | null; jumlah: number }
interface Riwayat {
  id_observasi: number;
  tanggal: string;
  nilai: string;
  komentar: string;
  foto: string | null;
  indikator: {
    nama_indikator: string;
    nama_kegiatan: string;
    aspek: { nama_aspek: string };
  };
  guru: { nama_guru: string };
}

// ─── Konstanta ────────────────────────────────────────────────────────────────
const aspekColors: Record<string, string> = {
  "Nilai Agama dan Moral":  "#FFCC80",
  "Motorik":                "#4DB6AC",
  "Kognitif":               "#F48FB1",
  "Bahasa":                 "#FFF176",
  "Sosial-Emosional":       "#CE93D8",
  "Kreativitas/Seni":       "#80CBC4",
};
const defaultColor = "#90CAF9";

const nilaiOrder: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };
const nilaiLabel: Record<number, string> = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };
const nilaiColorMap: Record<string, string> = {
  BB:  "bg-red-100 text-red-700",
  MB:  "bg-yellow-100 text-yellow-700",
  BSH: "bg-green-100 text-green-700",
  BSB: "bg-blue-100 text-blue-700",
};

const semesterOptions    = ["Semester 1", "Semester 2"];
const tahunAjaranOptions = ["2023/2024", "2024/2025", "2025/2026"];
const aspekFilterOptions = ["Semua aspek","Nilai Agama dan Moral","Motorik","Kognitif","Bahasa","Sosial-Emosional","Kreativitas/Seni"];

// ─── Custom Tooltip ───────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-gray-500">{nilaiLabel[payload[0].value] ?? payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LaporanPerkembanganAdminPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const headers = {
    "Accept": "application/json",
    "Authorization": `Bearer ${token}`,
  };

  // filter state
  const [kelasList, setKelasList]   = useState<Kelas[]>([]);
  const [anakList, setAnakList]     = useState<Anak[]>([]);
  const [selectedKelas, setSelectedKelas]     = useState("");
  const [selectedAnak, setSelectedAnak]       = useState("");
  const [semester, setSemester]               = useState("Semester 1");
  const [tahunAjaran, setTahunAjaran]         = useState("2024/2025");
  const [aspekFilter, setAspekFilter]         = useState("Semua aspek");

  // data state
  const [anakDetail, setAnakDetail]     = useState<Anak | null>(null);
  const [rekapAspek, setRekapAspek]     = useState<RekapAspek[]>([]);
  const [riwayat, setRiwayat]           = useState<Riwayat[]>([]);
  const [komentar, setKomentar]         = useState("");
  const [totalPenilaian, setTotalPenilaian] = useState(0);

  const [loading, setLoading]   = useState(false);
  const [showData, setShowData] = useState(false);

  // fetch kelas on mount
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kelas`, { headers })
      .then(r => r.json())
      .then(json => { if (json.success) setKelasList(json.data) })
      .catch(() => {});
  }, []);

  // fetch anak saat kelas berubah
  useEffect(() => {
    if (!selectedKelas) { setAnakList([]); setSelectedAnak(""); return; }
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/anak`, { headers })
      .then(r => r.json())
      .then(json => {
        if (json.success) {
          const filtered = json.data.filter((a: Anak) => String(a.id_kelas) === String(selectedKelas));
          setAnakList(filtered);
          setSelectedAnak("");
        }
      })
      .catch(() => {});
  }, [selectedKelas]);

  const handleKelasChange = (val: string) => {
    setSelectedKelas(val);
    setShowData(false);
    setAnakDetail(null);
    setRekapAspek([]);
    setRiwayat([]);
    setKomentar("");
  };

  const handleTampilkan = async () => {
    if (!selectedAnak) { alert("Pilih anak terlebih dahulu."); return; }
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_API_URL}/observasi/anak/${selectedAnak}?semester=${encodeURIComponent(semester)}`;
      const res  = await fetch(url, { headers });
      const json = await res.json();
      if (json.success) {
        setAnakDetail(json.data.anak);
        setRekapAspek(json.data.rekap_aspek);
        setRiwayat(json.data.riwayat);
        setKomentar(json.data.komentar);
        setTotalPenilaian(json.data.total);
        setShowData(true);
      } else {
        alert(json.message || "Gagal memuat data.");
      }
    } catch {
      alert("Gagal terhubung ke server.");
    }
    setLoading(false);
  };

  // data grafik dari rekap aspek
  const chartData = rekapAspek.map(r => ({
    name:  r.aspek.split(" ").slice(-1)[0], // label pendek
    nilai: nilaiOrder[r.nilai ?? ""] ?? 0,
    color: aspekColors[r.aspek] ?? defaultColor,
    full:  r.aspek,
  }));

  // riwayat difilter per aspek
  const riwayatFiltered = aspekFilter === "Semua aspek"
    ? riwayat
    : riwayat.filter(r => r.indikator?.aspek?.nama_aspek === aspekFilter);

  // rata-rata nilai keseluruhan
  const rataRata = rekapAspek.length > 0
    ? (() => {
        const vals = rekapAspek.map(r => nilaiOrder[r.nilai ?? ""] ?? 0).filter(v => v > 0);
        if (!vals.length) return "-";
        const avg = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
        return nilaiLabel[avg] ?? "-";
      })()
    : "-";

  const selectCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white appearance-none pr-8 cursor-pointer transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

          {/* Kelas */}
          <div className="relative">
            <select value={selectedKelas} onChange={(e) => handleKelasChange(e.target.value)} className={selectCls}>
              <option value="">Pilih kelas</option>
              {kelasList.map((k) => <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>

          {/* Anak */}
          <div className="relative">
            <select value={selectedAnak} onChange={(e) => { setSelectedAnak(e.target.value); setShowData(false); }} className={selectCls}>
              <option value="">Pilih anak</option>
              {anakList.map((a) => <option key={a.id_anak} value={a.id_anak}>{a.nama_anak}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>

          {/* Semester */}
          <div className="relative">
            <select value={semester} onChange={(e) => { setSemester(e.target.value); setShowData(false); }} className={selectCls}>
              {semesterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>

          {/* Tahun Ajaran */}
          <div className="relative">
            <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className={selectCls}>
              {tahunAjaranOptions.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleTampilkan}
            disabled={loading}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            {loading ? "Memuat..." : "Tampilkan"}
          </button>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
            <FileText size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Profil Anak */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
            {showData && anakDetail
              ? anakDetail.nama_anak.split(" ").map((n: string) => n[0]).join("").substring(0, 2)
              : <User size={22} className="text-blue-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {showData && anakDetail ? anakDetail.nama_anak : <span className="text-gray-400">-</span>}
            </h3>
            <p className="text-sm text-gray-500">
              {showData
                ? `${kelasList.find(k => String(k.id_kelas) === String(selectedKelas))?.nama_kelas ?? ""} • ${semester} • ${tahunAjaran}`
                : <span className="text-gray-300">Belum ada data dipilih</span>}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-500">{showData ? rekapAspek.length : "-"}</p>
              <p className="text-xs text-gray-500">Aspek</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{showData ? totalPenilaian : "-"}</p>
              <p className="text-xs text-gray-500">Penilaian</p>
            </div>
            <div>
              {showData
                ? <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${nilaiColorMap[rataRata] ?? "bg-gray-100 text-gray-400"}`}>{rataRata}</span>
                : <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm font-semibold">-</span>}
              <p className="text-xs text-gray-500 mt-1">Rata-rata</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik & Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Grafik Perkembangan</h3>
          <p className="text-xs text-gray-500 mb-4">Rekapitulasi aspek perkembangan</p>
          {showData && chartData.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {chartData.map((d) => (
                  <div key={d.full} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
                    <span className="text-xs text-gray-600">{d.name}</span>
                  </div>
                ))}
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={28} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]}
                      tickFormatter={(v) => nilaiLabel[v] ?? v}
                      tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={48} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                    <Bar dataKey="nilai" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">Belum ada data</div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Ringkasan Aspek</h3>
          <p className="text-xs text-gray-500 mb-4">Capaian setiap aspek perkembangan</p>
          <div className="space-y-3">
            {showData && rekapAspek.length > 0 ? rekapAspek.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: aspekColors[item.aspek] ?? defaultColor }} />
                  <span className="text-sm text-gray-700">{item.aspek}</span>
                </div>
                {item.nilai
                  ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
                  : <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-300">-</span>}
              </div>
            )) : (
              <p className="text-sm text-gray-300 text-center py-8">Belum ada data</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Nilai Aspek */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Tabel Nilai Aspek Perkembangan</h3>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-1/2">Aspek Perkembangan</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-1/2">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {showData && rekapAspek.length > 0 ? rekapAspek.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200">{item.aspek}</td>
                  <td className="px-4 py-3">
                    {item.nilai
                      ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
                      : <span className="text-gray-300 text-xs">-</span>}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={2} className="px-4 py-8 text-center text-gray-300 text-sm">Belum ada data</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Komentar Guru */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-1">Komentar Guru</h3>
        <p className="text-xs text-gray-500 mb-3">Catatan dan evaluasi</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {showData && komentar ? komentar : <span className="text-gray-300">-</span>}
        </p>
      </div>

      {/* Riwayat Penilaian */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Riwayat Penilaian</h3>
          <div className="relative">
            <select value={aspekFilter} onChange={(e) => setAspekFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8 cursor-pointer min-w-[160px]">
              {aspekFilterOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "720px" }}>
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                {["No","Tanggal","Aspek","Kegiatan","Indikator","Nilai","Dokumentasi"].map((h, i) => (
                  <th key={h} className={`px-3 py-3 text-xs font-bold text-gray-700 border-r border-gray-200 last:border-r-0 ${i === 5 || i === 6 ? "text-center" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {showData && riwayatFiltered.length > 0 ? (
                riwayatFiltered.map((item, index) => (
                  <tr key={item.id_observasi} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-200">{index + 1}</td>
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-200 whitespace-nowrap">{item.tanggal}</td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200 whitespace-nowrap">
                      {item.indikator?.aspek?.nama_aspek ?? "-"}
                    </td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200">
                      {item.indikator?.nama_kegiatan ?? "-"}
                    </td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200">
                      {item.indikator?.nama_indikator ?? "-"}
                    </td>
                    <td className="px-3 py-3 text-center border-r border-gray-200">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai] ?? "bg-gray-100 text-gray-400"}`}>
                        {item.nilai ?? "-"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {item.foto ? (
                        <div className="flex items-center justify-center gap-1.5">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <a
                            href={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${item.foto}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:text-blue-700 hover:underline whitespace-nowrap"
                          >
                            Lihat Foto
                          </a>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-300">
                    {showData ? "Tidak ada data untuk aspek ini" : "Pilih filter lalu klik Tampilkan"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}