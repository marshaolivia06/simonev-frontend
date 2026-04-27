"use client";

import { useState } from "react";
import { CheckCircle, Upload, X, ChevronRight, CalendarDays, ChevronDown, ChevronUp } from "lucide-react";

// ─── DATA HIERARKI ───────────────────────────────────────────────
interface Indikator { id: string; label: string; }
interface Kegiatan { id: string; label: string; indikator: Indikator[]; }
interface Aspek { id: string; label: string; kegiatan: Kegiatan[]; }

const dataAspek: Aspek[] = [
  {
    id: "motorik", label: "Motorik",
    kegiatan: [
      { id: "motorik-berlari", label: "Berlari", indikator: [
        { id: "motorik-berlari-1", label: "Mampu berlari lurus tanpa jatuh" },
        { id: "motorik-berlari-2", label: "Mampu berlari mengikuti arah" },
        { id: "motorik-berlari-3", label: "Mampu berlari dan berhenti saat aba-aba" },
      ]},
      { id: "motorik-melompat", label: "Melompat", indikator: [
        { id: "motorik-melompat-1", label: "Mampu melompat dengan dua kaki" },
        { id: "motorik-melompat-2", label: "Mampu melompat melewati rintangan kecil" },
      ]},
      { id: "motorik-menulis", label: "Menulis / Memegang Pensil", indikator: [
        { id: "motorik-menulis-1", label: "Mampu memegang pensil dengan benar" },
        { id: "motorik-menulis-2", label: "Mampu membuat garis lurus dan lengkung" },
      ]},
    ],
  },
  {
    id: "kognitif", label: "Kognitif",
    kegiatan: [
      { id: "kognitif-angka", label: "Mengenal Angka", indikator: [
        { id: "kognitif-angka-1", label: "Mampu menyebutkan angka 1–10" },
        { id: "kognitif-angka-2", label: "Mampu mengurutkan angka 1–10" },
        { id: "kognitif-angka-3", label: "Mampu mencocokkan jumlah benda dengan angka" },
      ]},
      { id: "kognitif-warna", label: "Mengenal Warna", indikator: [
        { id: "kognitif-warna-1", label: "Mampu menyebutkan warna dasar" },
        { id: "kognitif-warna-2", label: "Mampu mengelompokkan benda berdasarkan warna" },
      ]},
      { id: "kognitif-bentuk", label: "Mengenal Bentuk", indikator: [
        { id: "kognitif-bentuk-1", label: "Mampu menyebutkan bentuk lingkaran, segitiga, persegi" },
        { id: "kognitif-bentuk-2", label: "Mampu mengelompokkan benda berdasarkan bentuk" },
      ]},
    ],
  },
  {
    id: "bahasa", label: "Bahasa",
    kegiatan: [
      { id: "bahasa-bicara", label: "Berbicara", indikator: [
        { id: "bahasa-bicara-1", label: "Mampu menyebutkan nama benda di sekitarnya" },
        { id: "bahasa-bicara-2", label: "Mampu berbicara dalam kalimat sederhana" },
      ]},
      { id: "bahasa-cerita", label: "Bercerita", indikator: [
        { id: "bahasa-cerita-1", label: "Mampu menceritakan pengalaman sehari-hari" },
        { id: "bahasa-cerita-2", label: "Mampu menjawab pertanyaan dari cerita" },
      ]},
      { id: "bahasa-huruf", label: "Mengenal Huruf", indikator: [
        { id: "bahasa-huruf-1", label: "Mampu menyebutkan huruf vokal" },
        { id: "bahasa-huruf-2", label: "Mampu mengenali beberapa huruf konsonan" },
      ]},
    ],
  },
  {
    id: "sosem", label: "Sosial-Emosional",
    kegiatan: [
      { id: "sosem-bermain", label: "Bermain Bersama", indikator: [
        { id: "sosem-bermain-1", label: "Mampu bermain bersama teman sebaya" },
        { id: "sosem-bermain-2", label: "Mampu berbagi mainan" },
        { id: "sosem-bermain-3", label: "Mampu menunggu giliran" },
      ]},
      { id: "sosem-mandiri", label: "Kemandirian", indikator: [
        { id: "sosem-mandiri-1", label: "Mampu memakai sepatu sendiri" },
        { id: "sosem-mandiri-2", label: "Mampu merapikan mainan setelah digunakan" },
      ]},
    ],
  },
  {
    id: "agama", label: "Agama & Moral",
    kegiatan: [
      { id: "agama-doa", label: "Berdoa", indikator: [
        { id: "agama-doa-1", label: "Mampu berdoa sebelum dan sesudah makan" },
        { id: "agama-doa-2", label: "Mampu berdoa sebelum belajar" },
      ]},
      { id: "agama-adab", label: "Adab & Sopan Santun", indikator: [
        { id: "agama-adab-1", label: "Mampu mengucapkan salam" },
        { id: "agama-adab-2", label: "Mampu berterima kasih dan meminta maaf" },
      ]},
    ],
  },
  {
    id: "seni", label: "Kreativitas / Seni",
    kegiatan: [
      { id: "seni-menggambar", label: "Menggambar", indikator: [
        { id: "seni-menggambar-1", label: "Mampu menggambar objek sederhana (rumah, pohon)" },
        { id: "seni-menggambar-2", label: "Mampu mewarnai gambar dengan rapi" },
        { id: "seni-menggambar-3", label: "Mampu memberi nama pada gambarnya" },
      ]},
      { id: "seni-kolase", label: "Kolase & Prakarya", indikator: [
        { id: "seni-kolase-1", label: "Mampu menempel potongan kertas membentuk pola" },
        { id: "seni-kolase-2", label: "Mampu membuat karya dari bahan bekas" },
      ]},
      { id: "seni-musik", label: "Musik & Gerak", indikator: [
        { id: "seni-musik-1", label: "Mampu mengikuti irama lagu sederhana" },
        { id: "seni-musik-2", label: "Mampu bergerak sesuai irama musik" },
      ]},
    ],
  },
];

// ─── TYPES ───────────────────────────────────────────────────────
interface NilaiEntry {
  indikatorId: string; aspekLabel: string; kegiatanLabel: string;
  indikatorLabel: string; nilai: string; dokumentasi: string;
}
type Step = "filter" | "pilih-aspek" | "isi-nilai";

const kelasOptions = ["TK A1", "TK A2", "TK A3", "TK B1", "TK B2", "TK B3"];
const anakOptions = ["Ahmad Fauzan", "Siti Rahayu", "Budi Santoso", "Dewi Lestari"];
const semesterOptions = ["Semester 1", "Semester 2"];
const tahunAjaranOptions = ["2023/2024", "2024/2025", "2025/2026"];
const NILAI_OPTIONS = ["BB", "MB", "BSH", "BSB"] as const;
const NILAI_COLORS: Record<string, string> = {
  BB: "text-red-600 border-red-300 bg-red-50 ring-red-300",
  MB: "text-yellow-600 border-yellow-300 bg-yellow-50 ring-yellow-300",
  BSH: "text-blue-600 border-blue-300 bg-blue-50 ring-blue-300",
  BSB: "text-green-600 border-green-300 bg-green-50 ring-green-300",
};

const selectClass = "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8 cursor-pointer";

// ─── MAIN COMPONENT ──────────────────────────────────────────────
export default function PenilaianPage() {
  const [step, setStep] = useState<Step>("filter");
  const [kelas, setKelas] = useState("");
  const [anak, setAnak] = useState("");
  const [semester, setSemester] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [tanggal, setTanggal] = useState(() => new Date().toISOString().split("T")[0]);

  const [aspekDipilih, setAspekDipilih] = useState<string[]>([]);
  const [kegiatanDipilih, setKegiatanDipilih] = useState<string[]>([]);
  const [indikatorDipilih, setIndikatorDipilih] = useState<string[]>([]);
  const [expandedKegiatan, setExpandedKegiatan] = useState<string[]>([]);
  const [nilaiMap, setNilaiMap] = useState<Record<string, NilaiEntry>>({});
  const [komentar, setKomentar] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  // ── Step 1 ──
  const handleTampilkan = () => {
    if (!kelas || !anak || !semester || !tahunAjaran) {
      setErrorFields(["Harap lengkapi semua filter: Kelas, Nama Anak, Semester, dan Tahun Ajaran."]);
      setShowError(true); return;
    }
    setAspekDipilih([]); setKegiatanDipilih([]);
    setIndikatorDipilih([]); setNilaiMap({}); setExpandedKegiatan([]);
    setStep("pilih-aspek");
  };

  // ── Step 2 ──
  const toggleAspek = (id: string) =>
    setAspekDipilih((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleLanjutNilai = () => {
    if (aspekDipilih.length === 0) {
      setErrorFields(["Pilih minimal satu aspek yang akan dinilai hari ini."]);
      setShowError(true); return;
    }
    setStep("isi-nilai");
  };

  // ── Step 3: kegiatan ──
  const toggleExpandKegiatan = (id: string) =>
    setExpandedKegiatan((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleKegiatan = (kegiatan: Kegiatan) => {
    const isSelected = kegiatanDipilih.includes(kegiatan.id);
    if (isSelected) {
      setKegiatanDipilih((prev) => prev.filter((x) => x !== kegiatan.id));
      const indIds = kegiatan.indikator.map((i) => i.id);
      setIndikatorDipilih((prev) => prev.filter((x) => !indIds.includes(x)));
      setNilaiMap((prev) => { const n = { ...prev }; indIds.forEach((id) => delete n[id]); return n; });
    } else {
      setKegiatanDipilih((prev) => [...prev, kegiatan.id]);
      if (!expandedKegiatan.includes(kegiatan.id))
        setExpandedKegiatan((prev) => [...prev, kegiatan.id]);
    }
  };

  // ── Step 3: indikator ──
  const toggleIndikator = (ind: Indikator, kegiatan: Kegiatan, aspek: Aspek) => {
    const isSelected = indikatorDipilih.includes(ind.id);
    if (isSelected) {
      setIndikatorDipilih((prev) => prev.filter((x) => x !== ind.id));
      setNilaiMap((prev) => { const n = { ...prev }; delete n[ind.id]; return n; });
    } else {
      setIndikatorDipilih((prev) => [...prev, ind.id]);
      setNilaiMap((prev) => ({
        ...prev,
        [ind.id]: { indikatorId: ind.id, aspekLabel: aspek.label, kegiatanLabel: kegiatan.label, indikatorLabel: ind.label, nilai: "", dokumentasi: "" },
      }));
    }
  };

  const handleNilai = (id: string, val: string) =>
    setNilaiMap((prev) => ({ ...prev, [id]: { ...prev[id], nilai: val } }));

  const handleFile = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setNilaiMap((prev) => ({ ...prev, [id]: { ...prev[id], dokumentasi: file.name } }));
  };

  const removeFile = (id: string) =>
    setNilaiMap((prev) => ({ ...prev, [id]: { ...prev[id], dokumentasi: "" } }));

  // ── Simpan ──
  const handleSimpan = () => {
    const errors: string[] = [];
    if (!tanggal) errors.push("Tanggal penilaian belum diisi.");
    if (indikatorDipilih.length === 0) errors.push("Pilih minimal satu indikator yang akan dinilai.");
    const belumNilai = indikatorDipilih.filter((id) => !nilaiMap[id]?.nilai);
    if (belumNilai.length > 0)
      errors.push(`Nilai belum diisi untuk: ${belumNilai.map((id) => nilaiMap[id]?.indikatorLabel || id).join(", ")}`);
    if (errors.length > 0) { setErrorFields(errors); setShowError(true); return; }
    setShowSuccess(true);
  };

  const handleReset = () => {
    setStep("filter"); setKelas(""); setAnak(""); setSemester(""); setTahunAjaran("");
    setAspekDipilih([]); setKegiatanDipilih([]); setIndikatorDipilih([]);
    setNilaiMap({}); setKomentar(""); setExpandedKegiatan([]);
    setTanggal(new Date().toISOString().split("T")[0]);
  };

  const aspekTerpilih = dataAspek.filter((a) => aspekDipilih.includes(a.id));
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
            <p className="text-sm text-gray-500 mb-1"><strong>{anak}</strong> · {tanggal}</p>
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
          <p className="text-sm font-semibold text-gray-700 mb-4">Pilih Data Anak</p>
          <div className="grid grid-cols-2 gap-3 max-w-lg">
            {[
              { label: "Kelas", val: kelas, set: setKelas, opts: kelasOptions, ph: "Pilih kelas" },
              { label: "Nama Anak", val: anak, set: setAnak, opts: anakOptions, ph: "Pilih anak" },
              { label: "Semester", val: semester, set: setSemester, opts: semesterOptions, ph: "Pilih semester" },
              { label: "Tahun Ajaran", val: tahunAjaran, set: setTahunAjaran, opts: tahunAjaranOptions, ph: "Pilih tahun" },
            ].map(({ label, val, set, opts, ph }) => (
              <div key={label}>
                <label className="block text-xs font-semibold text-gray-500 mb-1">{label}</label>
                <div className="relative">
                  <select value={val} onChange={(e) => set(e.target.value)} className={selectClass}>
                    <option value="">{ph}</option>
                    {opts.map((o) => <option key={o}>{o}</option>)}
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleTampilkan}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
            Tampilkan
          </button>
        </div>
      )}

      {/* ══ STEP 2: PILIH ASPEK ══ */}
      {step === "pilih-aspek" && (
        <div className="space-y-4">
          <InfoBar anak={anak} kelas={kelas} semester={semester} tahunAjaran={tahunAjaran} onGanti={() => setStep("filter")} />
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-semibold text-gray-700 mb-1">Pilih aspek yang dinilai hari ini</p>
            <p className="text-xs text-gray-400 mb-4">Tidak semua aspek harus dinilai setiap hari.</p>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {dataAspek.map((a) => {
                const active = aspekDipilih.includes(a.id);
                return (
                  <button key={a.id} onClick={() => toggleAspek(a.id)}
                    className={`flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${active ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"}`}>
                    <div className={`mt-0.5 w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 ${active ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                      {active && <span className="text-white text-[10px] font-bold">✓</span>}
                    </div>
                    <div>
                      <p className={`text-sm font-semibold ${active ? "text-blue-700" : "text-gray-700"}`}>{a.label}</p>
                      <p className="text-xs text-gray-400">{a.kegiatan.length} kegiatan tersedia</p>
                    </div>
                  </button>
                );
              })}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{aspekDipilih.length === 0 ? "Belum ada aspek dipilih" : `${aspekDipilih.length} aspek dipilih`}</span>
              <div className="flex gap-2 text-xs">
                <button onClick={() => setAspekDipilih(dataAspek.map((a) => a.id))} className="text-blue-500 hover:underline">Pilih semua</button>
                <span className="text-gray-300">|</span>
                <button onClick={() => setAspekDipilih([])} className="text-gray-400 hover:underline">Hapus pilihan</button>
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={handleLanjutNilai}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
              Lanjut Pilih Kegiatan & Indikator →
            </button>
          </div>
        </div>
      )}

      {/* ══ STEP 3: ISI NILAI ══ */}
      {step === "isi-nilai" && (
        <div className="space-y-4">
          <InfoBar anak={anak} kelas={kelas} semester={semester} tahunAjaran={tahunAjaran} onGanti={() => setStep("pilih-aspek")} gantiLabel="← Ubah aspek" />

          {/* Tanggal */}
          <div className="bg-white rounded-xl border border-gray-200 px-5 py-3 flex items-center gap-3 flex-wrap">
            <CalendarDays size={17} className="text-blue-400 shrink-0" />
            <span className="text-sm font-semibold text-gray-700">Tanggal Penilaian</span>
            <input type="date" value={tanggal} onChange={(e) => setTanggal(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300" />
            <span className="text-xs text-gray-400">Berlaku untuk semua indikator di bawah</span>
          </div>

          {/* Progress bar */}
          {totalInd > 0 && (
            <div className="flex items-center gap-3">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                <div className="bg-green-500 h-1.5 rounded-full transition-all"
                  style={{ width: `${(sudahNilaiCount / totalInd) * 100}%` }} />
              </div>
              <span className="text-xs text-gray-500 shrink-0">{sudahNilaiCount}/{totalInd} indikator dinilai</span>
            </div>
          )}

          {/* Per Aspek */}
          {aspekTerpilih.map((aspek) => (
            <div key={aspek.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              {/* Header aspek */}
              <div className="bg-blue-600 px-4 py-2.5 flex items-center justify-between">
                <span className="text-sm font-bold text-white">{aspek.label}</span>
                <span className="text-xs text-blue-200">
                  {aspek.kegiatan.filter((k) => kegiatanDipilih.includes(k.id)).length}/{aspek.kegiatan.length} kegiatan dipilih
                </span>
              </div>

              {/* List kegiatan */}
              <div className="divide-y divide-gray-100">
                {aspek.kegiatan.map((kegiatan) => {
                  const isKegiatanSelected = kegiatanDipilih.includes(kegiatan.id);
                  const isExpanded = expandedKegiatan.includes(kegiatan.id);
                  const indTerpilihCount = kegiatan.indikator.filter((i) => indikatorDipilih.includes(i.id)).length;
                  const nilaiCount = kegiatan.indikator.filter((i) => nilaiMap[i.id]?.nilai).length;

                  return (
                    <div key={kegiatan.id}>
                      {/* Row kegiatan */}
                      <div className={`flex items-center gap-3 px-4 py-3 ${isKegiatanSelected ? "bg-blue-50" : "bg-white"}`}>
                        {/* Checkbox kegiatan */}
                        <button onClick={() => toggleKegiatan(kegiatan)}
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${isKegiatanSelected ? "bg-blue-500 border-blue-500" : "border-gray-300 hover:border-blue-400"}`}>
                          {isKegiatanSelected && <span className="text-white text-[10px] font-bold">✓</span>}
                        </button>

                        {/* Nama kegiatan + stats */}
                        <button className="flex-1 text-left" onClick={() => toggleExpandKegiatan(kegiatan.id)}>
                          <span className={`text-sm font-semibold ${isKegiatanSelected ? "text-blue-700" : "text-gray-700"}`}>
                            {kegiatan.label}
                          </span>
                          {isKegiatanSelected && (
                            <span className="ml-2 text-xs text-gray-400">
                              {indTerpilihCount}/{kegiatan.indikator.length} indikator
                              {nilaiCount > 0 && <span className="text-green-500"> · {nilaiCount} dinilai</span>}
                            </span>
                          )}
                          {!isKegiatanSelected && (
                            <span className="ml-2 text-xs text-gray-400">{kegiatan.indikator.length} indikator</span>
                          )}
                        </button>

                        {/* Expand toggle */}
                        <button onClick={() => toggleExpandKegiatan(kegiatan.id)} className="text-gray-400 hover:text-gray-600">
                          {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </div>

                      {/* Indikator list */}
                      {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50">
                          {!isKegiatanSelected && (
                            <p className="px-12 py-2 text-xs text-gray-400 italic">
                              Centang kegiatan di atas untuk memilih indikator
                            </p>
                          )}
                          {kegiatan.indikator.map((ind) => {
                            const isIndSelected = indikatorDipilih.includes(ind.id);
                            const entry = nilaiMap[ind.id];
                            const disabled = !isKegiatanSelected;

                            return (
                              <div key={ind.id}
                                className={`flex items-center gap-3 px-4 py-2.5 border-b border-gray-100 last:border-0 transition-colors pl-12 ${
                                  disabled ? "opacity-40" : isIndSelected ? "bg-white" : "hover:bg-white"
                                }`}>
                                {/* Checkbox indikator */}
                                <button onClick={() => !disabled && toggleIndikator(ind, kegiatan, aspek)}
                                  disabled={disabled}
                                  className={`w-4 h-4 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                                    isIndSelected ? "bg-green-500 border-green-500" : "border-gray-300 hover:border-green-400"
                                  } ${disabled ? "cursor-default" : "cursor-pointer"}`}>
                                  {isIndSelected && <span className="text-white text-[9px] font-bold">✓</span>}
                                </button>

                                {/* Label */}
                                <p className="flex-1 text-xs text-gray-600 leading-relaxed min-w-0">{ind.label}</p>

                                {/* Nilai — hanya jika dipilih */}
                                {isIndSelected && (
                                  <div className="flex items-center gap-1.5 shrink-0">
                                    {NILAI_OPTIONS.map((val) => {
                                      const selected = entry?.nilai === val;
                                      return (
                                        <button key={val} onClick={() => handleNilai(ind.id, val)}
                                          className={`px-2 py-0.5 rounded-md border text-xs font-bold transition-all ${
                                            selected
                                              ? `${NILAI_COLORS[val]} ring-2 ring-offset-1`
                                              : "text-gray-400 border-gray-200 bg-white hover:border-gray-300"
                                          }`}>
                                          {val}
                                        </button>
                                      );
                                    })}
                                    {/* Upload */}
                                    {entry?.dokumentasi ? (
                                      <div className="flex items-center gap-1">
                                        <span className="text-[10px] text-gray-500 max-w-[56px] truncate">{entry.dokumentasi}</span>
                                        <button onClick={() => removeFile(ind.id)}>
                                          <X size={11} className="text-red-400 hover:text-red-600" />
                                        </button>
                                      </div>
                                    ) : (
                                      <label className="cursor-pointer text-blue-400 hover:text-blue-600">
                                        <Upload size={13} />
                                        <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(ind.id, e)} />
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
          ))}

          {/* Komentar */}
          <div className="bg-gray-50 rounded-xl border border-gray-200 p-4">
            <p className="text-xs font-semibold text-gray-500 mb-2">Komentar / Catatan Guru</p>
            <textarea placeholder="Tuliskan catatan perkembangan anak hari ini..."
              value={komentar} onChange={(e) => setKomentar(e.target.value)}
              className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none" rows={3} />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pb-4">
            <button onClick={() => setStep("pilih-aspek")}
              className="border border-gray-300 text-gray-600 text-sm font-medium px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Kembali
            </button>
            <button onClick={handleSimpan}
              className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-6 py-2 rounded-lg transition-colors">
              Simpan Penilaian
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
