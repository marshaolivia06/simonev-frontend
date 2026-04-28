"use client";

import { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

/* ─── Data anak (dummy) ─── */
const ANAK = { nama: "Aisyah Putri Lestari", kelas: "TK A1", foto: "AP" };

/* Foto yang diupload guru dari menu Penilaian — read-only di sini */
const dummyFoto: Record<number, string> = {
  1:  "senam_pagi.jpg",
  4:  "mewarnai_gambar.jpg",
  8:  "mengenal_angka.jpg",
  14: "membaca_buku.jpg",
  18: "bermain_peran.jpg",
  22: "kegiatan_kelompok.jpg",
  26: "ciptaan_tuhan.jpg",
  28: "kolase.jpg",
};

const riwayat = [
  { id: 1,  tanggal: "2024-10-01", aspek: "Motorik",           kegiatan: "Senam Pagi",            indikator: "Koordinasi gerak tubuh sesuai irama",                nilai: "BSH" },
  { id: 2,  tanggal: "2024-10-03", aspek: "Motorik",           kegiatan: "Melipat Kertas",         indikator: "Melipat kertas menjadi bentuk sederhana",            nilai: "MB"  },
  { id: 3,  tanggal: "2024-10-07", aspek: "Motorik",           kegiatan: "Bermain Bola",           indikator: "Melempar dan menangkap bola dengan dua tangan",      nilai: "BSH" },
  { id: 4,  tanggal: "2024-10-10", aspek: "Motorik",           kegiatan: "Mewarnai Gambar",        indikator: "Menggerakkan jari tangan untuk mewarnai",            nilai: "BSB" },
  { id: 5,  tanggal: "2024-10-14", aspek: "Motorik",           kegiatan: "Menggunting Pola",       indikator: "Menggunting mengikuti garis pola sederhana",         nilai: "MB"  },
  { id: 6,  tanggal: "2024-10-18", aspek: "Motorik",           kegiatan: "Berjalan di Papan",      indikator: "Keseimbangan tubuh saat berjalan di atas garis",     nilai: "BSH" },
  { id: 7,  tanggal: "2024-10-02", aspek: "Kognitif",          kegiatan: "Bermain Puzzle",         indikator: "Memecahkan masalah sederhana secara mandiri",        nilai: "MB"  },
  { id: 8,  tanggal: "2024-10-05", aspek: "Kognitif",          kegiatan: "Mengenal Angka",         indikator: "Menyebut dan menunjuk angka 1–10",                   nilai: "BSH" },
  { id: 9,  tanggal: "2024-10-09", aspek: "Kognitif",          kegiatan: "Menyusun Balok",         indikator: "Menyusun benda dari besar ke kecil (seriasi)",       nilai: "BSH" },
  { id: 10, tanggal: "2024-10-13", aspek: "Kognitif",          kegiatan: "Mencocokkan Warna",      indikator: "Mengelompokkan benda berdasarkan warna",             nilai: "BSB" },
  { id: 11, tanggal: "2024-10-17", aspek: "Kognitif",          kegiatan: "Eksplorasi Pasir",       indikator: "Menunjukkan rasa ingin tahu melalui eksplorasi",     nilai: "MB"  },
  { id: 12, tanggal: "2024-10-21", aspek: "Kognitif",          kegiatan: "Pola Gambar",            indikator: "Melanjutkan pola gambar secara berulang",            nilai: "BSH" },
  { id: 13, tanggal: "2024-10-02", aspek: "Bahasa",            kegiatan: "Bercerita Gambar",       indikator: "Menceritakan gambar dengan kalimat sederhana",       nilai: "BSH" },
  { id: 14, tanggal: "2024-10-06", aspek: "Bahasa",            kegiatan: "Membaca Buku Cerita",    indikator: "Menunjukkan minat terhadap buku dan bacaan",         nilai: "BSB" },
  { id: 15, tanggal: "2024-10-11", aspek: "Bahasa",            kegiatan: "Menyanyikan Lagu",       indikator: "Melafalkan kata dengan jelas dan tepat",             nilai: "BSB" },
  { id: 16, tanggal: "2024-10-15", aspek: "Bahasa",            kegiatan: "Diskusi Pagi",           indikator: "Mengungkapkan pendapat dengan kalimat lengkap",      nilai: "MB"  },
  { id: 17, tanggal: "2024-10-20", aspek: "Bahasa",            kegiatan: "Tanya Jawab Cerita",     indikator: "Menjawab pertanyaan sesuai isi cerita",              nilai: "BSH" },
  { id: 18, tanggal: "2024-10-03", aspek: "Sosial-Emosional",  kegiatan: "Bermain Peran",          indikator: "Bekerja sama dengan teman dalam permainan",          nilai: "BSH" },
  { id: 19, tanggal: "2024-10-08", aspek: "Sosial-Emosional",  kegiatan: "Antri Cuci Tangan",      indikator: "Menunggu giliran dengan sabar dan tertib",           nilai: "MB"  },
  { id: 20, tanggal: "2024-10-12", aspek: "Sosial-Emosional",  kegiatan: "Berbagi Mainan",         indikator: "Bersedia berbagi mainan dengan teman",               nilai: "BSH" },
  { id: 21, tanggal: "2024-10-16", aspek: "Sosial-Emosional",  kegiatan: "Merapikan Mainan",       indikator: "Bertanggung jawab merapikan alat main sendiri",      nilai: "BSH" },
  { id: 22, tanggal: "2024-10-22", aspek: "Sosial-Emosional",  kegiatan: "Kegiatan Kelompok",      indikator: "Menunjukkan rasa percaya diri saat tampil",          nilai: "BSB" },
  { id: 23, tanggal: "2024-10-01", aspek: "Agama & Moral",     kegiatan: "Doa Sebelum Belajar",    indikator: "Melafalkan doa harian dengan benar",                 nilai: "BSH" },
  { id: 24, tanggal: "2024-10-04", aspek: "Agama & Moral",     kegiatan: "Praktik Sholat",         indikator: "Mempraktikkan gerakan sholat dengan tertib",         nilai: "MB"  },
  { id: 25, tanggal: "2024-10-10", aspek: "Agama & Moral",     kegiatan: "Menyayangi Teman",       indikator: "Berperilaku sopan dan santun kepada orang lain",     nilai: "BSH" },
  { id: 26, tanggal: "2024-10-19", aspek: "Agama & Moral",     kegiatan: "Mengenal Ciptaan Tuhan", indikator: "Menyebutkan ciptaan Tuhan di lingkungan sekitar",    nilai: "BSB" },
  { id: 27, tanggal: "2024-10-04", aspek: "Seni & Kreativitas",kegiatan: "Melukis Bebas",          indikator: "Mengekspresikan ide melalui lukisan warna",          nilai: "BSH" },
  { id: 28, tanggal: "2024-10-08", aspek: "Seni & Kreativitas",kegiatan: "Membuat Kolase",         indikator: "Menyusun bahan menjadi karya kolase sederhana",      nilai: "BSB" },
  { id: 29, tanggal: "2024-10-15", aspek: "Seni & Kreativitas",kegiatan: "Bernyanyi Bersama",      indikator: "Menyanyikan lagu anak dengan ekspresi",              nilai: "MB"  },
  { id: 30, tanggal: "2024-10-23", aspek: "Seni & Kreativitas",kegiatan: "Membuat Prakarya",       indikator: "Menciptakan karya dari bahan bekas secara kreatif",  nilai: "BSH" },
];

const aspekNilai = [
  { aspek: "Perkembangan Motorik",          short: "FM",     nilai: "BSH", color: "#4DB6AC", def: "Kemampuan anak mengontrol gerakan tubuh, baik motorik kasar (berlari, melompat, melempar) maupun motorik halus (menggunting, melipat, memegang pensil).", tooltipUp: false },
  { aspek: "Perkembangan Kognitif",         short: "KOG",    nilai: "MB",  color: "#F48FB1", def: "Kemampuan berpikir, memecahkan masalah, mengenal angka dan huruf, mengelompokkan benda, serta memahami sebab-akibat di lingkungan sekitar.", tooltipUp: false },
  { aspek: "Perkembangan Bahasa",           short: "BHS",    nilai: "BSB", color: "#F9A825", def: "Kemampuan memahami dan mengungkapkan pikiran melalui kata-kata, bercerita, menyimak, serta menunjukkan ketertarikan terhadap buku dan bacaan.", tooltipUp: false },
  { aspek: "Perkembangan Sosial-Emosional", short: "SOS-EM", nilai: "BSH", color: "#CE93D8", def: "Kemampuan mengelola emosi, bekerja sama, berbagi, menunggu giliran, serta menunjukkan rasa empati dan percaya diri dalam berinteraksi dengan teman.", tooltipUp: true },
  { aspek: "Nilai Agama dan Moral",         short: "NAM",    nilai: "MB",  color: "#FFCC80", def: "Pengenalan nilai-nilai agama seperti berdoa, bersyukur, serta perilaku moral seperti jujur, sopan, menyayangi sesama, dan mengenal ciptaan Tuhan.", tooltipUp: true },
  { aspek: "Seni dan Kreativitas",          short: "SENI",   nilai: "BSH", color: "#80CBC4", def: "Kemampuan mengekspresikan ide dan perasaan melalui kegiatan seni seperti menggambar, mewarnai, kolase, bernyanyi, dan membuat prakarya.", tooltipUp: true },
];

const nilaiNum: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };
const nilaiLbl: Record<number, string> = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };
const nilaiColorMap: Record<string, string> = {
  BB:  "bg-red-100 text-red-700",
  MB:  "bg-yellow-100 text-yellow-700",
  BSH: "bg-green-100 text-green-700",
  BSB: "bg-blue-100 text-blue-700",
};

const semesterOptions    = ["Semester 1", "Semester 2"];
const tahunOptions       = ["2023/2024", "2024/2025", "2025/2026"];
const aspekFilterOptions = ["Semua aspek","Motorik","Kognitif","Bahasa","Sosial-Emosional","Agama & Moral","Seni & Kreativitas"];

const ChevronDown = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg">
        <p className="font-semibold text-gray-700">{label}</p>
        <p className="text-gray-500">{nilaiLbl[payload[0].value] ?? payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const AspekTooltip = ({ aspek, def, color, tooltipUp }: { aspek: string; def: string; color: string; tooltipUp: boolean }) => (
  <div className={`invisible opacity-0 group-hover:visible group-hover:opacity-100 absolute z-50 left-0 w-64 bg-white border border-gray-200 rounded-xl p-3 shadow-lg transition-all duration-150 pointer-events-none ${tooltipUp ? "bottom-[calc(100%+8px)]" : "top-[calc(100%+8px)]"}`}>
    <span className={`absolute left-4 w-2.5 h-2.5 bg-white ${tooltipUp ? "bottom-[-5px] border-r border-b border-gray-200 rotate-45" : "top-[-5px] border-l border-t border-gray-200 rotate-45"}`} />
    <p className="text-xs font-semibold mb-1" style={{ color }}>{aspek}</p>
    <p className="text-xs text-gray-500 leading-relaxed">{def}</p>
  </div>
);

export default function LaporanPerkembanganOrangTua() {
  const [semester, setSemester]       = useState("Semester 1");
  const [tahunAjaran, setTahunAjaran] = useState("2024/2025");
  const [aspekFilter, setAspekFilter] = useState("Semua aspek");
  const [showData, setShowData]       = useState(false);

  const riwayatFiltered = aspekFilter === "Semua aspek" ? riwayat : riwayat.filter((r) => r.aspek === aspekFilter);
  const chartData = aspekNilai.map((a) => ({ name: a.short, nilai: nilaiNum[a.nilai], color: a.color }));

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <select value={semester} onChange={(e) => setSemester(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8 cursor-pointer">
              {semesterOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
          <div className="relative">
            <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8 cursor-pointer">
              {tahunOptions.map((t) => <option key={t}>{t}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowData(true)}
            className="flex-1 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm">
            Tampilkan
          </button>
          <button className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            Export PDF
          </button>
        </div>
      </div>

      {/* Profil — nama anak tidak bisa diubah */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg flex-shrink-0">
            {ANAK.foto}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{ANAK.nama}</h3>
            <p className="text-sm text-gray-500">
              {showData ? `${ANAK.kelas} • ${semester} • ${tahunAjaran}` : ANAK.kelas}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-2xl font-bold text-blue-500">{showData ? 6 : "-"}</p><p className="text-xs text-gray-500">Aspek</p></div>
            <div><p className="text-2xl font-bold text-blue-500">{showData ? 30 : "-"}</p><p className="text-xs text-gray-500">Penilaian</p></div>
            <div>
              {showData
                ? <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">BSH</span>
                : <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm font-semibold">-</span>}
              <p className="text-xs text-gray-500 mt-1">Rata-rata</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grafik + Ringkasan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Grafik perkembangan</h3>
          <p className="text-xs text-gray-500 mb-4">Rekapitulasi aspek perkembangan</p>
          {showData ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {aspekNilai.map((a) => (
                  <div key={a.short} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                    <span className="text-xs text-gray-600">{a.short}</span>
                  </div>
                ))}
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={32} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => nilaiLbl[v] ?? v}
                      tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={40} />
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
          <h3 className="font-semibold text-gray-800 mb-1">Ringkasan aspek</h3>
          <p className="text-xs text-gray-500 mb-4">Capaian setiap aspek perkembangan</p>
          <div className="space-y-3">
            {aspekNilai.map((a, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: a.color }} />
                  <span className="text-sm text-gray-700">{a.aspek}</span>
                </div>
                {showData
                  ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[a.nilai]}`}>{a.nilai}</span>
                  : <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-300">-</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabel Nilai Aspek */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-0.5">Tabel nilai aspek perkembangan</h3>
        <p className="text-xs text-gray-500 mb-4">Arahkan kursor ke baris untuk melihat definisi aspek</p>
        <div className="rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[60px] border-r border-gray-200">No</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Aspek Perkembangan</th>
                <th className="px-5 py-3 text-left text-xs font-bold text-gray-700">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {aspekNilai.map((a, i) => (
                <tr key={i} className="group hover:bg-gray-50 transition-colors">
                  <td className="text-center px-4 py-3 text-gray-500 border-r border-gray-200">{i + 1}</td>
                  <td className="px-5 py-3 border-r border-gray-200 text-gray-800 font-medium">
                    <div className="relative">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: a.color + "33" }}>
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                        </div>
                        {a.aspek}
                      </div>
                      <AspekTooltip aspek={a.aspek} def={a.def} color={a.color} tooltipUp={a.tooltipUp} />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    {showData
                      ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[a.nilai]}`}>{a.nilai}</span>
                      : <span className="text-gray-300 text-xs">-</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Komentar Guru */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-1">Komentar guru</h3>
        <p className="text-xs text-gray-500 mb-3">Catatan dan evaluasi dari wali kelas</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {showData
            ? "Aisyah menunjukkan perkembangan yang sangat baik pada aspek bahasa dan seni. Kemampuan motorik terus berkembang dengan kemajuan yang konsisten dari minggu ke minggu. Perlu perhatian lebih pada aspek kognitif, terutama kemampuan berhitung dan mengenal pola sederhana. Secara keseluruhan Aisyah adalah anak yang aktif, ceria, dan mudah bergaul dengan teman-temannya."
            : <span className="text-gray-300">-</span>}
        </p>
      </div>

      {/* Riwayat Penilaian */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Riwayat penilaian</h3>
          <div className="relative">
            <select value={aspekFilter} onChange={(e) => setAspekFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8 cursor-pointer min-w-[160px]">
              {aspekFilterOptions.map((opt) => <option key={opt}>{opt}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "720px" }}>
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                {["No","Tanggal","Aspek","Kegiatan","Indikator","Nilai","Dokumentasi"].map((h, i) => (
                  <th key={h} className={`px-3 py-3 text-xs font-bold text-gray-700 border-r border-gray-200 last:border-r-0 ${i === 5 ? "text-center" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {showData && riwayatFiltered.length > 0 ? (
                riwayatFiltered.map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-200">{index + 1}</td>
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-200 whitespace-nowrap">{item.tanggal}</td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200 whitespace-nowrap">{item.aspek}</td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200">{item.kegiatan}</td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200">{item.indikator}</td>
                    <td className="px-3 py-3 text-center border-r border-gray-200">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
                    </td>
                    {/* Dokumentasi — nama file saja, read-only */}
                    <td className="px-3 py-3">
                      {dummyFoto[item.id]
                        ? <span className="text-xs text-gray-600">{dummyFoto[item.id]}</span>
                        : <span className="text-xs text-gray-300">—</span>}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-300">
                    {showData ? "Tidak ada data untuk aspek ini" : "Pilih semester dan tahun ajaran lalu klik Tampilkan"}
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
