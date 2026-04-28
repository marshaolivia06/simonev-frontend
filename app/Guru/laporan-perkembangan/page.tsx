"use client";

import { useState } from "react";
import { FileText, User } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

interface RiwayatItem {
  id: number;
  tanggal: string;
  aspek: string;
  kegiatan: string;
  indikator: string;
  nilai: string;
  dokumentasi: string;
}

const dummyRiwayat: RiwayatItem[] = [
  { id: 1,  tanggal: "2024-10-01", aspek: "Motorik",           kegiatan: "Senam Pagi",            indikator: "Koordinasi gerak tubuh sesuai irama",            nilai: "BSH", dokumentasi: "senam_pagi_01.jpg" },
  { id: 2,  tanggal: "2024-10-03", aspek: "Motorik",           kegiatan: "Melipat Kertas",         indikator: "Melipat kertas menjadi bentuk sederhana",         nilai: "MB",  dokumentasi: "melipat_kertas_03.jpg" },
  { id: 3,  tanggal: "2024-10-07", aspek: "Motorik",           kegiatan: "Bermain Bola",           indikator: "Melempar dan menangkap bola dengan dua tangan",   nilai: "BSH", dokumentasi: "bermain_bola_07.jpg" },
  { id: 4,  tanggal: "2024-10-10", aspek: "Motorik",           kegiatan: "Mewarnai Gambar",        indikator: "Menggerakkan jari tangan untuk mewarnai",         nilai: "BSB", dokumentasi: "mewarnai_gambar_10.jpg" },
  { id: 5,  tanggal: "2024-10-14", aspek: "Motorik",           kegiatan: "Menggunting Pola",       indikator: "Menggunting mengikuti garis pola sederhana",      nilai: "MB",  dokumentasi: "menggunting_pola_14.jpg" },
  { id: 6,  tanggal: "2024-10-18", aspek: "Motorik",           kegiatan: "Berjalan di Papan",      indikator: "Keseimbangan tubuh saat berjalan di atas garis",  nilai: "BSH", dokumentasi: "berjalan_papan_18.jpg" },
  { id: 7,  tanggal: "2024-10-02", aspek: "Kognitif",          kegiatan: "Bermain Puzzle",         indikator: "Memecahkan masalah sederhana secara mandiri",     nilai: "MB",  dokumentasi: "bermain_puzzle_02.jpg" },
  { id: 8,  tanggal: "2024-10-05", aspek: "Kognitif",          kegiatan: "Mengenal Angka",         indikator: "Menyebut dan menunjuk angka 1–10",                nilai: "BSH", dokumentasi: "mengenal_angka_05.jpg" },
  { id: 9,  tanggal: "2024-10-09", aspek: "Kognitif",          kegiatan: "Menyusun Balok",         indikator: "Menyusun benda dari besar ke kecil (seriasi)",    nilai: "BSH", dokumentasi: "menyusun_balok_09.jpg" },
  { id: 10, tanggal: "2024-10-13", aspek: "Kognitif",          kegiatan: "Mencocokkan Warna",      indikator: "Mengelompokkan benda berdasarkan warna",          nilai: "BSB", dokumentasi: "mencocokkan_warna_13.jpg" },
  { id: 11, tanggal: "2024-10-17", aspek: "Kognitif",          kegiatan: "Eksplorasi Pasir",       indikator: "Menunjukkan rasa ingin tahu melalui eksplorasi",  nilai: "MB",  dokumentasi: "eksplorasi_pasir_17.jpg" },
  { id: 12, tanggal: "2024-10-21", aspek: "Kognitif",          kegiatan: "Pola Gambar",            indikator: "Melanjutkan pola gambar secara berulang",         nilai: "BSH", dokumentasi: "pola_gambar_21.jpg" },
  { id: 13, tanggal: "2024-10-02", aspek: "Bahasa",            kegiatan: "Bercerita Gambar",       indikator: "Menceritakan gambar dengan kalimat sederhana",    nilai: "BSH", dokumentasi: "bercerita_gambar_02.jpg" },
  { id: 14, tanggal: "2024-10-06", aspek: "Bahasa",            kegiatan: "Membaca Buku Cerita",    indikator: "Menunjukkan minat terhadap buku dan bacaan",      nilai: "BSB", dokumentasi: "membaca_buku_06.jpg" },
  { id: 15, tanggal: "2024-10-11", aspek: "Bahasa",            kegiatan: "Menyanyikan Lagu",       indikator: "Melafalkan kata dengan jelas dan tepat",          nilai: "BSB", dokumentasi: "menyanyikan_lagu_11.jpg" },
  { id: 16, tanggal: "2024-10-15", aspek: "Bahasa",            kegiatan: "Diskusi Pagi",           indikator: "Mengungkapkan pendapat dengan kalimat lengkap",   nilai: "MB",  dokumentasi: "diskusi_pagi_15.jpg" },
  { id: 17, tanggal: "2024-10-20", aspek: "Bahasa",            kegiatan: "Tanya Jawab Cerita",     indikator: "Menjawab pertanyaan sesuai isi cerita",           nilai: "BSH", dokumentasi: "tanya_jawab_20.jpg" },
  { id: 18, tanggal: "2024-10-03", aspek: "Sosial-Emosional",  kegiatan: "Bermain Peran",          indikator: "Bekerja sama dengan teman dalam permainan",       nilai: "BSH", dokumentasi: "bermain_peran_03.jpg" },
  { id: 19, tanggal: "2024-10-08", aspek: "Sosial-Emosional",  kegiatan: "Antri Cuci Tangan",      indikator: "Menunggu giliran dengan sabar dan tertib",        nilai: "MB",  dokumentasi: "cuci_tangan_08.jpg" },
  { id: 20, tanggal: "2024-10-12", aspek: "Sosial-Emosional",  kegiatan: "Berbagi Mainan",         indikator: "Bersedia berbagi mainan dengan teman",            nilai: "BSH", dokumentasi: "berbagi_mainan_12.jpg" },
  { id: 21, tanggal: "2024-10-16", aspek: "Sosial-Emosional",  kegiatan: "Merapikan Mainan",       indikator: "Bertanggung jawab merapikan alat main sendiri",   nilai: "BSH", dokumentasi: "merapikan_mainan_16.jpg" },
  { id: 22, tanggal: "2024-10-22", aspek: "Sosial-Emosional",  kegiatan: "Kegiatan Kelompok",      indikator: "Menunjukkan rasa percaya diri saat tampil",       nilai: "BSB", dokumentasi: "kegiatan_kelompok_22.jpg" },
  { id: 23, tanggal: "2024-10-01", aspek: "Agama & Moral",     kegiatan: "Doa Sebelum Belajar",    indikator: "Melafalkan doa harian dengan benar",              nilai: "BSH", dokumentasi: "doa_belajar_01.jpg" },
  { id: 24, tanggal: "2024-10-04", aspek: "Agama & Moral",     kegiatan: "Praktik Sholat",         indikator: "Mempraktikkan gerakan sholat dengan tertib",      nilai: "MB",  dokumentasi: "praktik_sholat_04.jpg" },
  { id: 25, tanggal: "2024-10-10", aspek: "Agama & Moral",     kegiatan: "Menyayangi Teman",       indikator: "Berperilaku sopan dan santun kepada orang lain",  nilai: "BSH", dokumentasi: "menyayangi_teman_10.jpg" },
  { id: 26, tanggal: "2024-10-19", aspek: "Agama & Moral",     kegiatan: "Mengenal Ciptaan Tuhan", indikator: "Menyebutkan ciptaan Tuhan di lingkungan sekitar", nilai: "BSB", dokumentasi: "ciptaan_tuhan_19.jpg" },
  { id: 27, tanggal: "2024-10-04", aspek: "Seni & Kreativitas",kegiatan: "Melukis Bebas",          indikator: "Mengekspresikan ide melalui lukisan warna",        nilai: "BSH", dokumentasi: "melukis_bebas_04.jpg" },
  { id: 28, tanggal: "2024-10-08", aspek: "Seni & Kreativitas",kegiatan: "Membuat Kolase",         indikator: "Menyusun bahan menjadi karya kolase sederhana",    nilai: "BSB", dokumentasi: "membuat_kolase_08.jpg" },
  { id: 29, tanggal: "2024-10-15", aspek: "Seni & Kreativitas",kegiatan: "Bernyanyi Bersama",      indikator: "Menyanyikan lagu anak dengan ekspresi",           nilai: "MB",  dokumentasi: "bernyanyi_bersama_15.jpg" },
  { id: 30, tanggal: "2024-10-23", aspek: "Seni & Kreativitas",kegiatan: "Membuat Prakarya",       indikator: "Menciptakan karya dari bahan bekas secara kreatif",nilai: "BSH", dokumentasi: "membuat_prakarya_23.jpg" },
];

const aspekList   = ["FM", "KOG", "BHS", "SOS-EM", "NAM", "SENI"];
const aspekColors = ["#4DB6AC","#F48FB1","#FFF176","#CE93D8","#FFCC80","#80CBC4"];
const defaultNilai = [3, 2, 4, 3, 2, 3];

const nilaiLabel: Record<number, string> = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };
const nilaiColorMap: Record<string, string> = {
  BB:  "bg-red-100 text-red-700",
  MB:  "bg-yellow-100 text-yellow-700",
  BSH: "bg-green-100 text-green-700",
  BSB: "bg-blue-100 text-blue-700",
};

const dummyAspekNilai = [
  { aspek: "Perkembangan Motorik",          nilai: "BSH", color: "#4DB6AC" },
  { aspek: "Perkembangan Kognitif",         nilai: "MB",  color: "#F48FB1" },
  { aspek: "Perkembangan Bahasa",           nilai: "BSB", color: "#FFF176" },
  { aspek: "Perkembangan Sosial-Emosional", nilai: "BSH", color: "#CE93D8" },
  { aspek: "Nilai Agama dan Moral",         nilai: "MB",  color: "#FFCC80" },
  { aspek: "Seni dan Kreativitas",          nilai: "BSH", color: "#80CBC4" },
];

const GURU_KELAS = ["TK A1", "TK A2"];

const anakPerKelas: Record<string, string[]> = {
  "TK A1": ["Aisyah Putri Lestari","Johan Prasetyo","Keysa Aulia Putri","Qonita Azzahra","Rizki Maulana","Salma Rahmawati","Farrel Adhitya","Naura Salsabila"],
  "TK A2": ["Bima Alfarizi","Intan Permata","Luthfi Hakim","Taufik Hidayat","Citra Dewi","Mikael Pratama","Nadira Zahra","Oki Firmansyah"],
};

const semesterOptions    = ["Semester 1", "Semester 2"];
const tahunAjaranOptions = ["2023/2024", "2024/2025", "2025/2026"];
const aspekFilterOptions = ["Semua aspek","Motorik","Kognitif","Bahasa","Sosial-Emosional","Agama & Moral","Seni & Kreativitas"];

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

export default function LaporanPerkembanganGuruPage() {
  const [namaAnak, setNamaAnak]       = useState("");
  const [semester, setSemester]       = useState("Semester 1");
  const [kelas, setKelas]             = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("2024/2025");
  const [aspekFilter, setAspekFilter] = useState("Semua aspek");
  const [showData, setShowData]       = useState(false);

  const komentar = "Anak menunjukkan perkembangan yang sangat baik pada aspek bahasa dan nilai agama moral. Kemampuan motorik terus berkembang dengan kemajuan konsisten. Perlu perhatian lebih pada aspek kognitif, terutama kemampuan berhitung dan mengenal pola sederhana.";

  const hasData = showData && !!namaAnak;
  const namaAnakTersedia = kelas ? (anakPerKelas[kelas] ?? []) : [];
  const riwayatFiltered  = aspekFilter === "Semua aspek" ? dummyRiwayat : dummyRiwayat.filter((r) => r.aspek === aspekFilter);

  const handleKelasChange = (val: string) => { setKelas(val); setNamaAnak(""); setShowData(false); };
  const chartData = aspekList.map((label, i) => ({ name: label, nilai: defaultNilai[i], color: aspekColors[i] }));

  const selectCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white appearance-none pr-8 cursor-pointer transition-all";

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">

      {/* Kelas badge info */}
      <div className="flex items-center gap-2 text-xs text-gray-500">
        <span>Kelas yang Anda ampu:</span>
        {GURU_KELAS.map((k) => (
          <span key={k} className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">{k}</span>
        ))}
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <select value={kelas} onChange={(e) => handleKelasChange(e.target.value)} className={selectCls}>
              <option value="">Pilih kelas</option>
              {GURU_KELAS.map((k) => <option key={k} value={k}>{k}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
          <div className="relative">
            <select value={namaAnak} onChange={(e) => setNamaAnak(e.target.value)} className={selectCls}>
              <option value="">Pilih anak</option>
              {namaAnakTersedia.map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
          <div className="relative">
            <select value={semester} onChange={(e) => setSemester(e.target.value)} className={selectCls}>
              {semesterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDown /></span>
          </div>
          <div className="relative">
            <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className={selectCls}>
              {tahunAjaranOptions.map((t) => <option key={t} value={t}>{t}</option>)}
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
            <FileText size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
            {hasData ? namaAnak.split(" ").map((n) => n[0]).join("").substring(0, 2) : <User size={22} className="text-blue-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{hasData ? namaAnak : <span className="text-gray-400">-</span>}</h3>
            <p className="text-sm text-gray-500">
              {hasData ? `${kelas} • ${semester} • ${tahunAjaran}` : <span className="text-gray-300">Belum ada data dipilih</span>}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-2xl font-bold text-blue-500">{hasData ? 6 : "-"}</p><p className="text-xs text-gray-500">Aspek</p></div>
            <div><p className="text-2xl font-bold text-blue-500">{hasData ? 30 : "-"}</p><p className="text-xs text-gray-500">Penilaian</p></div>
            <div>
              {hasData
                ? <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">BSH</span>
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
          {hasData ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {aspekList.map((label, i) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: aspekColors[i] }} />
                    <span className="text-xs text-gray-600">{label}</span>
                  </div>
                ))}
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={28} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => nilaiLabel[v] ?? v}
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
            {dummyAspekNilai.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-700">{item.aspek}</span>
                </div>
                {hasData
                  ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
                  : <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-300">-</span>}
              </div>
            ))}
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
              {dummyAspekNilai.map((item, i) => (
                <tr key={i} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-700 border-r border-gray-200">{item.aspek}</td>
                  <td className="px-4 py-3">
                    {hasData
                      ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
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
        <h3 className="font-semibold text-gray-800 mb-1">Komentar Guru</h3>
        <p className="text-xs text-gray-500 mb-3">Catatan dan evaluasi</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {hasData ? komentar : <span className="text-gray-300">-</span>}
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
              {hasData && riwayatFiltered.length > 0 ? (
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
                    <td className="px-3 py-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span className="text-xs text-blue-500 hover:text-blue-700 cursor-pointer hover:underline whitespace-nowrap">
                          {item.dokumentasi}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-300">
                    {hasData ? "Tidak ada data untuk aspek ini" : "Pilih filter lalu klik Tampilkan"}
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