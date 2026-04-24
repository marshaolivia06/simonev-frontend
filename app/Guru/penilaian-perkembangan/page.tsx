"use client";

import { useState } from "react";
import { CheckCircle, Upload, X } from "lucide-react";

interface Penilaian {
  aspek: string;
  kegiatan: string;
  indikator: string;
  nilai: string;
  tanggal: string;
  dokumentasi: string;
}

const kelasOptions = ["Kelas A", "Kelas B"];
const anakOptions = ["Anak 1", "Anak 2"];
const semesterOptions = ["Semester 1", "Semester 2"];
const tahunAjaranOptions = ["2023/2024", "2024/2025", "2025/2026"];

const selectClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8 cursor-pointer";

const initialData: Penilaian[] = [
  { aspek: "Bahasa", kegiatan: "Bicara", indikator: "Menyebutkan nama benda", nilai: "", tanggal: "", dokumentasi: "" },
  { aspek: "Motorik", kegiatan: "Berlari", indikator: "Mampu berlari lurus", nilai: "", tanggal: "", dokumentasi: "" },
  { aspek: "Sosial-Emosional", kegiatan: "Bermain dengan teman", indikator: "Mampu bermain bersama teman sebaya", nilai: "", tanggal: "", dokumentasi: "" },
  { aspek: "Agama", kegiatan: "Berdoa", indikator: "Mampu berdoa dengan benar", nilai: "", tanggal: "", dokumentasi: "" },
  { aspek: "Kreatifitas/Seni", kegiatan: "Menggambar", indikator: "Mampu menggambar objek sederhana", nilai: "", tanggal: "", dokumentasi: "" },
];

export default function PenilaianPage() {
  const [kelas, setKelas] = useState("");
  const [anak, setAnak] = useState("");
  const [semester, setSemester] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [komentar, setKomentar] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorFields, setErrorFields] = useState<string[]>([]);

  const [data, setData] = useState<Penilaian[]>(initialData);

  const handleNilai = (index: number, value: string) => {
    const newData = [...data];
    newData[index].nilai = value;
    setData(newData);
  };

  const handleTanggal = (index: number, value: string) => {
    setData((prev) =>
      prev.map((item, i) => {
        if (index === 0) return { ...item, tanggal: value };
        if (i === index) return { ...item, tanggal: value };
        return item;
      })
    );
  };

  const handleFile = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newData = [...data];
      newData[index].dokumentasi = file.name;
      setData(newData);
    }
  };

  const removeFile = (index: number) => {
    const newData = [...data];
    newData[index].dokumentasi = "";
    setData(newData);
  };

  const handleSimpan = () => {
    const errors: string[] = [];

    if (!kelas) errors.push("Kelas belum dipilih");
    if (!anak) errors.push("Nama anak belum dipilih");
    if (!semester) errors.push("Semester belum dipilih");
    if (!tahunAjaran) errors.push("Tahun ajaran belum dipilih");

    const belumDinilai = data.filter((d) => d.nilai === "");
    const sudahDinilai = data.filter((d) => d.nilai !== "");
    const belumTanggal = sudahDinilai.filter((d) => d.tanggal === "");

    if (belumDinilai.length === data.length) {
      errors.push("Minimal satu aspek harus dinilai (BB / MB / BSH / BSB)");
    } else if (belumDinilai.length > 0) {
      errors.push(
        `${belumDinilai.length} aspek belum dinilai: ${belumDinilai.map((d) => d.aspek).join(", ")}`
      );
    }

    if (belumTanggal.length > 0) {
      errors.push(
        `Tanggal belum diisi pada aspek: ${belumTanggal.map((d) => d.aspek).join(", ")}`
      );
    }

    if (errors.length > 0) {
      setErrorFields(errors);
      setShowError(true);
      return;
    }

    setShowSuccess(true);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* POPUP SUCCESS */}
      {showSuccess && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Berhasil Disimpan</h3>
            <p className="text-sm text-gray-500 mb-5">Penilaian perkembangan anak berhasil disimpan.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      {/* POPUP ERROR VALIDASI */}
      {showError && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
            <div className="flex justify-center mb-3">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <X size={24} className="text-red-500" />
              </div>
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Data Belum Lengkap</h3>
            <p className="text-sm text-gray-500 mb-3">
              Harap lengkapi semua field berikut sebelum menyimpan:
            </p>
            <ul className="text-left text-sm text-red-500 bg-red-50 rounded-lg px-4 py-3 mb-5 space-y-1">
              {errorFields.map((msg, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0">•</span>
                  <span>{msg}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowError(false)}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              Oke, Saya Lengkapi
            </button>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col gap-3 max-w-[420px]">
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <select value={kelas} onChange={(e) => setKelas(e.target.value)} className={selectClass}>
                <option value="">Pilih kelas</option>
                {kelasOptions.map((k) => <option key={k}>{k}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
            <div className="relative">
              <select value={anak} onChange={(e) => setAnak(e.target.value)} className={selectClass}>
                <option value="">Pilih anak</option>
                {anakOptions.map((a) => <option key={a}>{a}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
            <div className="relative">
              <select value={semester} onChange={(e) => setSemester(e.target.value)} className={selectClass}>
                <option value="">Pilih semester</option>
                {semesterOptions.map((s) => <option key={s}>{s}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
            <div className="relative">
              <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className={selectClass}>
                <option value="">Pilih tahun</option>
                {tahunAjaranOptions.map((t) => <option key={t}>{t}</option>)}
              </select>
              <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
            </div>
          </div>
          <div>
            <button className="bg-blue-500 hover:bg-blue-600 active:scale-95 text-white text-sm font-medium px-5 py-2 rounded-lg transition-all duration-150 shadow-sm">
              Tampilkan
            </button>
          </div>
        </div>
      </div>

      {/* Tabel Penilaian */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-10">No</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-40">Tanggal</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Aspek</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Kegiatan</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Indikator</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-12">BB</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-12">MB</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-14">BSH</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-14">BSB</th>
              <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-32">Dokumentasi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className={item.nilai !== "" ? "bg-green-50 hover:bg-green-100" : "hover:bg-gray-50"}>
                <td className="px-3 py-2.5 text-center text-gray-700 border border-gray-300">{index + 1}</td>
                <td className="px-2 py-2 border border-gray-300">
                  <input
                    type="date"
                    value={item.tanggal}
                    onChange={(e) => handleTanggal(index, e.target.value)}
                    title={index === 0 ? "Isi tanggal di sini untuk mengisi semua baris" : undefined}
                    className={`w-full border rounded-md px-2 py-1 text-xs text-gray-700 bg-white focus:outline-none focus:ring-1 focus:ring-blue-300 ${
                      index === 0
                        ? "border-blue-400 ring-1 ring-blue-200"
                        : item.tanggal
                        ? "border-blue-200"
                        : "border-gray-200"
                    }`}
                  />
                </td>
                <td className="px-3 py-2.5 text-gray-700 border border-gray-300">{item.aspek}</td>
                <td className="px-3 py-2.5 text-gray-700 border border-gray-300">{item.kegiatan}</td>
                <td className="px-3 py-2.5 text-gray-700 border border-gray-300">{item.indikator}</td>
                {(["BB", "MB", "BSH", "BSB"] as const).map((val) => (
                  <td key={val} className="border border-gray-300 text-center">
                    <input
                      type="radio"
                      name={`nilai-${index}`}
                      checked={item.nilai === val}
                      onChange={() => handleNilai(index, val)}
                      className="cursor-pointer accent-blue-500"
                    />
                  </td>
                ))}
                <td className="border border-gray-300 px-3 py-2 text-center">
                  {item.dokumentasi ? (
                    <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                      <span className="truncate max-w-[70px]">{item.dokumentasi}</span>
                      <button onClick={() => removeFile(index)}>
                        <X size={12} className="text-red-400 hover:text-red-600" />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer flex items-center justify-center gap-1 text-blue-500 hover:text-blue-700 text-xs">
                      <Upload size={13} />
                      <span>Upload</span>
                      <input type="file" accept="image/*" className="hidden" onChange={(e) => handleFile(index, e)} />
                    </label>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Komentar Guru */}
      <div className="bg-gray-100 rounded-xl border border-gray-200 p-4">
        <textarea
          placeholder="Isi Komentar ..."
          value={komentar}
          onChange={(e) => setKomentar(e.target.value)}
          className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none resize-none"
          rows={4}
        />
      </div>

      {/* Info aspek yang belum diisi */}
      {data.some((d) => d.nilai === "" || d.tanggal === "") && (
        <div className="text-xs text-gray-400 text-right">
          {data.filter((d) => d.nilai === "").length > 0 && (
            <span>{data.filter((d) => d.nilai === "").length} aspek belum dinilai · </span>
          )}
          {data.filter((d) => d.tanggal === "").length > 0 && (
            <span>{data.filter((d) => d.tanggal === "").length} aspek belum ada tanggal</span>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button
          onClick={handleSimpan}
          className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Simpan
        </button>
        <button className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
          Ubah
        </button>
      </div>

    </div>
  );
}