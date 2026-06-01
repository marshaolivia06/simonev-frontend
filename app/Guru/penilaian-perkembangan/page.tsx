"use client";

import { useState, useEffect, useMemo } from "react";
import {
  CheckCircle, X, ChevronRight, CalendarDays,
  ChevronDown, ChevronUp, ImagePlus, Loader2,
} from "lucide-react";

// ─── ENV ─────────────────────────────────────────────────────────
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

// ─── TYPES dari DB ───────────────────────────────────────────────
interface Indikator {
  id_indikator: number;
  id_aspek: number;
  nama_indikator: string;
  nama_kegiatan: string | null;
}
interface Aspek {
  id_aspek: number;
  nama_aspek: string;
  indikator: Indikator[];
}
interface Kelas {
  id_kelas: number;
  nama_kelas: string;
  tahun_ajaran: string;
  wali_kelas: string;
}
interface Anak {
  id_anak: number;
  nama_anak: string;
}

// ─── TYPES internal ──────────────────────────────────────────────
interface NilaiEntry {
  id_indikator: number;
  aspekLabel: string;
  kegiatanLabel: string;
  indikatorLabel: string;
  nilai: string;
  foto: string; // nama file
  fotoFile: File | null;
}
type Step = "filter" | "pilih-aspek" | "isi-nilai";

// ─── GROUPING helper ─────────────────────────────────────────────
// Karena kegiatan hanya field string di indikator, kita group manual
interface KegiatanGroup {
  nama_kegiatan: string;
  indikator: Indikator[];
}
function groupByKegiatan(indikator: Indikator[]): KegiatanGroup[] {
  const map = new Map<string, Indikator[]>();
  for (const ind of indikator) {
    const key = ind.nama_kegiatan ?? "Umum";
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(ind);
  }
  return Array.from(map.entries()).map(([nama_kegiatan, indikator]) => ({
    nama_kegiatan,
    indikator,
  }));
}

// ─── NILAI config ────────────────────────────────────────────────
const NILAI_OPTIONS = ["BB", "MB", "BSH", "BSB"] as const;
const NILAI_INFO: Record<string, { label: string; desc: string; color: string; selectedColor: string }> = {
  BB: { label: "Belum Berkembang",          desc: "Anak belum menunjukkan kemampuan ini",             color: "text-red-500 border-red-200 bg-white hover:bg-red-50",       selectedColor: "text-red-700 border-red-400 bg-red-100 ring-2 ring-red-300 ring-offset-1" },
  MB: { label: "Mulai Berkembang",           desc: "Anak sudah mulai menunjukkan kemampuan dengan bantuan", color: "text-yellow-600 border-yellow-200 bg-white hover:bg-yellow-50", selectedColor: "text-yellow-800 border-yellow-400 bg-yellow-100 ring-2 ring-yellow-300 ring-offset-1" },
  BSH:{ label: "Berkembang Sesuai Harapan", desc: "Anak mampu melakukan secara mandiri",              color: "text-blue-500 border-blue-200 bg-white hover:bg-blue-50",     selectedColor: "text-blue-800 border-blue-400 bg-blue-100 ring-2 ring-blue-300 ring-offset-1" },
  BSB:{ label: "Berkembang Sangat Baik",    desc: "Anak mampu dan membantu teman lainnya",            color: "text-green-600 border-green-200 bg-white hover:bg-green-50",  selectedColor: "text-green-800 border-green-400 bg-green-100 ring-2 ring-green-300 ring-offset-1" },
};

const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

// ─── API helper ──────────────────────────────────────────────────
async function apiFetch<T>(path: string): Promise<T> {
  const token = typeof window !== "undefined" 
    ? localStorage.getItem("token") 
    : null;
    
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

// ─── Helper default ──────────────────────────────────────────────
function getDefaultSemester(): string {
  return new Date().getMonth() + 1 >= 7 ? "Semester 1" : "Semester 2";
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function PenilaianPage() {
  const [step, setStep] = useState<Step>("filter");

  // ── Filter state ──
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [semester, setSemester] = useState(getDefaultSemester());
  const [selectedKelas, setSelectedKelas] = useState<Kelas | null>(null);
  const [selectedAnak, setSelectedAnak] = useState<Anak | null>(null);

  // ── Data dari API ──
  const [kelasList, setKelasList]   = useState<Kelas[]>([]);
  const [anakList, setAnakList]     = useState<Anak[]>([]);
  const [aspekList, setAspekList]   = useState<Aspek[]>([]);

  // ── Loading state ──
  const [loadingKelas, setLoadingKelas] = useState(false);
  const [loadingAnak, setLoadingAnak]   = useState(false);
  const [loadingAspek, setLoadingAspek] = useState(false);
  const [loadingSimpan, setLoadingSimpan] = useState(false);

  // ── Pilih aspek/kegiatan/indikator ──
  const [aspekDipilih, setAspekDipilih]           = useState<number[]>([]);
  const [kegiatanDipilih, setKegiatanDipilih]     = useState<string[]>([]); // "id_aspek::nama_kegiatan"
  const [indikatorDipilih, setIndikatorDipilih]   = useState<number[]>([]);
  const [expandedKegiatan, setExpandedKegiatan]   = useState<string[]>([]);
  const [nilaiMap, setNilaiMap]                   = useState<Record<number, NilaiEntry>>({});

  // ── Lainnya ──
  const [tanggal, setTanggal]   = useState(() => new Date().toISOString().split("T")[0]);
  const [komentar, setKomentar] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError]     = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  // ── tahun ajaran unik dari kelas list ──
  const tahunAjaranList = useMemo(
    () => [...new Set(kelasList.map((k) => k.tahun_ajaran))].sort().reverse(),
    [kelasList]
  );

  // ── kelas yang sesuai tahun ajaran dipilih ──
  const kelasFiltered = useMemo(
    () => kelasList.filter((k) => k.tahun_ajaran === tahunAjaran),
    [kelasList, tahunAjaran]
  );

  // ── 1. Fetch kelas guru saat mount ──
  useEffect(() => {
  setLoadingKelas(true);
  
  // Fetch profil guru dan kelas bersamaan
  Promise.all([
    apiFetch<{ guru?: { nama_guru: string } }>("/profil"),
    apiFetch<Kelas[]>("/kelas"),
  ])
    .then(([profil, kelas]) => {
      const namaGuru = profil.guru?.nama_guru ?? "";
      
      // Filter kelas yang wali_kelasnya adalah guru ini
      const kelasSaya = kelas.filter(
        (k) => (k.wali_kelas as string)?.toLowerCase() === namaGuru.toLowerCase()
      );
      
      setKelasList(kelasSaya);
      
      if (kelasSaya.length > 0) {
        const latest = [...kelasSaya].sort((a, b) =>
          b.tahun_ajaran.localeCompare(a.tahun_ajaran)
        )[0].tahun_ajaran;
        setTahunAjaran(latest);
      }
    })
    .catch(() => setErrorFields(["Gagal memuat data kelas."]))
    .finally(() => setLoadingKelas(false));
}, []);

  // ── 2. Fetch anak saat kelas dipilih ──
  useEffect(() => {
    if (!selectedKelas) { setAnakList([]); setSelectedAnak(null); return; }
    setLoadingAnak(true);
    setSelectedAnak(null);
    apiFetch<Anak[]>(`/anak?id_kelas=${selectedKelas.id_kelas}`)
      .then(setAnakList)
      .catch(() => setErrorFields(["Gagal memuat data anak."]))
      .finally(() => setLoadingAnak(false));
  }, [selectedKelas]);

  // ── 3. Fetch aspek saat masuk step isi-nilai ──
  useEffect(() => {
  if (step !== "pilih-aspek" || aspekList.length > 0) return;
  setLoadingAspek(true);
  apiFetch<Aspek[]>("/aspek")
    .then(setAspekList)
    .catch(() => {
      setErrorFields(["Gagal memuat data aspek."]);
      setShowError(true);
    })
    .finally(() => setLoadingAspek(false));
}, [step]);

  // ── Handler cascade ──
  const handleTahunAjaranChange = (val: string) => {
    setTahunAjaran(val);
    setSelectedKelas(null);
    setSelectedAnak(null);
  };
  const handleSemesterChange = (val: string) => {
    setSemester(val);
    setSelectedKelas(null);
    setSelectedAnak(null);
  };
  const handleKelasChange = (id: string) => {
    const kelas = kelasList.find((k) => k.id_kelas === Number(id)) ?? null;
    setSelectedKelas(kelas);
  };
  const handleAnakChange = (id: string) => {
    const anak = anakList.find((a) => a.id_anak === Number(id)) ?? null;
    setSelectedAnak(anak);
  };

  // ── Step 1 → 2 ──
  const handleTampilkan = () => {
    if (!tahunAjaran || !semester || !selectedKelas || !selectedAnak) {
      setErrorFields(["Harap lengkapi semua filter: Tahun Ajaran, Semester, Kelas, dan Nama Anak."]);
      setShowError(true); return;
    }
    setAspekDipilih([]); setKegiatanDipilih([]);
    setIndikatorDipilih([]); setNilaiMap({}); setExpandedKegiatan([]);
    setStep("pilih-aspek");
  };

  // ── Step 2 ──
  const toggleAspek = (id: number) =>
    setAspekDipilih((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleLanjutNilai = () => {
    if (aspekDipilih.length === 0) {
      setErrorFields(["Pilih minimal satu aspek yang akan dinilai hari ini."]);
      setShowError(true); return;
    }
    setStep("isi-nilai");
  };

  // ── Step 3: kegiatan ──
  const kegiatanKey = (aspekId: number, namaKegiatan: string) => `${aspekId}::${namaKegiatan}`;

  const toggleExpandKegiatan = (key: string) =>
    setExpandedKegiatan((prev) => prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]);

  const toggleKegiatan = (aspekId: number, kg: KegiatanGroup) => {
    const key = kegiatanKey(aspekId, kg.nama_kegiatan);
    const isSelected = kegiatanDipilih.includes(key);
    if (isSelected) {
      setKegiatanDipilih((prev) => prev.filter((x) => x !== key));
      const ids = kg.indikator.map((i) => i.id_indikator);
      setIndikatorDipilih((prev) => prev.filter((x) => !ids.includes(x)));
      setNilaiMap((prev) => { const n = { ...prev }; ids.forEach((id) => delete n[id]); return n; });
    } else {
      setKegiatanDipilih((prev) => [...prev, key]);
      if (!expandedKegiatan.includes(key))
        setExpandedKegiatan((prev) => [...prev, key]);
    }
  };

  // ── Step 3: indikator ──
  const toggleIndikator = (ind: Indikator, aspek: Aspek) => {
    const isSelected = indikatorDipilih.includes(ind.id_indikator);
    if (isSelected) {
      setIndikatorDipilih((prev) => prev.filter((x) => x !== ind.id_indikator));
      setNilaiMap((prev) => { const n = { ...prev }; delete n[ind.id_indikator]; return n; });
    } else {
      setIndikatorDipilih((prev) => [...prev, ind.id_indikator]);
      setNilaiMap((prev) => ({
        ...prev,
        [ind.id_indikator]: {
          id_indikator: ind.id_indikator,
          aspekLabel: aspek.nama_aspek,
          kegiatanLabel: ind.nama_kegiatan ?? "Umum",
          indikatorLabel: ind.nama_indikator,
          nilai: "", foto: "", fotoFile: null,
        },
      }));
    }
  };

  const handleNilai = (id: number, val: string) =>
    setNilaiMap((prev) => ({ ...prev, [id]: { ...prev[id], nilai: val } }));

  const handleFile = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNilaiMap((prev) => ({ ...prev, [id]: { ...prev[id], foto: file.name, fotoFile: file } }));
  };

  const removeFile = (id: number) =>
    setNilaiMap((prev) => ({ ...prev, [id]: { ...prev[id], foto: "", fotoFile: null } }));

  // ── Simpan ke API ──
  const handleSimpan = async () => {
    const errors: string[] = [];
    if (!tanggal) errors.push("Tanggal penilaian belum diisi.");
    if (indikatorDipilih.length === 0) errors.push("Pilih minimal satu indikator yang akan dinilai.");
    const belumNilai = indikatorDipilih.filter((id) => !nilaiMap[id]?.nilai);
    if (belumNilai.length > 0)
      errors.push(`Nilai belum diisi untuk: ${belumNilai.map((id) => nilaiMap[id]?.indikatorLabel || id).join(", ")}`);
    if (errors.length > 0) { setErrorFields(errors); setShowError(true); return; }

    setLoadingSimpan(true);
    try {
      const token = localStorage.getItem("token");

      // Upload foto dulu kalau ada, satu per satu
      const penilaian = await Promise.all(
        indikatorDipilih.map(async (id) => {
          const entry = nilaiMap[id];
          let fotoPath = "";
          if (entry.fotoFile) {
            const fd = new FormData();
            fd.append("foto", entry.fotoFile);
            fd.append("id_anak", String(selectedAnak!.id_anak));
            fd.append("id_indikator", String(id));
            fd.append("semester", semester);
            fd.append("tanggal", tanggal);
            fd.append("nilai", entry.nilai);
            fd.append("komentar", komentar);
            // Upload via endpoint single (yang sudah ada) untuk dapat path foto
            const res = await fetch(`${API_URL}/observasi`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
              body: fd,
            });
            const json = await res.json();
            fotoPath = json.data?.foto ?? "";
            return null; // sudah tersimpan via single endpoint
          }
          return { id_indikator: id, nilai: entry.nilai, foto: fotoPath };
        })
      );

      // Batch insert untuk yang tidak punya foto
      const batchItems = penilaian.filter(Boolean);
      if (batchItems.length > 0) {
        const res = await fetch(`${API_URL}/observasi/batch`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id_anak: selectedAnak!.id_anak,
            semester,
            tanggal,
            komentar,
            penilaian: batchItems,
          }),
        });
        if (!res.ok) throw new Error("Gagal menyimpan penilaian.");
      }

      setShowSuccess(true);
    } catch (err) {
      setErrorFields(["Terjadi kesalahan saat menyimpan. Coba lagi."]);
      setShowError(true);
    } finally {
      setLoadingSimpan(false);
    }
  };

  const handleReset = () => {
    setStep("filter");
    setSelectedKelas(null); setSelectedAnak(null);
    setSemester(getDefaultSemester());
    setAspekDipilih([]); setKegiatanDipilih([]); setIndikatorDipilih([]);
    setNilaiMap({}); setKomentar(""); setExpandedKegiatan([]);
    setTanggal(new Date().toISOString().split("T")[0]);
  };

  const aspekTerpilih = aspekList.filter((a) => aspekDipilih.includes(a.id_aspek));
  const totalInd = indikatorDipilih.length;
  const sudahNilaiCount = indikatorDipilih.filter((id) => nilaiMap[id]?.nilai).length;

  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {/* POPUP SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-gray-800 mb-1">Berhasil Disimpan</h3>
            <p className="text-sm text-gray-500 mb-1"><strong>{selectedAnak?.nama_anak}</strong> · {tanggal}</p>
            <p className="text-xs text-gray-400 mb-5">{totalInd} indikator dari {aspekDipilih.length} aspek berhasil disimpan.</p>
            <button onClick={() => { setShowSuccess(false); handleReset(); }}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium">Selesai</button>
          </div>
        </div>
      )}

      {/* POPUP ERROR */}
      {showError && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <X size={24} className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-3">Data Belum Lengkap</h3>
            <ul className="text-left text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3 mb-5 space-y-1">
              {errorFields.map((msg, i) => (
                <li key={i} className="flex items-start gap-2"><span className="shrink-0 mt-0.5">•</span><span>{msg}</span></li>
              ))}
            </ul>
            <button onClick={() => setShowError(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium">Oke, Saya Lengkapi</button>
          </div>
        </div>
      )}

      {/* Step Indicator */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        {(["filter", "pilih-aspek", "isi-nilai"] as Step[]).map((s, i) => (
          <span key={s} className="flex items-center gap-2">
            {i > 0 && <ChevronRight size={12} />}
            <span className={step === s ? "text-blue-600 font-semibold" : ""}>
              {["① Filter", "② Pilih Aspek", "③ Isi Penilaian"][i]}
            </span>
          </span>
        ))}
      </div>

      {/* ══ STEP 1: FILTER ══ */}
      {step === "filter" && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-semibold text-gray-700 mb-1">Pilih Data Anak</p>
          <p className="text-xs text-gray-400 mb-4">Lengkapi semua pilihan di bawah untuk melanjutkan penilaian.</p>

          {loadingKelas ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
              <Loader2 size={16} className="animate-spin" /> Memuat data kelas...
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-3 w-full">

              {/* 1. Tahun Ajaran */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Tahun Ajaran</label>
                <div className="relative">
                  <select value={tahunAjaran} onChange={(e) => handleTahunAjaranChange(e.target.value)} className={selectClass}>
                    <option value="">Pilih tahun ajaran</option>
                    {tahunAjaranList.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>
              </div>

              {/* 2. Semester */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Semester</label>
                <div className="relative">
                  <select value={semester} onChange={(e) => handleSemesterChange(e.target.value)} disabled={!tahunAjaran} className={selectClass}>
                    <option value="">Pilih semester</option>
                    <option value="Semester 1">Semester 1</option>
                    <option value="Semester 2">Semester 2</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>
              </div>

              {/* 3. Kelas */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Kelas
                  {semester && kelasFiltered.length > 0 && (
                    <span className="ml-1.5 text-[10px] font-normal text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                      {kelasFiltered.length} kelas
                    </span>
                  )}
                </label>
                <div className="relative">
                  <select
                    value={selectedKelas?.id_kelas ?? ""}
                    onChange={(e) => handleKelasChange(e.target.value)}
                    disabled={!semester}
                    className={selectClass}
                  >
                    <option value="">Pilih kelas</option>
                    {kelasFiltered.map((k) => (
                      <option key={k.id_kelas} value={k.id_kelas}>{k.nama_kelas}</option>
                    ))}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>
              </div>

              {/* 4. Nama Anak */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">
                  Nama Anak
                  {selectedKelas && anakList.length > 0 && (
                    <span className="ml-1.5 text-[10px] font-normal text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full">
                      {anakList.length} siswa
                    </span>
                  )}
                </label>
                <div className="relative">
                  {loadingAnak ? (
                    <div className="flex items-center gap-2 border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-gray-400">
                      <Loader2 size={14} className="animate-spin" /> Memuat...
                    </div>
                  ) : (
                    <select
                      value={selectedAnak?.id_anak ?? ""}
                      onChange={(e) => handleAnakChange(e.target.value)}
                      disabled={!selectedKelas}
                      className={selectClass}
                    >
                      <option value="">Pilih nama anak</option>
                      {anakList.map((a) => (
                        <option key={a.id_anak} value={a.id_anak}>{a.nama_anak}</option>
                      ))}
                    </select>
                  )}
                  {!loadingAnak && (
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                  )}
                </div>
              </div>

            </div>
          )}

          <button onClick={handleTampilkan} disabled={loadingKelas}
            className="mt-5 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-8 py-2.5 rounded-lg transition-colors">
            Tampilkan
          </button>
        </div>
      )}

      {/* ══ STEP 2: PILIH ASPEK ══ */}
      {step === "pilih-aspek" && (
        <div className="space-y-4">
          <InfoBar anak={selectedAnak?.nama_anak ?? ""} kelas={selectedKelas?.nama_kelas ?? ""} semester={semester} tahunAjaran={tahunAjaran} onGanti={() => setStep("filter")} />

          {/* Fetch aspek di step ini kalau belum ada */}
          {aspekList.length === 0 ? (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              {loadingAspek ? (
                <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                  <Loader2 size={16} className="animate-spin" /> Memuat aspek perkembangan...
                </div>
              ) : (
                <button onClick={() => apiFetch<Aspek[]>("/api/aspek").then(setAspekList)}
                  className="text-sm text-blue-500 hover:underline">Muat ulang aspek</button>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <p className="text-sm font-semibold text-gray-700 mb-1">Pilih aspek yang dinilai hari ini</p>
              <p className="text-xs text-gray-400 mb-4">Tidak semua aspek harus dinilai setiap hari.</p>
              <div className="grid grid-cols-2 gap-2 mb-4">
                {aspekList.map((a) => {
                  const active = aspekDipilih.includes(a.id_aspek);
                  return (
                    <button key={a.id_aspek} onClick={() => toggleAspek(a.id_aspek)}
                      className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${active ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                      <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${active ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                        {active && <span className="text-white text-[10px] font-bold">✓</span>}
                      </div>
                      <div>
                        <p className={`text-sm font-semibold ${active ? "text-blue-700" : "text-gray-700"}`}>{a.nama_aspek}</p>
                        <p className="text-xs text-gray-400">{groupByKegiatan(a.indikator).length} kegiatan · {a.indikator.length} indikator</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">{aspekDipilih.length === 0 ? "Belum ada aspek dipilih" : `${aspekDipilih.length} aspek dipilih`}</span>
                <div className="flex gap-2 text-xs">
                  <button onClick={() => setAspekDipilih(aspekList.map((a) => a.id_aspek))} className="text-blue-500 hover:underline">Pilih semua</button>
                  <span className="text-gray-300">|</span>
                  <button onClick={() => setAspekDipilih([])} className="text-gray-400 hover:underline">Hapus pilihan</button>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button onClick={handleLanjutNilai} disabled={aspekList.length === 0}
              className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
              Lanjut Pilih Kegiatan & Indikator →
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 3: ISI NILAI ══ */}
      {step === "isi-nilai" && (
        <div className="space-y-4">
          <InfoBar anak={selectedAnak?.nama_anak ?? ""} kelas={selectedKelas?.nama_kelas ?? ""} semester={semester} tahunAjaran={tahunAjaran} onGanti={() => setStep("pilih-aspek")} gantiLabel="← Ubah aspek" />

          {/* Tanggal */}
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center gap-3 flex-wrap">
            <CalendarDays size={17} className="text-blue-400 shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Tanggal Penilaian</span>
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <span className="text-xs text-gray-400">Berlaku untuk semua indikator di bawah</span>
          </div>

          {/* Legenda */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3">
            <p className="text-xs font-semibold text-gray-500 mb-2">Keterangan Nilai Perkembangan</p>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {NILAI_OPTIONS.map((val) => {
                const info = NILAI_INFO[val];
                return (
                  <div key={val} className={`rounded-lg border px-3 py-2 ${info.selectedColor}`}>
                    <p className="text-xs font-bold">{val} — {info.label}</p>
                    <p className="text-[11px] mt-0.5 opacity-80">{info.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Progress bar */}
          {totalInd > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all" style={{ width: `${(sudahNilaiCount / totalInd) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-500 shrink-0">{sudahNilaiCount}/{totalInd} indikator dinilai</span>
            </div>
          )}

          {/* Per Aspek */}
          {loadingAspek ? (
            <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
              <Loader2 size={16} className="animate-spin" /> Memuat aspek...
            </div>
          ) : (
            aspekTerpilih.map((aspek) => {
              const kegiatanGroups = groupByKegiatan(aspek.indikator);
              return (
                <div key={aspek.id_aspek} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <div className="bg-blue-600 px-4 py-2.5 flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{aspek.nama_aspek}</span>
                    <span className="text-xs text-blue-200">
                      {kegiatanGroups.filter((kg) => kegiatanDipilih.includes(kegiatanKey(aspek.id_aspek, kg.nama_kegiatan))).length}/{kegiatanGroups.length} kegiatan dipilih
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {kegiatanGroups.map((kg) => {
                      const key = kegiatanKey(aspek.id_aspek, kg.nama_kegiatan);
                      const isKegiatanSelected = kegiatanDipilih.includes(key);
                      const isExpanded = expandedKegiatan.includes(key);
                      const indTerpilihCount = kg.indikator.filter((i) => indikatorDipilih.includes(i.id_indikator)).length;
                      const nilaiCount = kg.indikator.filter((i) => nilaiMap[i.id_indikator]?.nilai).length;

                      return (
                        <div key={key}>
                          <div className={`flex items-center gap-3 px-4 py-3 ${isKegiatanSelected ? "bg-blue-50" : "bg-white"}`}>
                            <button onClick={() => toggleKegiatan(aspek.id_aspek, kg)}
                              className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isKegiatanSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 hover:border-blue-400"}`}>
                              {isKegiatanSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                            </button>
                            <button className="flex-1 text-left" onClick={() => toggleExpandKegiatan(key)}>
                              <span className={`text-sm font-semibold ${isKegiatanSelected ? "text-blue-700" : "text-gray-700"}`}>{kg.nama_kegiatan}</span>
                              {isKegiatanSelected ? (
                                <span className="ml-2 text-xs text-gray-400">
                                  {indTerpilihCount}/{kg.indikator.length} indikator
                                  {nilaiCount > 0 && <span className="text-green-500"> · {nilaiCount} dinilai</span>}
                                </span>
                              ) : (
                                <span className="ml-2 text-xs text-gray-400">{kg.indikator.length} indikator</span>
                              )}
                            </button>
                            <button onClick={() => toggleExpandKegiatan(key)} className="text-gray-400 hover:text-gray-600">
                              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                            </button>
                          </div>

                          {isExpanded && (
                            <div className="border-t border-gray-100 bg-gray-50">
                              {!isKegiatanSelected && (
                                <p className="px-12 py-2 text-xs text-gray-400 italic">Centang kegiatan di atas untuk memilih indikator</p>
                              )}
                              {kg.indikator.map((ind) => {
                                const isIndSelected = indikatorDipilih.includes(ind.id_indikator);
                                const entry = nilaiMap[ind.id_indikator];
                                const disabled = !isKegiatanSelected;

                                return (
                                  <div key={ind.id_indikator}
                                    className={`px-4 py-3 border-b border-gray-100 last:border-0 transition-colors pl-12 ${disabled ? "opacity-40" : isIndSelected ? "bg-white" : "hover:bg-white"}`}>
                                    <div className="flex items-start gap-3">
                                      <button onClick={() => !disabled && toggleIndikator(ind, aspek)} disabled={disabled}
                                        className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isIndSelected ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-400"} ${disabled ? "cursor-default" : "cursor-pointer"}`}>
                                        {isIndSelected && <span className="text-white text-[9px] font-bold">✓</span>}
                                      </button>
                                      <p className="flex-1 text-xs text-gray-600 leading-relaxed">{ind.nama_indikator}</p>
                                    </div>

                                    {isIndSelected && (
                                      <div className="mt-2.5 ml-7 flex flex-wrap items-center gap-2">
                                        {NILAI_OPTIONS.map((val) => {
                                          const selected = entry?.nilai === val;
                                          const info = NILAI_INFO[val];
                                          return (
                                            <button key={val} onClick={() => handleNilai(ind.id_indikator, val)}
                                              title={`${info.label} — ${info.desc}`}
                                              className={`px-2.5 py-1 rounded-lg border text-xs font-bold transition-all ${selected ? info.selectedColor : info.color}`}>
                                              {val}
                                            </button>
                                          );
                                        })}
                                        <span className="text-gray-300 text-xs">|</span>
                                        {entry?.foto ? (
                                          <div className="flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-lg px-2 py-1">
                                            <ImagePlus size={12} className="text-blue-400 shrink-0" />
                                            <span className="text-[11px] text-blue-600 max-w-[80px] truncate">{entry.foto}</span>
                                            <button onClick={() => removeFile(ind.id_indikator)} title="Hapus foto">
                                              <X size={11} className="text-red-400 hover:text-red-600" />
                                            </button>
                                          </div>
                                        ) : (
                                          <label className="flex items-center gap-1.5 cursor-pointer text-xs text-gray-500 hover:text-blue-600 border border-dashed border-gray-300 hover:border-blue-400 rounded-lg px-2.5 py-1 transition-colors">
                                            <ImagePlus size={12} />
                                            <span>Tambah Foto Bukti</span>
                                            <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(ind.id_indikator, e)} />
                                          </label>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })
          )}

          {/* Komentar */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">Komentar / Catatan Guru</p>
            <textarea placeholder="Tuliskan catatan perkembangan anak hari ini..."
              value={komentar} onChange={(e) => setKomentar(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none" rows={3} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pb-4">
            <button onClick={() => setStep("pilih-aspek")} disabled={loadingSimpan}
              className="border border-gray-300 text-gray-600 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50">
              Kembali
            </button>
            <button onClick={handleSimpan} disabled={loadingSimpan}
              className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors flex items-center gap-2">
              {loadingSimpan && <Loader2 size={14} className="animate-spin" />}
              {loadingSimpan ? "Menyimpan..." : "Simpan Penilaian"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function InfoBar({ anak, kelas, semester, tahunAjaran, onGanti, gantiLabel = "Ganti" }: {
  anak: string; kelas: string; semester: string; tahunAjaran: string;
  onGanti: () => void; gantiLabel?: string;
}) {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-sm font-semibold text-blue-800">{anak} · {kelas}</p>
        <p className="text-xs text-blue-500">{semester} · {tahunAjaran}</p>
      </div>
      <button onClick={onGanti} className="text-xs text-blue-400 hover:text-blue-600 underline">{gantiLabel}</button>
    </div>
  );
}
