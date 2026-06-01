"use client";

import { useState, useEffect } from "react";
import { FileText, User, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

async function apiFetch<T>(path: string): Promise<T> {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      Authorization: `Bearer ${token ?? ""}`,
      Accept: "application/json",
    },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

// ─── TYPES ───────────────────────────────────────────────────────
interface AnakProfil {
  id_anak: number;
  nama_anak: string;
  kelas?: { nama_kelas: string; tahun_ajaran: string };
}
interface RekapAspek {
  aspek: string;
  nilai: string | null;
  jumlah: number;
}
interface RiwayatItem {
  id_observasi: number;
  tanggal: string;
  nilai: string;
  komentar: string | null;
  foto: string | null;
  indikator: {
    nama_indikator: string;
    nama_kegiatan: string | null;
    aspek: { nama_aspek: string };
  };
  guru: { nama_guru: string };
}
interface LaporanData {
  anak: { nama_anak: string; kelas: { nama_kelas: string } };
  rekap_aspek: RekapAspek[];
  riwayat: RiwayatItem[];
  komentar: string;
  total: number;
}

// ─── CONFIG ──────────────────────────────────────────────────────
const ASPEK_COLORS = ["#4DB6AC","#F48FB1","#FFCC80","#CE93D8","#80CBC4","#FFF176"];
const nilaiColorMap: Record<string, string> = {
  BB:  "bg-red-100 text-red-700",
  MB:  "bg-yellow-100 text-yellow-700",
  BSH: "bg-green-100 text-green-700",
  BSB: "bg-blue-100 text-blue-700",
};
const nilaiToNum: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };
const numToNilai: Record<number, string> = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };

const aspekAbbrMap: Record<string, string> = {
  "Perkembangan Motorik":          "FM",
  "Fisik Motorik":                 "FM",
  "Motorik":                       "FM",
  "Perkembangan Kognitif":         "KOG",
  "Kognitif":                      "KOG",
  "Perkembangan Bahasa":           "BHS",
  "Bahasa":                        "BHS",
  "Perkembangan Sosial-Emosional": "SOS-EM",
  "Sosial Emosional":              "SOS-EM",
  "Sosial-Emosional":              "SOS-EM",
  "Nilai Agama dan Moral":         "NAM",
  "Agama dan Moral":               "NAM",
  "Seni dan Kreativitas":          "SENI",
  "Kreativitas/Seni":              "SENI",
  "Seni":                          "SENI",
};

const aspekDefinisi: Record<string, string> = {
  "Perkembangan Motorik": "Kemampuan gerak kasar dan halus, koordinasi tubuh, serta keterampilan fisik anak.",
  "Fisik Motorik": "Kemampuan gerak kasar dan halus, koordinasi tubuh, serta keterampilan fisik anak.",
  "Motorik": "Kemampuan gerak kasar dan halus, koordinasi tubuh, serta keterampilan fisik anak.",
  "Perkembangan Kognitif": "Kemampuan berpikir, memecahkan masalah, mengenal angka dan huruf, mengelompokkan benda, serta memahami sebab-akibat di lingkungan sekitar.",
  "Kognitif": "Kemampuan berpikir, memecahkan masalah, mengenal angka dan huruf, mengelompokkan benda, serta memahami sebab-akibat di lingkungan sekitar.",
  "Perkembangan Bahasa": "Kemampuan mendengar, berbicara, membaca, dan menulis serta mengekspresikan diri melalui bahasa.",
  "Bahasa": "Kemampuan mendengar, berbicara, membaca, dan menulis serta mengekspresikan diri melalui bahasa.",
  "Perkembangan Sosial-Emosional": "Kemampuan berinteraksi, bekerja sama, mengelola emosi, dan membangun hubungan dengan orang lain.",
  "Sosial Emosional": "Kemampuan berinteraksi, bekerja sama, mengelola emosi, dan membangun hubungan dengan orang lain.",
  "Sosial-Emosional": "Kemampuan berinteraksi, bekerja sama, mengelola emosi, dan membangun hubungan dengan orang lain.",
  "Nilai Agama dan Moral": "Pemahaman dan pengamalan nilai agama, moral, serta perilaku baik dalam kehidupan sehari-hari.",
  "Agama dan Moral": "Pemahaman dan pengamalan nilai agama, moral, serta perilaku baik dalam kehidupan sehari-hari.",
  "Seni dan Kreativitas": "Kemampuan mengekspresikan diri melalui seni, musik, tari, dan karya kreatif lainnya.",
  "Kreativitas/Seni": "Kemampuan mengekspresikan diri melalui seni, musik, tari, dan karya kreatif lainnya.",
};

function getAspekAbbr(name: string): string {
  return aspekAbbrMap[name]
    ?? name.split(" ")
           .filter(w => !["Perkembangan","dan","atau"].includes(w))
           .map(w => w.substring(0, 3).toUpperCase())
           .join("");
}

const semesterOptions = ["Semester 1", "Semester 2"];

function getDefaultSemester(): string {
  return new Date().getMonth() + 1 >= 7 ? "Semester 1" : "Semester 2";
}

// ─── Nilai badge untuk PDF (tanpa Tailwind) ───────────────────────────────────
const nilaiPdfStyle: Record<string, { bg: string; color: string }> = {
  BB:  { bg: "#fee2e2", color: "#b91c1c" },
  MB:  { bg: "#fef9c3", color: "#a16207" },
  BSH: { bg: "#dcfce7", color: "#15803d" },
  BSB: { bg: "#dbeafe", color: "#1d4ed8" },
};

const ChevronDownIcon = ({ size = 16 }: { size?: number }) => (
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
        <p className="text-gray-500">{numToNilai[payload[0].value] ?? "-"}</p>
      </div>
    );
  }
  return null;
};

const selectCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white appearance-none pr-8 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed";

// ─── MAIN ────────────────────────────────────────────────────────
export default function LaporanPerkembanganOrangTuaPage() {
  const [anakProfil, setAnakProfil]   = useState<AnakProfil | null>(null);
  const [tahunAjaranList, setTahunAjaranList] = useState<string[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [semester, setSemester]       = useState(getDefaultSemester);
  const [aspekFilter, setAspekFilter] = useState("Semua aspek");

  const [laporan, setLaporan]               = useState<LaporanData | null>(null);
  const [loadingProfil, setLoadingProfil]   = useState(false);
  const [loadingLaporan, setLoadingLaporan] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError]                   = useState("");

  // 1. Fetch profil anak ortu saat mount
  useEffect(() => {
    setLoadingProfil(true);
    apiFetch<AnakProfil>("/orang-tua/profil/anak")
      .then((data) => {
         const anak = Array.isArray(data) ? data[0] : data; // ← ambil index 0
    setAnakProfil(anak);
        // buat daftar tahun ajaran dari tahun kelas anak
        const tahunKelas = anak.kelas?.tahun_ajaran;
        const baseYear = tahunKelas
          ? parseInt(tahunKelas.split("/")[0])
          : new Date().getFullYear() - 1;
        const list = [
  `${baseYear}/${baseYear + 1}`,
  `${baseYear + 1}/${baseYear + 2}`,
  `${baseYear + 2}/${baseYear + 3}`,
];
        setTahunAjaranList(list);
        setTahunAjaran(tahunKelas ?? list[0]);
      })
      .catch(() => setError("Gagal memuat data profil anak."))
      .finally(() => setLoadingProfil(false));
  }, []);

  // 2. Tampilkan laporan
  const handleTampilkan = () => {
    console.log("anakProfil:", anakProfil)
    if (!anakProfil) { setError("Data anak tidak ditemukan."); return; }
    setError("");
    setLoadingLaporan(true);
    apiFetch<LaporanData>(`/observasi/anak/${anakProfil.id_anak}?semester=${encodeURIComponent(semester)}`)
      .then(setLaporan)
      .catch(() => setError("Gagal memuat laporan. Coba lagi."))
      .finally(() => setLoadingLaporan(false));
  };

  // Hitung nilai rata-rata per aspek untuk chart & ringkasan
const rekapWithNilai = (laporan?.rekap_aspek ?? []).map((item) => {
  const nilaiPerAspek = (laporan?.riwayat ?? [])
    .filter((r) => r.indikator?.aspek?.nama_aspek === item.aspek)
    .map((r) => nilaiToNum[r.nilai] ?? 0)
    .filter(Boolean);
  if (nilaiPerAspek.length === 0) return { ...item, nilai: null };
  const rata = nilaiPerAspek.reduce((a, b) => a + b, 0) / nilaiPerAspek.length;
  return { ...item, nilai: numToNilai[Math.round(rata)] ?? null };
});

  // Data untuk chart
  const chartData = rekapWithNilai.map((item, i) => ({
    name: getAspekAbbr(item.aspek),
    fullName: item.aspek,
    nilai: nilaiToNum[item.nilai ?? ""] ?? 0,
    color: ASPEK_COLORS[i % ASPEK_COLORS.length],
  }));

  // Filter riwayat
  const aspekOptions = ["Semua aspek", ...new Set((laporan?.riwayat ?? []).map((r) => r.indikator?.aspek?.nama_aspek).filter(Boolean))];
  const riwayatFiltered = aspekFilter === "Semua aspek"
    ? (laporan?.riwayat ?? [])
    : (laporan?.riwayat ?? []).filter((r) => r.indikator?.aspek?.nama_aspek === aspekFilter);

  // Rata-rata nilai
  const nilaiList = (laporan?.riwayat ?? [])
  .map((r) => nilaiToNum[r.nilai] ?? 0)
  .filter(Boolean);

const rataRata = nilaiList.length > 0
  ? numToNilai[Math.round(nilaiList.reduce((a, b) => a + b, 0) / nilaiList.length)]
  : null;

  const namaAnak = laporan?.anak?.nama_anak ?? anakProfil?.nama_anak ?? "";
  const initials = namaAnak.split(" ").map((n) => n[0]).join("").substring(0, 2);

  // ─── Export PDF ───────────────────────────────────────────────
    const handleExportPDF = async () => {
      if (!laporan) return;
      setLoadingPdf(true);
      try {
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = 210;
        const pageH = 297;
        const margin = 14;
        const contentW = pageW - margin * 2;
        let y = margin;
  
        // ── Header ──
        pdf.setFillColor(37, 99, 235);
        pdf.rect(0, 0, pageW, 24, "F");
        pdf.setTextColor(255, 255, 255);
        pdf.setFontSize(13);
        pdf.setFont("helvetica", "bold");
        pdf.text("LAPORAN PERKEMBANGAN ANAK", pageW / 2, 9, { align: "center" });
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "normal");
        pdf.text("TK AL MUHAJIRIN DOTAMANA", pageW / 2, 16, { align: "center" });
        const tglCetak = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
        pdf.setFontSize(7);
        pdf.text(`Dicetak: ${tglCetak}`, pageW - margin, 22, { align: "right" });
        y = 32;
  
        // ── Info Anak ──
        pdf.setLineWidth(0.1);
        pdf.setDrawColor(229, 231, 235);
        pdf.setFillColor(249, 250, 251);
        pdf.roundedRect(margin, y, contentW, 32, 3, 3, "FD");
  
        const col1X = margin + 5;
        const col2X = margin + 90;
        const labelColor: [number, number, number] = [107, 114, 128];
        const valueColor: [number, number, number] = [31, 41, 55];
  
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(...labelColor);
        pdf.text("Nama", col1X, y + 8);
        pdf.text("Kelas", col1X, y + 16);
        pdf.text("Semester", col1X, y + 24);
        pdf.text("Tahun Ajaran", col2X, y + 8);
        pdf.text("Total Aspek", col2X, y + 16);
        pdf.text("Total Penilaian", col2X, y + 24);
  
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(...valueColor);
        pdf.text(`: ${namaAnak}`, col1X + 22, y + 8);
        pdf.text(`: ${laporan?.anak?.kelas?.nama_kelas ?? ""}`, col1X + 22, y + 16);
        pdf.text(`: ${semester.replace("Semester ", "")}`, col1X + 22, y + 24);
        pdf.text(`: ${tahunAjaran}`, col2X + 28, y + 8);
        pdf.text(`: ${rekapWithNilai.length}`, col2X + 28, y + 16);
        pdf.text(`: ${laporan.total}`, col2X + 28, y + 24);
        y += 40;
  
        // ── Grafik Perkembangan ──
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(31, 41, 55);
        pdf.text("Grafik Perkembangan", margin, y);
        y += 5;
  
        pdf.setDrawColor(229, 231, 235);
        pdf.setFillColor(249, 250, 251);
        const chartBoxH = 55;
        pdf.roundedRect(margin, y, contentW, chartBoxH, 3, 3, "FD");
  
        if (chartData.length > 0) {
          const chartPadL = 18;
          const chartPadR = 10;
          const chartPadT = 6;
          const chartPadB = 14;
          const chartInnerW = contentW - chartPadL - chartPadR;
          const chartInnerH = chartBoxH - chartPadT - chartPadB;
          const barCount = chartData.length;
          const barW = Math.min(14, (chartInnerW / barCount) - 4);
          const gap = (chartInnerW - barW * barCount) / (barCount + 1);
          const maxVal = 4;
          const chartBaseY = y + chartPadT + chartInnerH;
          const chartStartX = margin + chartPadL;
  
          // Garis horizontal Y
          [1, 2, 3, 4].forEach(v => {
            const lineY = chartBaseY - (v / maxVal) * chartInnerH;
            pdf.setDrawColor(229, 231, 235);
            pdf.setLineWidth(0.2);
            pdf.line(chartStartX, lineY, chartStartX + chartInnerW, lineY);
            pdf.setFontSize(6);
            pdf.setTextColor(156, 163, 175);
            pdf.setFont("helvetica", "normal");
            pdf.text(["", "BB", "MB", "BSH", "BSB"][v], chartStartX - 2, lineY + 1.5, { align: "right" });
          });
  
          // Tutup sumbu vertikal
          pdf.setFillColor(249, 250, 251);
          pdf.rect(margin + 1, y + chartPadT, chartPadL - 2, chartInnerH + 1, "F");
  
          // Bar + label
          chartData.forEach((item, i) => {
            const barX = chartStartX + gap + i * (barW + gap);
            const barH = item.nilai > 0 ? (item.nilai / maxVal) * chartInnerH : 0;
            const barY = chartBaseY - barH;
            const hex = item.color;
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            pdf.setFillColor(r, g, b);
            pdf.roundedRect(barX, barY, barW, barH > 0 ? barH : 0.5, 1.5, 1.5, "F");
            if (item.nilai > 0) {
              pdf.setFontSize(6.5);
              pdf.setFont("helvetica", "bold");
              pdf.setTextColor(75, 85, 99);
              pdf.text(numToNilai[item.nilai] ?? "", barX + barW / 2, barY - 1.5, { align: "center" });
            }
            pdf.setFontSize(6);
            pdf.setFont("helvetica", "normal");
            pdf.setTextColor(107, 114, 128);
            pdf.text(item.name, barX + barW / 2, chartBaseY + 5, { align: "center" });
          });
        }
        y += chartBoxH + 6;
  
        // ── Rekap Aspek ──
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(31, 41, 55);
        pdf.text("Rekap Aspek Perkembangan", margin, y);
        y += 5;
  
        pdf.setFillColor(37, 99, 235);
        pdf.rect(margin, y, contentW, 7, "F");
        pdf.setFontSize(8);
        pdf.setTextColor(255, 255, 255);
        pdf.setFont("helvetica", "bold");
        pdf.text("No", margin + 4, y + 4.8);
        pdf.text("Aspek Perkembangan", margin + 14, y + 4.8);
        pdf.text("Nilai", margin + 120, y + 4.8);
        pdf.text("Jumlah Penilaian", margin + 145, y + 4.8);
        y += 7;
  
        rekapWithNilai.forEach((item, i) => {
          const rowH = 7;
          pdf.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 251);
          pdf.rect(margin, y, contentW, rowH, "F");
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(8);
          pdf.setTextColor(75, 85, 99);
          pdf.text(String(i + 1), margin + 4, y + 4.8);
          pdf.text(item.aspek, margin + 14, y + 4.8);
          if (item.nilai && nilaiPdfStyle[item.nilai]) {
            const { bg, color } = nilaiPdfStyle[item.nilai];
            pdf.setFillColor(bg);
            pdf.roundedRect(margin + 116, y + 1.2, 14, 4.5, 1.5, 1.5, "F");
            pdf.setTextColor(color);
            pdf.setFont("helvetica", "bold");
            pdf.text(item.nilai, margin + 123, y + 4.8, { align: "center" });
          } else {
            pdf.setTextColor(156, 163, 175);
            pdf.text("-", margin + 123, y + 4.8, { align: "center" });
          }
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(75, 85, 99);
          pdf.text(`${item.jumlah} penilaian`, margin + 145, y + 4.8);
          pdf.setDrawColor(229, 231, 235);
          pdf.setLineWidth(0.2);
          pdf.line(margin, y + rowH, margin + contentW, y + rowH);
          y += rowH;
        });
        y += 6;
  
        // ── Komentar Guru ──
        if (laporan.komentar) {
          if (y > pageH - 40) { pdf.addPage(); y = margin; }
          pdf.setFontSize(10);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(31, 41, 55);
          pdf.text("Komentar Guru", margin, y);
          y += 5;
          pdf.setFillColor(249, 250, 251);
          pdf.setDrawColor(229, 231, 235);
          pdf.setLineWidth(0.1);
          const komentarLines = pdf.splitTextToSize(laporan.komentar, contentW - 8);
          const komentarH = komentarLines.length * 4.5 + 6;
          pdf.roundedRect(margin, y, contentW, komentarH, 3, 3, "FD");
          pdf.setFontSize(8.5);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(75, 85, 99);
          pdf.text(komentarLines, margin + 4, y + 5);
          y += komentarH + 6;
        }
  
        // ── Riwayat Penilaian ──
        if (y > pageH - 50) { pdf.addPage(); y = margin; }
        pdf.setFontSize(10);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(31, 41, 55);
        pdf.text("Riwayat Penilaian", margin, y);
        y += 5;
  
        const drawRiwayatHeader = () => {
          pdf.setFillColor(37, 99, 235);
          pdf.rect(margin, y, contentW, 7, "F");
          pdf.setFontSize(7.5);
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(255, 255, 255);
          pdf.text("No", margin + 2, y + 4.8);
          pdf.text("Tanggal", margin + 10, y + 4.8);
          pdf.text("Aspek", margin + 33, y + 4.8);
          pdf.text("Kegiatan", margin + 70, y + 4.8);
          pdf.text("Indikator", margin + 110, y + 4.8);
          pdf.text("Nilai", margin + 163, y + 4.8);
          y += 7;
        };
        drawRiwayatHeader();
  
        (laporan.riwayat ?? []).forEach((item, i) => {
          const rowH = 8;
          if (y + rowH > pageH - margin) {
            pdf.addPage();
            y = margin;
            drawRiwayatHeader();
          }
          pdf.setFillColor(i % 2 === 0 ? 255 : 249, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 251);
          pdf.rect(margin, y, contentW, rowH, "F");
          pdf.setFont("helvetica", "normal");
          pdf.setFontSize(7.5);
          pdf.setTextColor(75, 85, 99);
          pdf.text(String(i + 1), margin + 2, y + 5);
          pdf.text(item.tanggal ?? "-", margin + 10, y + 5);
          pdf.text(pdf.splitTextToSize(item.indikator?.aspek?.nama_aspek ?? "-", 32)[0], margin + 33, y + 5);
          pdf.text(pdf.splitTextToSize(item.indikator?.nama_kegiatan ?? "-", 36)[0], margin + 70, y + 5);
          pdf.text(pdf.splitTextToSize(item.indikator?.nama_indikator ?? "-", 48)[0], margin + 110, y + 5);
          if (item.nilai && nilaiPdfStyle[item.nilai]) {
            const { bg, color } = nilaiPdfStyle[item.nilai];
            pdf.setFillColor(bg);
            pdf.roundedRect(margin + 159, y + 1.5, 14, 5, 1.5, 1.5, "F");
            pdf.setTextColor(color);
            pdf.setFont("helvetica", "bold");
            pdf.text(item.nilai, margin + 166, y + 5, { align: "center" });
          }
          pdf.setDrawColor(229, 231, 235);
          pdf.setLineWidth(0.2);
          pdf.line(margin, y + rowH, margin + contentW, y + rowH);
          y += rowH;
        });
  
        // ── Footer ──
        const totalPages = (pdf as any).internal.getNumberOfPages();
        for (let p = 1; p <= totalPages; p++) {
          pdf.setPage(p);
          pdf.setFontSize(7.5);
          pdf.setFont("helvetica", "normal");
          pdf.setTextColor(156, 163, 175);
          pdf.text(
            `Halaman ${p} dari ${totalPages}  •  TK Al Muhajirin Dotamana  •  Dicetak ${tglCetak}`,
            pageW / 2, pageH - 6, { align: "center" }
          );
        }
  
        const fileName = `Laporan_${namaAnak.replace(/\s+/g, "_")}_${semester.replace(" ", "")}_${tahunAjaran.replace("/", "-")}.pdf`;
        pdf.save(fileName);
      } catch (err) {
        console.error(err);
        setError("Gagal membuat PDF. Coba lagi.");
      }
      setLoadingPdf(false);
    };

  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 ml-4">✕</button>
        </div>
      )}

      {/* Filter — hanya tahun ajaran & semester */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">

          {/* 1. Tahun Ajaran */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tahun Ajaran</label>
            {loadingProfil ? (
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-gray-50">
                <Loader2 size={14} className="animate-spin" /> Memuat...
              </div>
            ) : (
              <>
                <select value={tahunAjaran} onChange={(e) => { setTahunAjaran(e.target.value); setLaporan(null); }} className={selectCls}>
                  <option value="">Pilih tahun ajaran</option>
                  {tahunAjaranList.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 bottom-3 text-gray-400"><ChevronDownIcon /></span>
              </>
            )}
          </div>

          {/* 2. Semester */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Semester</label>
            <select value={semester} onChange={(e) => { setSemester(e.target.value); setLaporan(null); }} disabled={!tahunAjaran} className={selectCls}>
              {semesterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 bottom-3 text-gray-400"><ChevronDownIcon /></span>
          </div>

        </div>
        <div className="flex gap-2">
          <button onClick={handleTampilkan} disabled={loadingLaporan || loadingProfil || !anakProfil}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
            {loadingLaporan && <Loader2 size={14} className="animate-spin" />}
            {loadingLaporan ? "Memuat..." : "Tampilkan"}
          </button>
          <button
  onClick={handleExportPDF}
  disabled={!laporan || loadingPdf}
  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
  {loadingPdf
    ? <><Loader2 size={14} className="animate-spin" /> Membuat PDF...</>
    : <><FileText size={16} /> Export PDF</>}
</button>
        </div>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
            {loadingProfil
              ? <Loader2 size={18} className="animate-spin text-blue-400" />
              : laporan ? initials : <User size={22} className="text-blue-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {namaAnak || <span className="text-gray-400">-</span>}
            </h3>
            <p className="text-sm text-gray-500">
              {laporan
                ? `${laporan.anak.kelas?.nama_kelas ?? anakProfil?.kelas?.nama_kelas ?? ""} • ${semester} • ${tahunAjaran}`
                : <span className="text-gray-300">Belum ada data dipilih</span>}
            </p>
          </div>
          <div className="flex gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-500">{laporan ? laporan.rekap_aspek.length : "-"}</p>
              <p className="text-xs text-gray-500">Aspek</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-500">{laporan ? laporan.total : "-"}</p>
              <p className="text-xs text-gray-500">Penilaian</p>
            </div>
            <div>
              {laporan && rataRata
                ? <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${nilaiColorMap[rataRata]}`}>{rataRata}</span>
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
          {laporan && chartData.length > 0 ? (
            <>
              <div className="flex flex-wrap gap-2 mb-4">
                {chartData.map((item, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={36} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => numToNilai[v] ?? v}
                      tick={{ fontSize: 10, fill: "#9ca3af" }} axisLine={false} tickLine={false} width={40} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                    <Bar dataKey="nilai" radius={[8, 8, 0, 0]} minPointSize={4}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-300 text-sm">
              {loadingLaporan ? <Loader2 size={20} className="animate-spin text-blue-400" /> : "Belum ada data"}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Ringkasan Aspek</h3>
          <p className="text-xs text-gray-500 mb-4">Capaian setiap aspek perkembangan</p>
          <div className="space-y-3">
            {laporan && rekapWithNilai.length > 0 ? (
              rekapWithNilai.map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ASPEK_COLORS[i % ASPEK_COLORS.length] }} />
                    <span className="text-sm text-gray-700">{item.aspek}</span>
                  </div>
                  {item.nilai
                    ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
                    : <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">-</span>}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-300 text-sm py-8">
                {loadingLaporan ? <Loader2 size={20} className="animate-spin text-blue-400 mx-auto" /> : "Belum ada data"}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabel Nilai Aspek */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-4">Tabel Nilai Aspek Perkembangan</h3>
        <div className="rounded-xl border border-gray-200 overflow-visible">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-12">No</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-1/2">Aspek Perkembangan</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-1/4">Nilai</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-1/4">Jumlah Penilaian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {laporan && rekapWithNilai.length > 0 ? (
                rekapWithNilai.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-500 text-center border-r border-gray-200">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-700 border-r border-gray-200">
                      <div className="flex items-center gap-2 group relative">
                        <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ASPEK_COLORS[i % ASPEK_COLORS.length] }} />
                        <span className="cursor-default">{item.aspek}</span>
                        {aspekDefinisi[item.aspek] && (
                          <div className="absolute left-0 bottom-full mb-2 z-50 hidden group-hover:block bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-80">
                            <p className="text-xs font-semibold mb-1" style={{ color: ASPEK_COLORS[i % ASPEK_COLORS.length] }}>{item.aspek}</p>
                            <p className="text-xs text-gray-500 leading-relaxed">{aspekDefinisi[item.aspek]}</p>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-gray-200">
                      {item.nilai
                        ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
                        : <span className="text-gray-300 text-xs">-</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs">{item.jumlah} penilaian</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-300 text-sm">
                    {loadingLaporan ? "Memuat..." : "Pilih filter lalu klik Tampilkan"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Komentar Guru */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <h3 className="font-semibold text-gray-800 mb-1">Komentar Guru</h3>
        <p className="text-xs text-gray-500 mb-3">Catatan dan evaluasi dari wali kelas</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {laporan?.komentar
            ? laporan.komentar
            : <span className="text-gray-300">-</span>}
        </p>
      </div>

      {/* Riwayat Penilaian */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Riwayat Penilaian</h3>
          <div className="relative">
            <select value={aspekFilter} onChange={(e) => setAspekFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8 cursor-pointer min-w-[160px]">
              {aspekOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDownIcon /></span>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "720px" }}>
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                {["No","Tanggal","Aspek","Kegiatan","Indikator","Nilai","Foto"].map((h, i) => (
                  <th key={h} className={`px-3 py-3 text-xs font-bold text-gray-700 border-r border-gray-200 last:border-r-0 ${i >= 5 ? "text-center" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riwayatFiltered.length > 0 ? (
                riwayatFiltered.map((item, index) => (
                  <tr key={item.id_observasi} className="hover:bg-gray-50">
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-200">{index + 1}</td>
                    <td className="px-3 py-3 text-gray-600 border-r border-gray-200 whitespace-nowrap">{item.tanggal}</td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200 whitespace-nowrap">{item.indikator?.aspek?.nama_aspek ?? "-"}</td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200">{item.indikator?.nama_kegiatan ?? "-"}</td>
                    <td className="px-3 py-3 text-gray-700 border-r border-gray-200">{item.indikator?.nama_indikator ?? "-"}</td>
                    <td className="px-3 py-3 text-center border-r border-gray-200">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai] ?? "bg-gray-100 text-gray-500"}`}>{item.nilai}</span>
                    </td>
                    <td className="px-3 py-3 text-center">
                      {item.foto ? (
                        <a href={`${process.env.NEXT_PUBLIC_API_URL?.replace("/api","")}/storage/${item.foto}`}
                          target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:text-blue-700 hover:underline whitespace-nowrap flex items-center justify-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          Lihat
                        </a>
                      ) : (
                        <span className="text-xs text-gray-300">-</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-gray-300">
                    {loadingLaporan
                      ? <Loader2 size={16} className="animate-spin text-blue-400 mx-auto" />
                      : laporan ? "Tidak ada data untuk aspek ini" : "Pilih filter lalu klik Tampilkan"}
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
