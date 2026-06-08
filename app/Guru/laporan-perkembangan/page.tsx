"use client";

import { useState, useEffect } from "react";
import { FileText, User, Loader2 } from "lucide-react";
import jsPDF from "jspdf";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";
const API_BASE = API_URL.replace("/api", "");

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
interface Kelas {
  id_kelas: number;
  nama_kelas: string;
  tahun_ajaran: string;
  wali_kelas: string;
}
interface Anak {
  id_anak: number;
  nama_anak: string;
  tanggal_lahir?: string;
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
interface ProfilSekolah {
  nama_sekolah: string;
  nama_kepala_sekolah: string;
  nip_kepala_sekolah: string;
  foto_ttd_ks: string | null;
}
interface GuruProfil {
  nama_guru: string;
  nip: string | null;
  foto_ttd: string | null;
}

// ─── CONFIG ──────────────────────────────────────────────────────
const ASPEK_COLORS = ["#4DB6AC", "#F48FB1", "#FFCC80", "#CE93D8", "#80CBC4", "#FFF176"];
const nilaiColorMap: Record<string, string> = {
  BB: "bg-red-100 text-red-700",
  MB: "bg-yellow-100 text-yellow-700",
  BSH: "bg-green-100 text-green-700",
  BSB: "bg-blue-100 text-blue-700",
};
const nilaiToNum: Record<string, number> = { BB: 1, MB: 2, BSH: 3, BSB: 4 };
const numToNilai: Record<number, string> = { 1: "BB", 2: "MB", 3: "BSH", 4: "BSB" };
const aspekAbbrMap: Record<string, string> = {
  "Perkembangan Motorik": "FM", "Fisik Motorik": "FM",
  "Perkembangan Kognitif": "KOG", "Kognitif": "KOG",
  "Perkembangan Bahasa": "BHS", "Bahasa": "BHS",
  "Perkembangan Sosial-Emosional": "SOS-EM", "Sosial Emosional": "SOS-EM",
  "Nilai Agama dan Moral": "NAM", "Agama dan Moral": "NAM",
  "Seni dan Kreativitas": "SENI", "Seni": "SENI",
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
    ?? name.split(" ").filter(w => !["Perkembangan", "dan", "atau"].includes(w))
      .map(w => w.substring(0, 3).toUpperCase()).join("");
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
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function toApiStorageUrl(path: string): string {
  const parts = path.split("/");
  const folder = parts[0];
  const filename = parts.slice(1).join("/");
  return `${API_URL}/storage-file/${folder}/${filename}`;
}

const semesterOptions = ["Semester 1", "Semester 2"];
function getDefaultSemester(): string {
  return new Date().getMonth() + 1 >= 7 ? "Semester 1" : "Semester 2";
}

const ChevronDownIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
export default function LaporanPerkembanganGuruPage() {
  const [kelasList, setKelasList] = useState<Kelas[]>([]);
  const [anakList, setAnakList] = useState<Anak[]>([]);
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [selectedAnak, setSelectedAnak] = useState<Anak | null>(null);
  const [semester, setSemester] = useState(getDefaultSemester);
  const [aspekFilter, setAspekFilter] = useState("Semua aspek");
  const [laporan, setLaporan] = useState<LaporanData | null>(null);
  const [loadingKelas, setLoadingKelas] = useState(false);
  const [loadingAnak, setLoadingAnak] = useState(false);
  const [loadingLaporan, setLoadingLaporan] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [guruProfil, setGuruProfil] = useState<GuruProfil | null>(null);

  const tahunAjaranList = [...new Set(kelasList.map((k) => k.tahun_ajaran))].sort();
  const kelasFiltered = kelasList.filter((k) => k.tahun_ajaran === tahunAjaran);

  // Load kelas & profil guru
  useEffect(() => {
    setLoadingKelas(true);
    Promise.all([
      apiFetch<{ guru?: GuruProfil }>("/profil"),
      apiFetch<Kelas[]>("/kelas"),
    ])
      .then(([profil, data]) => {
        const namaGuru = (profil as any).guru?.nama_guru ?? "";
        setGuruProfil((profil as any).guru ?? null);
        const kelasSaya = data.filter(
          (k) => (k as any).wali_kelas?.toLowerCase() === namaGuru.toLowerCase()
        );
        if (kelasSaya.length > 0) {
          const latest = [...kelasSaya].sort((a, b) => b.tahun_ajaran.localeCompare(a.tahun_ajaran))[0].tahun_ajaran;
          setKelasList(kelasSaya);
          setTahunAjaran(latest);
        } else {
          setKelasList([]);
        }
      })
      .catch(() => setError("Gagal memuat data kelas."))
      .finally(() => setLoadingKelas(false));
  }, []);

  // Auto-select kelas jika hanya 1 kelas di tahun ajaran yang aktif
  useEffect(() => {
    if (!tahunAjaran || kelasList.length === 0) return;
    const kelasDiTahun = kelasList.filter((k) => k.tahun_ajaran === tahunAjaran);
    if (kelasDiTahun.length === 1) {
      setSelectedKelas(kelasDiTahun[0]);
    }
  }, [kelasList, tahunAjaran]);

  useEffect(() => {
    if (!selectedKelas) { setAnakList([]); setSelectedAnak(null); return; }
    setLoadingAnak(true);
    setSelectedAnak(null);
    setLaporan(null);
    apiFetch<Anak[]>(`/anak?id_kelas=${selectedKelas.id_kelas}`)
      .then(setAnakList)
      .catch(() => setError("Gagal memuat data anak."))
      .finally(() => setLoadingAnak(false));
  }, [selectedKelas]);

  const handleTampilkan = () => {
    if (!selectedAnak) { setError("Pilih nama anak terlebih dahulu."); return; }
    setError("");
    setLoadingLaporan(true);
    apiFetch<LaporanData>(`/observasi/anak/${selectedAnak.id_anak}?semester=${encodeURIComponent(semester)}`)
      .then(setLaporan)
      .catch(() => setError("Gagal memuat laporan. Coba lagi."))
      .finally(() => setLoadingLaporan(false));
  };

  const handleKelasChange = (id: string) => {
    const kelas = kelasList.find((k) => k.id_kelas === Number(id)) ?? null;
    setSelectedKelas(kelas);
    setLaporan(null);
  };

  const handleTahunAjaranChange = (val: string) => {
    setTahunAjaran(val);
    setSelectedAnak(null);
    setLaporan(null);
    // Auto-select jika hanya ada 1 kelas di tahun ajaran ini
    const kelasDiTahun = kelasList.filter((k) => k.tahun_ajaran === val);
    if (kelasDiTahun.length === 1) {
      setSelectedKelas(kelasDiTahun[0]);
    } else {
      setSelectedKelas(null);
    }
  };

  const rekapWithNilai = (laporan?.rekap_aspek ?? []).map((item) => {
    const nilaiPerAspek = (laporan?.riwayat ?? [])
      .filter((r) => r.indikator?.aspek?.nama_aspek === item.aspek)
      .map((r) => nilaiToNum[r.nilai] ?? 0).filter(Boolean);
    if (nilaiPerAspek.length === 0) return { ...item, nilai: null };
    const rata = nilaiPerAspek.reduce((a, b) => a + b, 0) / nilaiPerAspek.length;
    return { ...item, nilai: numToNilai[Math.round(rata)] ?? null };
  });

  const chartData = rekapWithNilai.map((item, i) => ({
    name: getAspekAbbr(item.aspek),
    fullName: item.aspek,
    nilai: nilaiToNum[item.nilai ?? ""] ?? 0,
    color: ASPEK_COLORS[i % ASPEK_COLORS.length],
  }));

  const aspekOptions = ["Semua aspek", ...new Set((laporan?.riwayat ?? []).map((r) => r.indikator?.aspek?.nama_aspek).filter(Boolean))];
  const riwayatFiltered = aspekFilter === "Semua aspek"
    ? (laporan?.riwayat ?? [])
    : (laporan?.riwayat ?? []).filter((r) => r.indikator?.aspek?.nama_aspek === aspekFilter);

  const nilaiList = (laporan?.riwayat ?? []).map((r) => nilaiToNum[r.nilai] ?? 0).filter(Boolean);
  const rataRata = nilaiList.length > 0
    ? numToNilai[Math.round(nilaiList.reduce((a, b) => a + b, 0) / nilaiList.length)]
    : null;

  const anakNama = laporan?.anak?.nama_anak ?? selectedAnak?.nama_anak ?? "";
  const kelasNama = laporan?.anak?.kelas?.nama_kelas ?? selectedKelas?.nama_kelas ?? "";
  const initials = anakNama.split(" ").map((n) => n[0]).join("").substring(0, 2);

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

      const tglCetak = new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" });
      const nomorRapor = `R-${tahunAjaran.replace("/", "")}-${String(selectedAnak?.id_anak ?? "").padStart(3, "0")}`;
      const semesterLabel = semester === "Semester 1" ? "1 (Ganjil)" : "2 (Genap)";

      const ps = await apiFetch<ProfilSekolah>("/profil-sekolah");
      const [logo, ttdKS, ttdGuru] = await Promise.all([
        loadImageAsDataUrl("/logo-sekolah.png"),
        ps.foto_ttd_ks ? loadImageAsDataUrl(toApiStorageUrl(ps.foto_ttd_ks)) : Promise.resolve(null),
        guruProfil?.foto_ttd ? loadImageAsDataUrl(toApiStorageUrl(guruProfil.foto_ttd)) : Promise.resolve(null),
      ]);

      const namaKS = ps.nama_kepala_sekolah || "Kepala Sekolah";
      const nipKS = ps.nip_kepala_sekolah || "";
      const namaWaliKelas = guruProfil?.nama_guru || selectedKelas?.wali_kelas || "Wali Kelas";
      const nipWaliKelas = guruProfil?.nip || "";

      const headerH = 38;
      const rightColW = 44;
      const leftColW = 28;

      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.5);
      pdf.rect(margin, y, contentW, headerH, "S");

      pdf.setLineWidth(0.4);
      pdf.line(margin + leftColW, y, margin + leftColW, y + headerH);
      pdf.line(margin + contentW - rightColW, y, margin + contentW - rightColW, y + headerH);
      pdf.line(
        margin + contentW - rightColW,
        y + headerH / 2,
        margin + contentW,
        y + headerH / 2
      );

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

      pdf.setFillColor(230, 230, 230);
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("IDENTITAS ANAK", margin + 3, y + 5);
      y += 7;

      pdf.rect(margin, y, contentW, 28, "S");

      const tglLahirAnak = selectedAnak?.tanggal_lahir ?? "";
      const umurAnak = tglLahirAnak ? hitungUmur(tglLahirAnak) : "-";
      const tglLahirFormatted = tglLahirAnak ? formatTanggal(tglLahirAnak) : "-";

      const col1x = margin + 4;
      const col2x = margin + 94;

      const rows1 = [
        ["Nama", anakNama],
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

      pdf.setFillColor(230, 230, 230);
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("ASPEK PERKEMBANGAN", margin + 3, y + 5);
      y += 7;

      const colWidths = [10, 52, 18, 0];
      colWidths[3] = contentW - colWidths[0] - colWidths[1] - colWidths[2];
      const colX = [
        margin,
        margin + colWidths[0],
        margin + colWidths[0] + colWidths[1],
        margin + colWidths[0] + colWidths[1] + colWidths[2],
      ];

      pdf.setFillColor(240, 240, 240);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("No", colX[0] + colWidths[0] / 2, y + 4.8, { align: "center" });
      pdf.text("Aspek Perkembangan", colX[1] + 3, y + 4.8);
      pdf.text("Nilai", colX[2] + colWidths[2] / 2, y + 4.8, { align: "center" });
      pdf.text("Keterangan", colX[3] + 3, y + 4.8);
      colX.forEach((x, i) => { if (i > 0) pdf.line(x, y, x, y + 7); });
      pdf.line(margin + contentW, y, margin + contentW, y + 7);
      y += 7;

      const komentarPerAspek: Record<string, string> = {};
      const indikatorPerAspek: Record<string, string[]> = {};
      (laporan.riwayat ?? []).forEach((r) => {
        const aspek = r.indikator?.aspek?.nama_aspek ?? "";
        if (r.komentar && aspek && !komentarPerAspek[aspek]) komentarPerAspek[aspek] = r.komentar;
        const ind = r.indikator?.nama_indikator ?? "";
        if (aspek && ind) {
          if (!indikatorPerAspek[aspek]) indikatorPerAspek[aspek] = [];
          if (!indikatorPerAspek[aspek].includes(ind)) indikatorPerAspek[aspek].push(ind);
        }
      });

      rekapWithNilai.forEach((item, i) => {
        let keterangan = komentarPerAspek[item.aspek] ?? "";
        if (!keterangan && indikatorPerAspek[item.aspek]?.length) {
          keterangan = indikatorPerAspek[item.aspek].slice(0, 3).join(", ") + ".";
        }
        if (!keterangan) keterangan = "-";

        const keteranganLines = pdf.splitTextToSize(keterangan, colWidths[3] - 5);
        const rowH = Math.max(10, keteranganLines.length * 4.5 + 4);

        pdf.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 248);
        pdf.setDrawColor(0, 0, 0);
        pdf.rect(margin, y, contentW, rowH, "FD");
        colX.forEach((x, ci) => { if (ci > 0) pdf.line(x, y, x, y + rowH); });
        pdf.line(margin + contentW, y, margin + contentW, y + rowH);

        const midY = y + rowH / 2 + 1.5;
        pdf.setFontSize(8);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(80, 80, 80);
        pdf.text(String(i + 1), colX[0] + colWidths[0] / 2, midY, { align: "center" });
        pdf.setTextColor(0, 0, 0);
        pdf.text(item.aspek, colX[1] + 3, midY);

        if (item.nilai) {
          pdf.setFont("helvetica", "bold");
          pdf.text(item.nilai, colX[2] + colWidths[2] / 2, midY, { align: "center" });
        } else {
          pdf.setTextColor(150, 150, 150);
          pdf.text("-", colX[2] + colWidths[2] / 2, midY, { align: "center" });
        }

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(60, 60, 60);
        const textStartY = y + (rowH - keteranganLines.length * 4.5) / 2 + 4;
        pdf.text(keteranganLines, colX[3] + 3, textStartY);
        y += rowH;
      });

      y += 8;

      if (laporan.komentar) {
        if (y > pageH - 50) { pdf.addPage(); y = margin; }
        pdf.setFillColor(230, 230, 230);
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.rect(margin, y, contentW, 7, "FD");
        pdf.setFontSize(9);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        pdf.text("KOMENTAR GURU", margin + 3, y + 5);
        y += 7;

        const komentarLines = pdf.splitTextToSize(laporan.komentar, contentW - 8);
        const komentarH = komentarLines.length * 5 + 8;
        pdf.setFillColor(255, 255, 255);
        pdf.rect(margin, y, contentW, komentarH, "FD");
        pdf.setFontSize(8.5);
        pdf.setFont("helvetica", "normal");
        pdf.setTextColor(0, 0, 0);
        pdf.text(komentarLines, margin + 4, y + 6);
        y += komentarH + 8;
      }

      if (y > pageH - 50) { pdf.addPage(); y = margin; }
      pdf.setFillColor(230, 230, 230);
      pdf.setDrawColor(0, 0, 0);
      pdf.setLineWidth(0.3);
      pdf.rect(margin, y, contentW, 7, "FD");
      pdf.setFontSize(9);
      pdf.setFont("helvetica", "bold");
      pdf.setTextColor(0, 0, 0);
      pdf.text("RIWAYAT PENILAIAN", margin + 3, y + 5);
      y += 7;

      const rColW = [10, 22, 36, 36, 52, 16];
      const rColX = rColW.reduce<number[]>((acc, w, i) => {
        acc.push(i === 0 ? margin : acc[i - 1] + rColW[i - 1]);
        return acc;
      }, []);
      const rHeaders = ["No", "Tanggal", "Aspek", "Kegiatan", "Indikator", "Nilai"];

      const drawRiwayatHeader = () => {
        pdf.setFillColor(240, 240, 240);
        pdf.setDrawColor(0, 0, 0);
        pdf.rect(margin, y, contentW, 7, "FD");
        pdf.setFontSize(7.5);
        pdf.setFont("helvetica", "bold");
        pdf.setTextColor(0, 0, 0);
        rHeaders.forEach((h, i) => {
          pdf.text(h, rColX[i] + (i === 0 || i === 5 ? rColW[i] / 2 : 2), y + 4.8, {
            align: i === 0 || i === 5 ? "center" : "left",
          });
          if (i > 0) pdf.line(rColX[i], y, rColX[i], y + 7);
        });
        pdf.line(margin + contentW, y, margin + contentW, y + 7);
        y += 7;
      };
      drawRiwayatHeader();

      (laporan.riwayat ?? []).forEach((item, i) => {
        const rowH = 8;
        if (y + rowH > pageH - margin - 30) { pdf.addPage(); y = margin; drawRiwayatHeader(); }
        pdf.setFillColor(i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 248, i % 2 === 0 ? 255 : 248);
        pdf.setDrawColor(0, 0, 0);
        pdf.rect(margin, y, contentW, rowH, "FD");
        rColW.forEach((_, ci) => { if (ci > 0) pdf.line(rColX[ci], y, rColX[ci], y + rowH); });
        pdf.line(margin + contentW, y, margin + contentW, y + rowH);

        pdf.setFont("helvetica", "normal");
        pdf.setFontSize(7.5);
        pdf.setTextColor(0, 0, 0);
        pdf.text(String(i + 1), rColX[0] + rColW[0] / 2, y + 5, { align: "center" });
        pdf.text(item.tanggal ?? "-", rColX[1] + 2, y + 5);
        pdf.text(pdf.splitTextToSize(item.indikator?.aspek?.nama_aspek ?? "-", rColW[2] - 3)[0], rColX[2] + 2, y + 5);
        pdf.text(pdf.splitTextToSize(item.indikator?.nama_kegiatan ?? "-", rColW[3] - 3)[0], rColX[3] + 2, y + 5);
        pdf.text(pdf.splitTextToSize(item.indikator?.nama_indikator ?? "-", rColW[4] - 3)[0], rColX[4] + 2, y + 5);
        if (item.nilai) {
          pdf.setFont("helvetica", "bold");
          pdf.text(item.nilai, rColX[5] + rColW[5] / 2, y + 5, { align: "center" });
        }
        y += rowH;
      });

      y += 10;

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
      keteranganNilai.forEach((line) => {
        pdf.text(line, margin, y);
        y += 5;
      });

      y += 8;

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
      pdf.text("Guru Kelas", ttdKananCenterX, ttdStartY + 7, { align: "center" });

      const ttdImgW = 40;
      const ttdImgH = 18;
      const ttdImgY = ttdStartY + 10;

      if (ttdKS) {
        pdf.addImage(ttdKS, "PNG", ttdKiriCenterX - ttdImgW / 2, ttdImgY, ttdImgW, ttdImgH);
      }
      if (ttdGuru) {
        pdf.addImage(ttdGuru, "PNG", ttdKananCenterX - ttdImgW / 2, ttdImgY, ttdImgW, ttdImgH);
      }

      const namaNipY = ttdImgY + ttdImgH + 4;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(9);
      pdf.setTextColor(0, 0, 0);
      const namaKSW = pdf.getTextWidth(namaKS);
      pdf.text(namaKS, ttdKiriCenterX, namaNipY, { align: "center" });
      pdf.setLineWidth(0.3);
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

      const fileName = `Laporan_${anakNama.replace(/\s+/g, "_")}_${semester.replace(" ", "")}_${tahunAjaran.replace("/", "-")}.pdf`;
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

      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <span>Kelas yang Anda ampu:</span>
        {loadingKelas
          ? <span className="text-gray-400 italic">Memuat...</span>
          : kelasList.length === 0
            ? <span className="text-gray-400 italic">Tidak ada kelas</span>
            : kelasList.map((k) => (
              <span key={k.id_kelas} className="inline-block px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                {k.nama_kelas}
              </span>
            ))
        }
      </div>

      {/* Filter */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tahun Ajaran</label>
            <select value={tahunAjaran} onChange={(e) => handleTahunAjaranChange(e.target.value)} className={selectCls}>
              <option value="">Pilih tahun ajaran</option>
              {tahunAjaranList.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 bottom-3 text-gray-400"><ChevronDownIcon /></span>
          </div>
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Semester</label>
            <select value={semester} onChange={(e) => { setSemester(e.target.value); setLaporan(null); }} disabled={!tahunAjaran} className={selectCls}>
              {semesterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <span className="pointer-events-none absolute right-3 bottom-3 text-gray-400"><ChevronDownIcon /></span>
          </div>

          {/* Kelas — auto-select jika hanya 1, dropdown jika lebih */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Kelas</label>
            {kelasFiltered.length === 1 ? (
              <div className={`${selectCls} flex items-center gap-2 cursor-default`}>
                <span className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
                <span className="text-gray-700 font-medium">{kelasFiltered[0].nama_kelas}</span>
              </div>
            ) : (
              <>
                <select value={selectedKelas?.id_kelas ?? ""} onChange={(e) => handleKelasChange(e.target.value)} disabled={!semester} className={selectCls}>
                  <option value="">Pilih kelas</option>
                  {kelasFiltered.map((k) => <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 bottom-3 text-gray-400"><ChevronDownIcon /></span>
              </>
            )}
          </div>

          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Nama Anak</label>
            {loadingAnak ? (
              <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-400 bg-gray-50">
                <Loader2 size={14} className="animate-spin" /> Memuat...
              </div>
            ) : (
              <>
                <select value={selectedAnak?.id_anak ?? ""} onChange={(e) => {
                  const anak = anakList.find((a) => a.id_anak === Number(e.target.value)) ?? null;
                  setSelectedAnak(anak); setLaporan(null);
                }} disabled={!selectedKelas} className={selectCls}>
                  <option value="">Pilih anak</option>
                  {anakList.map((a) => <option key={a.id_anak} value={a.id_anak}>{a.nama_anak}</option>)}
                </select>
                <span className="pointer-events-none absolute right-3 bottom-3 text-gray-400"><ChevronDownIcon /></span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={handleTampilkan} disabled={loadingLaporan || !selectedAnak}
            className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors shadow-sm flex items-center justify-center gap-2">
            {loadingLaporan && <Loader2 size={14} className="animate-spin" />}
            {loadingLaporan ? "Memuat..." : "Tampilkan"}
          </button>
          <button onClick={handleExportPDF} disabled={!laporan || loadingPdf}
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
            {laporan ? initials : <User size={22} className="text-blue-400" />}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-800">
              {laporan ? laporan.anak.nama_anak : <span className="text-gray-400">-</span>}
            </h3>
            <p className="text-sm text-gray-500">
              {laporan
                ? `${laporan.anak.kelas?.nama_kelas ?? selectedKelas?.nama_kelas} • ${semester} • ${tahunAjaran}`
                : <span className="text-gray-300">Belum ada data dipilih</span>}
            </p>
            {selectedAnak?.tanggal_lahir && (
              <p className="text-xs text-gray-400 mt-0.5">
                {formatTanggal(selectedAnak.tanggal_lahir)} • {hitungUmur(selectedAnak.tanggal_lahir)}
              </p>
            )}
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
                  <BarChart data={chartData} barSize={28} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                    <YAxis domain={[0, 4]} ticks={[1, 2, 3, 4]} tickFormatter={(v) => numToNilai[v] ?? v}
                      tick={{ fontSize: 10, fill: "#6b7280" }} axisLine={false} tickLine={false} width={48} />
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
            {laporan && laporan.rekap_aspek.length > 0 ? (
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
                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 w-1/4">Nilai</th>
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
        <p className="text-xs text-gray-500 mb-3">Catatan dan evaluasi</p>
        <p className="text-sm text-gray-600 leading-relaxed">
          {laporan?.komentar ? laporan.komentar : <span className="text-gray-300">-</span>}
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
                {["No", "Tanggal", "Aspek", "Kegiatan", "Indikator", "Nilai", "Foto"].map((h, i) => (
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
                        <a href={`${API_BASE}/storage/${item.foto}`} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-blue-500 hover:text-blue-700 hover:underline whitespace-nowrap flex items-center justify-center gap-1">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" /><circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
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