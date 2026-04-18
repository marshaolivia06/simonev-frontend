"use client";

import { useState } from "react";

interface Penilaian {
  aspek: string;
  kegiatan: string;
  indikator: string;
  nilai: string;
}

const kelasOptions = ["Kelas A", "Kelas B"];
const anakOptions = ["Anak 1", "Anak 2"];
const semesterOptions = ["Semester 1", "Semester 2"];
const tahunAjaranOptions = ["2023/2024", "2024/2025", "2025/2026"];

const selectClass =
  "w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8 cursor-pointer";

export default function PenilaianPage() {
  const [kelas, setKelas] = useState("");
  const [anak, setAnak] = useState("");
  const [semester, setSemester] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [komentar, setKomentar] = useState("");

  const [data, setData] = useState<Penilaian[]>([
    {
      aspek: "Bahasa",
      kegiatan: "Bicara",
      indikator: "Menyebutkan nama benda",
      nilai: "",
    },
    {
      aspek: "Motorik",
      kegiatan: "Berlari",
      indikator: "Mampu berlari lurus",
      nilai: "",
    },
  ]);

  const handleChange = (index: number, value: string) => {
    const newData = [...data];
    newData[index].nilai = value;
    setData(newData);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">

      {/* Filter Panel */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex flex-col gap-3 max-w-[420px]">

          {/* Row 1: Kelas + Anak */}
          <div className="grid grid-cols-2 gap-3 max-w-[420px]">

  {/* Kelas */}
  <div className="relative">
    <select value={kelas} onChange={(e) => setKelas(e.target.value)} className={selectClass}>
      <option value="">Pilih kelas</option>
      {kelasOptions.map((k) => <option key={k} value={k}>{k}</option>)}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
  </div>

  {/* Anak */}
  <div className="relative">
    <select value={anak} onChange={(e) => setAnak(e.target.value)} className={selectClass}>
      <option value="">Pilih anak</option>
      {anakOptions.map((a) => <option key={a} value={a}>{a}</option>)}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
  </div>

  {/* Semester */}
  <div className="relative">
    <select value={semester} onChange={(e) => setSemester(e.target.value)} className={selectClass}>
      <option value="">Pilih semester</option>
      {semesterOptions.map((s) => <option key={s} value={s}>{s}</option>)}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
  </div>

  {/* Tahun Ajaran */}
  <div className="relative">
    <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className={selectClass}>
      <option value="">Pilih tahun</option>
      {tahunAjaranOptions.map((t) => <option key={t} value={t}>{t}</option>)}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
  </div>

</div>
          {/* Tampilkan Button */}
          <div>
            <button className="bg-gray-200 hover:bg-gray-300 hover:shadow-sm active:scale-95 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-150">
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
              <th className="px-4 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Aspek</th>
              <th className="px-4 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Kegiatan</th>
              <th className="px-4 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Indikator</th>
              <th className="px-4 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-14">MB</th>
              <th className="px-4 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-14">BSH</th>
              <th className="px-4 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-14">BSB</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td className="px-4 py-2.5 text-gray-700 border border-gray-300">{item.aspek}</td>
                <td className="px-4 py-2.5 text-gray-700 border border-gray-300">{item.kegiatan}</td>
                <td className="px-4 py-2.5 text-gray-700 border border-gray-300">{item.indikator}</td>
                {(["MB", "BSH", "BSB"] as const).map((val) => (
                  <td key={val} className="border border-gray-300 text-center">
                    <input
                      type="radio"
                      name={`nilai-${index}`}
                      checked={item.nilai === val}
                      onChange={() => handleChange(index, val)}
                      className="cursor-pointer accent-gray-500"
                    />
                  </td>
                ))}
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 5 - data.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="px-4 py-2.5 border border-gray-300">&nbsp;</td>
                <td className="px-4 py-2.5 border border-gray-300">&nbsp;</td>
                <td className="px-4 py-2.5 border border-gray-300">&nbsp;</td>
                <td className="px-4 py-2.5 border border-gray-300">&nbsp;</td>
                <td className="px-4 py-2.5 border border-gray-300">&nbsp;</td>
                <td className="px-4 py-2.5 border border-gray-300">&nbsp;</td>
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
          Simpan
        </button>
        <button className="bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors">
  Ubah
</button>
      </div>

    </div>
  );
}
