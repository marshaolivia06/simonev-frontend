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
    headers: { Authorization: `Bearer ${token ?? ""}`, Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const json = await res.json();
  return json.data as T;
}

// ─── TYPES ───────────────────────────────────────────────────────
interface AnakProfil { id_anak: number; nama_anak: string; tanggal_lahir?: string; kelas?: { nama_kelas: string; tahun_ajaran: string; id_guru?: number | null; guru?: { nama_guru: string; nip?: string | null; foto_ttd?: string | null } } }
interface GuruProfil { nama_guru: string; nip: string | null; foto_ttd: string | null }
interface RekapAspek { aspek: string; nilai: string | null; jumlah: number }
interface RiwayatItem {
  id_observasi: number; tanggal: string; nilai: string; komentar: string | null; foto: string | null;
  indikator: { nama_indikator: string; nama_kegiatan: string | null; aspek: { nama_aspek: string } };
  guru: { nama_guru: string };
}
interface LaporanData {
  anak: { nama_anak: string; kelas: { nama_kelas: string } };
  rekap_aspek: RekapAspek[]; riwayat: RiwayatItem[]; komentar: string; total: number;
}
interface ProfilSekolah {
  nama_sekolah: string; nama_kepala_sekolah: string; nip_kepala_sekolah: string; foto_ttd_ks: string | null;
}

// ─── CONFIG ──────────────────────────────────────────────────────
const ASPEK_COLORS = ["#4DB6AC", "#F48FB1", "#FFCC80", "#CE93D8", "#80CBC4", "#FFF176"];
const nilaiColorMap: Record<string, string> = { BB: "bg-red-100 text-red-700", MB: "bg-yellow-100 text-yellow-700", BSH: "bg-green-100 text-green-700", BSB: "bg-blue-100 text-blue-700" };
const nilaiToNum: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };
const numToNilai: Record<number, string> = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };
const aspekAbbrMap: Record<string, string> = {
  "Perkembangan Motorik": "FM", "Fisik Motorik": "FM", "Motorik": "FM",
  "Perkembangan Kognitif": "KOG", "Kognitif": "KOG",
  "Perkembangan Bahasa": "BHS", "Bahasa": "BHS",
  "Perkembangan Sosial-Emosional": "SOS-EM", "Sosial Emosional": "SOS-EM", "Sosial-Emosional": "SOS-EM",
  "Nilai Agama dan Moral": "NAM", "Agama dan Moral": "NAM",
  "Seni dan Kreativitas": "SENI", "Kreativitas/Seni": "SENI", "Seni": "SENI",
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
  return aspekAbbrMap[name] ?? name.split(" ").filter(w => !["Perkembangan", "dan", "atau"].includes(w)).map(w => w.substring(0, 3).toUpperCase()).join("");
}
function hitungUmur(tanggalLahir: string): string {
  const lahir = new Date(tanggalLahir);
  const sekarang = new Date();
  let tahun = sekarang.getFullYear() - lahir.getFullYear();
  let bulan = sekarang.getMonth() - lahir.getMonth();
  if (bulan < 0) { tahun--; bulan += 12; }
  if (tahun === 0) return `${bulan} Bulan`;
  if (bulan === 0) return `${tahun} Tahun`;
  return `${tahun} Tahun ${bulan} Bulan`;
}
function formatTanggal(tanggal: string): string {
  return new Date(tanggal).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
}
async function loadImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const res = await fetch(url); if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => resolve(reader.result as string); reader.onerror = reject; reader.readAsDataURL(blob); });
  } catch { return null; }
}
function toApiStorageUrl(path: string): string {
  const parts = path.split("/");
  return `${API_URL}/storage-file/${parts[0]}/${parts.slice(1).join("/")}`;
}

function getBulanValue(tanggal: string): string {
  const d = new Date(tanggal);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function getBulanLabel(value: string): string {
  const [y, m] = value.split("-");
  const d = new Date(Number(y), Number(m) - 1, 1);
  return d.toLocaleDateString("id-ID", { month: "long" }); // tanpa tahun
}

function getDefaultSemester(): string { return new Date().getMonth() + 1 >= 7 ? "Semester 1" : "Semester 2"; }

const semesterOptions = ["Semester 1", "Semester 2"];
const ChevronDownIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
);
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) return <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-lg"><p className="font-semibold text-gray-700">{label}</p><p className="text-gray-500">{numToNilai[payload[0].value] ?? "-"}</p></div>;
  return null;
};
const selectCls = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white appearance-none pr-8 cursor-pointer transition-all disabled:opacity-40 disabled:cursor-not-allowed";

// ─── MAIN ────────────────────────────────────────────────────────
export default function LaporanPerkembanganOrangTuaPage() {
  const [anakProfil, setAnakProfil] = useState<AnakProfil | null>(null);
  const [tahunAjaranList, setTahunAjaranList] = useState<string[]>([]);
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [semester, setSemester] = useState(getDefaultSemester);
  const [aspekFilter, setAspekFilter] = useState("Semua aspek");
  const [bulanFilter, setBulanFilter] = useState("Semua bulan");
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [waliKelasProfil, setWaliKelasProfil] = useState<GuruProfil | null>(null);
  const [loadingProfil, setLoadingProfil] = useState(false);
  const [loadingLaporan, setLoadingLaporan] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
  setLoadingProfil(true);
  apiFetch<AnakProfil>("/orang-tua/profil/anak")
    .then((data) => {
      const anak = Array.isArray(data) ? data[0] : data;
      setAnakProfil(anak);
      const tahunKelas = anak.kelas?.tahun_ajaran;
      const baseYear = tahunKelas ? parseInt(tahunKelas.split("/")[0]) : new Date().getFullYear() - 1;
      const list = [
        `${baseYear}/${baseYear + 1}`,
        `${baseYear + 1}/${baseYear + 2}`,
        `${baseYear + 2}/${baseYear + 3}`,
        `${baseYear + 3}/${baseYear + 4}`,
        `${baseYear + 4}/${baseYear + 5}`,
      ];
      setTahunAjaranList(list);
      setTahunAjaran(tahunKelas ?? list[0]);
      if (anak.kelas?.guru) {
        setWaliKelasProfil({
          nama_guru: anak.kelas.guru.nama_guru,
          nip: anak.kelas.guru.nip ?? null,
          foto_ttd: anak.kelas.guru.foto_ttd ?? null,
        });
      }
    })   // ← ini yang tadinya hilang
    .catch(() => setError("Gagal memuat data profil anak."))
    .finally(() => setLoadingProfil(false));
}, []);

  const handleTampilkan = () => {
    if (!anakProfil) { setError("Data anak tidak ditemukan."); return; }
    setError(""); setLoadingLaporan(true);
    apiFetch<LaporanData>(`/observasi/anak/${anakProfil.id_anak}?semester=${encodeURIComponent(semester)}`)
      .then((data) => { setLaporan(data); setBulanFilter("Semua bulan"); })
      .catch(() => setError("Gagal memuat laporan. Coba lagi."))
      .finally(() => setLoadingLaporan(false));
  };

  const rekapWithNilai = (laporan?.rekap_aspek ?? []).map((item) => {
    const vals = (laporan?.riwayat ?? []).filter(r => r.indikator?.aspek?.nama_aspek === item.aspek).map(r => nilaiToNum[r.nilai] ?? 0).filter(Boolean);
    if (!vals.length) return { ...item, nilai: null };
    return { ...item, nilai: numToNilai[Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)] ?? null };
  });

  // Komentar terbaru dari riwayat
  const getKomentarTerbaru = (): string => {
    if (!laporan?.riwayat?.length) return laporan?.komentar ?? "";
    const withKomentar = [...laporan.riwayat]
      .filter((r) => r.komentar && r.komentar.trim() !== "")
      .sort((a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime());
    return withKomentar[0]?.komentar ?? laporan?.komentar ?? "";
  };

  const chartData = rekapWithNilai.map((item, i) => ({ name: getAspekAbbr(item.aspek), fullName: item.aspek, nilai: nilaiToNum[item.nilai ?? ""] ?? 0, color: ASPEK_COLORS[i % ASPEK_COLORS.length] }));
  const aspekOptions = ["Semua aspek", ...new Set((laporan?.riwayat ?? []).map(r => r.indikator?.aspek?.nama_aspek).filter(Boolean))];
  const bulanOptions = ["Semua bulan", ...new Set((laporan?.riwayat ?? []).map(r => getBulanValue(r.tanggal)))].sort();

  const riwayatFiltered = (laporan?.riwayat ?? []).filter(r => {
    const matchAspek = aspekFilter === "Semua aspek" || r.indikator?.aspek?.nama_aspek === aspekFilter;
    const matchBulan = bulanFilter === "Semua bulan" || getBulanValue(r.tanggal) === bulanFilter;
    return matchAspek && matchBulan;
  });
  const nilaiAspekList = rekapWithNilai.map(item => nilaiToNum[item.nilai ?? ""] ?? 0).filter(Boolean);
  const rataRata = nilaiAspekList.length > 0 ? numToNilai[Math.round(nilaiAspekList.reduce((a, b) => a + b, 0) / nilaiAspekList.length)] : null;
  const namaAnak = laporan?.anak?.nama_anak ?? anakProfil?.nama_anak ?? "";
  const kelasNama = laporan?.anak?.kelas?.nama_kelas ?? anakProfil?.kelas?.nama_kelas ?? "";
  const initials = namaAnak.split(" ").map(n => n[0]).join("").substring(0, 2);
  const komentarTerbaru = getKomentarTerbaru();

  // ─── Export PDF ──────────────
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

      const tglCetak = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
      const nomorRapor = `R-${tahunAjaran.replace("/", "")}-${String(anakProfil?.id_anak ?? "").padStart(3, "0")}`;
      const semesterLabel = semester === "Semester 1" ? "1 (Ganjil)" : "2 (Genap)";

      const ps = await apiFetch<ProfilSekolah>("/profil-sekolah").catch(() => ({ nama_sekolah: "TK AL MUHAJIRIN DOTAMANA", nama_kepala_sekolah: "Kepala Sekolah", nip_kepala_sekolah: "", foto_ttd_ks: null } as ProfilSekolah));
      const [logo, ttdKS, ttdGuru] = await Promise.all([
        loadImageAsDataUrl("/logo-sekolah.png"),
        ps.foto_ttd_ks ? loadImageAsDataUrl(toApiStorageUrl(ps.foto_ttd_ks)) : Promise.resolve(null),
        waliKelasProfil?.foto_ttd ? loadImageAsDataUrl(toApiStorageUrl(waliKelasProfil.foto_ttd)) : Promise.resolve(null),
      ]);
      const namaKS = ps.nama_kepala_sekolah || "Kepala Sekolah";
      const nipKS = ps.nip_kepala_sekolah || "";
      const namaWaliKelas = waliKelasProfil?.nama_guru || "Wali Kelas";
      const nipWaliKelas = waliKelasProfil?.nip || "";

      const setLineGray = () => pdf.setDrawColor(160, 160, 160);
      const setLineDark = () => pdf.setDrawColor(0, 0, 0);

      // ── HEADER ──
      const headerH = 38;
      const rightColW = 44;
      const leftColW = 28;

      setLineGray();
      pdf.setLineWidth(0.5);
      pdf.rect(margin, y, contentW, headerH, "S");

      setLineGray();
      pdf.setLineWidth(0.4);
      pdf.line(margin + leftColW, y, margin + leftColW, y + headerH);
      pdf.line(margin + contentW - rightColW, y, margin + contentW - rightColW, y + headerH);
      pdf.line(margin + contentW - rightColW, y + headerH / 2, margin + contentW, y + headerH / 2);

      if (logo) {
        const logoSize = 24;
        const logoX = margin + (leftColW - logoSize) / 2;
        const logoY = y + (headerH - logoSize) / 2;
        pdf.addImage(logo, "PNG", logoX, logoY, logoSize, logoSize);
      }

      const titleAreaX = margin + leftColW;
      const titleAreaW = contentW - leftColW - rightColW;
      const titleCenterX = titleAreaX + titleAreaW / 2;

      pdf.setFontSize(14);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      const line1Y = y + 10;
      pdf.text("LAPORAN PERKEMBANGAN ANAK", titleCenterX, line1Y, { align: "center" });
      const line1W = pdf.getTextWidth("LAPORAN PERKEMBANGAN ANAK");
      pdf.setLineWidth(0.35);
      pdf.line(titleCenterX - line1W / 2, line1Y + 1, titleCenterX + line1W / 2, line1Y + 1);

      pdf.setFontSize(11);
      pdf.setFont("helvetica", "bold");
      const namaSekolah = ps.nama_sekolah || "TK AL MUHAJIRIN DOTAMANA";
      pdf.text(namaSekolah, titleCenterX, y + 20, { align: "center" });

      pdf.setFontSize(9.5);
      pdf.setFont("helvetica", "normal");
      pdf.text(`TAHUN AJARAN ${tahunAjaran}`, titleCenterX, y + 29, { align: "center" });

      const rightColX = margin + contentW - rightColW;
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Nomor Rapor", rightColX + 3, y + 6);
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(nomorRapor, rightColX + 3, y + 13);
      pdf.setFontSize(7.5);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(80, 80, 80);
      pdf.text("Semester", rightColX + 3, y + headerH / 2 + 6);
      pdf.setFontSize(8.5);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text(semesterLabel, rightColX + 3, y + headerH / 2 + 13);

      y += headerH + 6;

      // ── IDENTITAS ANAK ──
      setLineGray();
      pdf.setLineWidth(0.3);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("IDENTITAS ANAK", margin + 3, y + 5);
      y += 7;

      setLineGray();
      pdf.rect(margin, y, contentW, 28, "S");

      const tglLahirAnak = anakProfil?.tanggal_lahir ?? "";
      const umurAnak = tglLahirAnak ? hitungUmur(tglLahirAnak) : "-";
      const tglLahirFormatted = tglLahirAnak ? formatTanggal(tglLahirAnak) : "-";

      const col1x = margin + 4;
      const col2x = margin + 94;

      const rows1 = [
        ["Nama", namaAnak],
        ["Kelas", kelasNama],
        ["Semester", semesterLabel],
      ];
      const rows2 = [
        ["Tahun Ajaran", tahunAjaran],
        ["Tanggal Lahir", tglLahirFormatted],
        ["Usia", umurAnak],
      ];

      rows1.forEach(([label, value], i) => {
        const rowY = y + 6 + i * 8;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(60, 60, 60);
        pdf.text(label, col1x, rowY);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`: ${value}`, col1x + 22, rowY);
      });

      rows2.forEach(([label, value], i) => {
        const rowY = y + 6 + i * 8;
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8.5);
        pdf.setTextColor(60, 60, 60);
        pdf.text(label, col2x, rowY);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`: ${value}`, col2x + 28, rowY);
      });

      y += 36;

      // ── ASPEK PERKEMBANGAN ──
      setLineGray();
      pdf.setLineWidth(0.3);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("ASPEK PERKEMBANGAN", margin + 3, y + 5);
      y += 7;

      // Kolom: No | Aspek Perkembangan | Definisi Aspek | Nilai
      const colWidths = [10, 42, 0, 18];
      colWidths[2] = contentW - colWidths[0] - colWidths[1] - colWidths[3];
      const colX = [
        margin,
        margin + colWidths[0],
        margin + colWidths[0] + colWidths[1],
        margin + colWidths[0] + colWidths[1] + colWidths[2],
      ];

      // Header tabel aspek
      setLineGray();
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("No", colX[0] + colWidths[0] / 2, y + 4.8, { align: "center" });
      pdf.text("Aspek Perkembangan", colX[1] + 3, y + 4.8);
      pdf.text("Definisi Aspek", colX[2] + 3, y + 4.8);
      pdf.text("Nilai", colX[3] + colWidths[3] / 2, y + 4.8, { align: "center" });
      [1, 2, 3].forEach((ci) => {
        setLineGray();
        pdf.line(colX[ci], y, colX[ci], y + 7);
      });
      setLineGray();
      pdf.line(margin + contentW, y, margin + contentW, y + 7);
      y += 7;

      rekapWithNilai.forEach((item, i) => {
        const definisi = aspekDefinisi[item.aspek] ?? "-";
        const definisiLines = pdf.splitTextToSize(definisi, colWidths[2] - 5);
        const rowH = Math.max(10, definisiLines.length * 4.5 + 4);

        setLineGray();
        pdf.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 250);
        pdf.rect(margin, y, contentW, rowH, "FD");
        [1, 2, 3].forEach((ci) => {
          setLineGray();
          pdf.line(colX[ci], y, colX[ci], y + rowH);
        });
        setLineGray();
        pdf.line(margin + contentW, y, margin + contentW, y + rowH);

        const midY = y + rowH / 2 + 1.5;
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);
        pdf.text(String(i + 1), colX[0] + colWidths[0] / 2, midY, { align: "center" });
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.aspek, colX[1] + 3, midY);

        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(60, 60, 60);
        const textStartY = y + (rowH - definisiLines.length * 4.5) / 2 + 4;
        pdf.text(definisiLines, colX[2] + 3, textStartY);

        pdf.setFontSize(8);
        if (item.nilai) {
          pdf.setFont("helvetica", "bold");
          pdf.setTextColor(0, 0, 0);
          pdf.text(item.nilai, colX[3] + colWidths[3] / 2, midY, { align: "center" });
        } else {
          pdf.setTextColor(150, 150, 150);
          pdf.text("-", colX[3] + colWidths[3] / 2, midY, { align: "center" });
        }
        y += rowH;
      });

      y += 8;

      // ── KOMENTAR GURU ──
      const komentarPdf = komentarTerbaru;
      if (komentarPdf) {
        if (y > pageH - 50) { pdf.addPage(); y = margin; }
        setLineGray();
        pdf.setLineWidth(0.3);
        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, y, contentW, 7, "FD");
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("KOMENTAR GURU", margin + 3, y + 5);
        y += 7;

        const komentarLines = pdf.splitTextToSize(komentarPdf, contentW - 8);
        const komentarH = komentarLines.length * 5 + 8;
        setLineGray();
        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, y, contentW, komentarH, "FD");
        pdf.setFontSize(8.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.text(komentarLines, margin + 4, y + 6);
        y += komentarH + 8;
      }

      // ── RIWAYAT PENILAIAN ──
      if (y > pageH - 50) { pdf.addPage(); y = margin; }
      setLineGray();
      pdf.setLineWidth(0.3);
      pdf.setFillColor(255, 255, 255);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("RIWAYAT PENILAIAN", margin + 3, y + 5);
      y += 7;

      const rColW = [10, 22, 36, 36, 52, 16];
      const rColX = rColW.reduce<number[]>((acc, w, i) => { acc.push(i === 0 ? margin : acc[i - 1] + rColW[i - 1]); return acc; }, []);
      const rHeaders = ["No", "Tanggal", "Aspek", "Kegiatan", "Indikator", "Nilai"];

      const drawRiwayatHeader = () => {
        setLineGray();
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, y, contentW, 7, "FD");
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        rHeaders.forEach((h, i) => {
          pdf.text(h, rColX[i] + (i === 0 || i === 5 ? rColW[i] / 2 : 2), y + 4.8, { align: i === 0 || i === 5 ? "center" : "left" });
          if (i > 0) { setLineGray(); pdf.line(rColX[i], y, rColX[i], y + 7); }
        });
        setLineGray();
        pdf.line(margin + contentW, y, margin + contentW, y + 7);
        y += 7;
      };
      drawRiwayatHeader();

      (laporan.riwayat ?? []).forEach((item, i) => {
        const rowH = 8;
        if (y + rowH > pageH - margin - 30) { pdf.addPage(); y = margin; drawRiwayatHeader(); }
        setLineGray();
        pdf.setFillColor(i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 250, i % 2 === 0 ? 255 : 250);
        pdf.rect(margin, y, contentW, rowH, "FD");
        rColW.forEach((_, ci) => {
          if (ci > 0) { setLineGray(); pdf.line(rColX[ci], y, rColX[ci], y + rowH); }
        });
        setLineGray();
        pdf.line(margin + contentW, y, margin + contentW, y + rowH);
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(0, 0, 0);
        pdf.text(String(i + 1), rColX[0] + rColW[0] / 2, y + 5, { align: "center" });
        pdf.text(item.tanggal ?? "-", rColX[1] + 2, y + 5);
        pdf.text(pdf.splitTextToSize(item.indikator?.aspek?.nama_aspek ?? "-", rColW[2] - 3)[0], rColX[2] + 2, y + 5);
        pdf.text(pdf.splitTextToSize(item.indikator?.nama_kegiatan ?? "-", rColW[3] - 3)[0], rColX[3] + 2, y + 5);
        pdf.text(pdf.splitTextToSize(item.indikator?.nama_indikator ?? "-", rColW[4] - 3)[0], rColX[4] + 2, y + 5);
        if (item.nilai) { pdf.setFont("helvetica", "bold"); pdf.text(item.nilai, rColX[5] + rColW[5] / 2, y + 5, { align: "center" }); }
        y += rowH;
      });

      y += 10;

      // ── KETERANGAN NILAI ──
      if (y > pageH - 90) { pdf.addPage(); y = margin; }
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Keterangan Nilai:", margin, y);
      y += 5;
      const keteranganNilai = [
        "BSB : Berkembang Sangat Baik",
        "BSH : Berkembang Sesuai Harapan",
        "MB  : Mulai Berkembang",
        "BB  : Belum Berkembang",
      ];
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(8);
      pdf.setTextColor(60, 60, 60);
      keteranganNilai.forEach((line) => { pdf.text(line, margin, y); y += 5; });

      y += 8;

      // ── TANDA TANGAN ──
      if (y > pageH - 70) { pdf.addPage(); y = margin; }

      const ttdStartY = y;
      const ttdBoxW = 60;
      const ttdKiriCenterX = margin + ttdBoxW / 2;
      const ttdKananCenterX = pageW - margin - ttdBoxW / 2;

      pdf.setFontSize(9);
      pdf.setFont("helvetica", "normal");
      pdf.setTextColor(0, 0, 0);
      pdf.text("Mengetahui,", pageW / 2, ttdStartY, { align: "center" });
      pdf.text("Kepala Sekolah", ttdKiriCenterX, ttdStartY + 7, { align: "center" });
      pdf.text("Wali Kelas", ttdKananCenterX, ttdStartY + 7, { align: "center" });

      const ttdImgW = 40;
      const ttdImgH = 18;
      const ttdImgY = ttdStartY + 10;

      if (ttdKS) pdf.addImage(ttdKS, "PNG", ttdKiriCenterX - ttdImgW / 2, ttdImgY, ttdImgW, ttdImgH);
      if (ttdGuru) pdf.addImage(ttdGuru, "PNG", ttdKananCenterX - ttdImgW / 2, ttdImgY, ttdImgW, ttdImgH);

      const namaNipY = ttdImgY + ttdImgH + 4;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      const namaKSW = pdf.getTextWidth(namaKS);
      pdf.text(namaKS, ttdKiriCenterX, namaNipY, { align: "center" });
      pdf.setLineWidth(0.3);
      setLineDark();
      pdf.line(ttdKiriCenterX - namaKSW / 2, namaNipY + 1, ttdKiriCenterX + namaKSW / 2, namaNipY + 1);
      if (nipKS) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.text(`NIP. ${nipKS}`, ttdKiriCenterX, namaNipY + 6, { align: "center" });
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      const namaGuruW = pdf.getTextWidth(namaWaliKelas);
      pdf.text(namaWaliKelas, ttdKananCenterX, namaNipY, { align: "center" });
      setLineDark();
      pdf.setLineWidth(0.3);
      pdf.line(ttdKananCenterX - namaGuruW / 2, namaNipY + 1, ttdKananCenterX + namaGuruW / 2, namaNipY + 1);
      if (nipWaliKelas) {
        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(8);
        pdf.text(`NIP. ${nipWaliKelas}`, ttdKananCenterX, namaNipY + 6, { align: "center" });
      }

      const nipBottomY = nipKS || nipWaliKelas ? namaNipY + 6 : namaNipY;
      const tglY = nipBottomY + 9;
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      pdf.text(`Dotamana, ${tglCetak}`, pageW / 2, tglY, { align: "center" });

      y = tglY + 10;

      // ── FOOTER ──
      const totalPages = (pdf as any).internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        pdf.setFontSize(7);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(150, 150, 150);
        pdf.text(
          `Halaman ${p} dari ${totalPages}  •  ${ps.nama_sekolah || "TK Al Muhajirin Dotamana"}  •  Dicetak ${tglCetak}`,
          pageW / 2, pageH - 5, { align: "center" }
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

  // ─── RENDER ──────────────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto space-y-4 p-4">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="text-red-400 hover:text-red-600 ml-4">✕</button>
        </div>
      )}

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tahun Ajaran</label>
            {loadingProfil ? (
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-gray-50"><Loader2 size={14} className="animate-spin" /> Memuat...</div>
            ) : (
              <>
                <select value={tahunAjaran} onChange={e => { setTahunAjaran(e.target.value); setLaporan(null); }} className={selectCls}>
                  <option value="">Pilih tahun ajaran</option>
                  {tahunAjaranList.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 bottom-3 text-gray-400"><ChevronDownIcon /></span>
              </>
            )}
          </div>
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Semester</label>
            <select value={semester} onChange={e => { setSemester(e.target.value); setLaporan(null); }} disabled={!tahunAjaran} className={selectCls}>
              {semesterOptions.map(s => <option key={s} value={s}>{s}</option>)}
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
          <button onClick={handleExportPDF} disabled={!laporan || loadingPdf}
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
            {loadingPdf ? <><Loader2 size={14} className="animate-spin" /> Membuat PDF...</> : <><FileText size={16} /> Export PDF</>}
          </button>
        </div>
      </div>

      {/* Profil */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
            {loadingProfil ? <Loader2 size={18} className="animate-spin text-blue-400" /> : laporan ? initials : <User size={22} className="text-blue-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">{namaAnak || <span className="text-gray-400">-</span>}</h3>
            <p className="text-sm text-gray-500">{laporan ? `${kelasNama} • ${semester} • ${tahunAjaran}` : <span className="text-gray-300">Belum ada data dipilih</span>}</p>
            {anakProfil?.tanggal_lahir && (
              <p className="text-xs text-gray-400 mt-0.5">
                {formatTanggal(anakProfil.tanggal_lahir)} • {hitungUmur(anakProfil.tanggal_lahir)}
              </p>
            )}
          </div>
          <div className="flex gap-6 text-center">
            <div><p className="text-2xl font-bold text-blue-500">{laporan ? laporan.rekap_aspek.length : "-"}</p><p className="text-xs text-gray-500">Aspek</p></div>
            <div><p className="text-2xl font-bold text-blue-500">{laporan ? laporan.total : "-"}</p><p className="text-xs text-gray-500">Penilaian</p></div>
            <div>
              {laporan && rataRata ? <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${nilaiColorMap[rataRata]}`}>{rataRata}</span> : <span className="inline-block px-3 py-1 bg-gray-100 text-gray-400 rounded-full text-sm font-semibold">-</span>}
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
                {chartData.map((item, i) => (<div key={i} className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} /><span className="text-xs text-gray-600">{item.name}</span></div>))}
              </div>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={28} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => numToNilai[v] ?? v} tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={48} />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
                    <Bar dataKey="nilai" radius={[8, 8, 0, 0]} minPointSize={4}>
                      {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-300 text-sm">
              {loadingLaporan ? <Loader2 size={20} className="animate-spin text-blue-400" /> : "Belum ada data"}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h3 className="font-semibold text-gray-800 mb-1">Ringkasan Aspek</h3>
          <p className="text-xs text-gray-500 mb-4">Capaian setiap aspek perkembangan</p>
          <div className="space-y-3">
            {laporan && rekapWithNilai.length > 0 ? rekapWithNilai.map((item, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ASPEK_COLORS[i % ASPEK_COLORS.length] }} /><span className="text-sm text-gray-700">{item.aspek}</span></div>
                {item.nilai ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span> : <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-400">-</span>}
              </div>
            )) : <div className="text-center text-gray-300 text-sm py-8">{loadingLaporan ? <Loader2 size={20} className="animate-spin text-blue-400 mx-auto" /> : "Belum ada data"}</div>}
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
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-10">No</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200 w-1/4">Aspek Perkembangan</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-200">Definisi Aspek</th>
                <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-20">Nilai</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {laporan && rekapWithNilai.length > 0 ? (
                rekapWithNilai.map((item, i) => (
                  <tr key={i} className="hover:bg-gray-50 align-top">
                    <td className="px-4 py-3 text-gray-500 text-center border-r border-gray-200">{i + 1}</td>
                    <td className="px-4 py-3 text-gray-700 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: ASPEK_COLORS[i % ASPEK_COLORS.length] }} />
                        <span className="font-medium">{item.aspek}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs leading-relaxed border-r border-gray-200">
                      {aspekDefinisi[item.aspek] ?? "-"}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {item.nilai
                        ? <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${nilaiColorMap[item.nilai]}`}>{item.nilai}</span>
                        : <span className="text-gray-300 text-xs">-</span>}
                    </td>
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
          {komentarTerbaru ? komentarTerbaru : <span className="text-gray-300">-</span>}
        </p>
      </div>

      {/* Riwayat Penilaian */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4">
          <h3 className="font-semibold text-gray-800">Riwayat Penilaian</h3>
          <div className="flex gap-2">
            <div className="relative">
              <select value={aspekFilter} onChange={e => setAspekFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8 cursor-pointer min-w-[140px]">
                {aspekOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDownIcon /></span>
            </div>
            <div className="relative">
              <select value={bulanFilter} onChange={e => setBulanFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-400 appearance-none pr-8 cursor-pointer min-w-[140px]">
                <option value="Semua bulan">Semua bulan</option>
                {bulanOptions.filter(b => b !== "Semua bulan").map(b => <option key={b} value={b}>{getBulanLabel(b)}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><ChevronDownIcon /></span>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "720px" }}>
            <thead>
              <tr className="bg-gray-100 border-b border-gray-200">
                {["No", "Tanggal", "Aspek", "Kegiatan", "Indikator", "Nilai", "Foto"].map((h, i) => (
                  <th key={h} className={`px-3 py-3 text-xs font-bold text-gray-700 border-r border-gray-200 last:border-r-0 ${i >= 5 ? "text-center" : "text-left"}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {riwayatFiltered.length > 0 ? riwayatFiltered.map((item, index) => (
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
                      <a href={`${API_URL.replace("/api", "")}/storage/${item.foto}`} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-500 hover:text-blue-700 hover:underline whitespace-nowrap flex items-center justify-center gap-1">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" /><polyline points="21 15 16 10 5 21" /></svg>
                        Lihat
                      </a>
                    ) : <span className="text-xs text-gray-300">-</span>}
                  </td>
                </tr>
              )) : (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-300">{loadingLaporan ? <Loader2 size={16} className="animate-spin text-blue-400 mx-auto" /> : laporan ? "Tidak ada data untuk aspek ini" : "Pilih filter lalu klik Tampilkan"}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
