"use client";

import { useState } from "react";
import { FileText } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

interface RiwayatItem {
  id: number;
  tanggal: string;
  aspek: string;
  kegiatan: string;
  indikator: string;
  nilai: string;
  dokumentasi?: string;
}

const dummyRiwayat: RiwayatItem[] = [];

const aspekList = ["FM", "KOG", "BHS", "SOS-EM", "NAM"];
const aspekColors = ["#4DB6AC", "#F48FB1", "#FFF176", "#CE93D8", "#FFCC80"];
const defaultNilai = [3, 2, 4, 3, 2];

const dummyAspekNilai = [
  { aspek: "Perkembangan Motorik", nilai: "" },
  { aspek: "Perkembangan Kognitif", nilai: "" },
  { aspek: "Perkembangan Bahasa", nilai: "" },
  { aspek: "Perkembangan Sosial-Emosional", nilai: "" },
  { aspek: "Nilai Agama dan Moral", nilai: "" },
];

const semesterOptions = ["Semester 1", "Semester 2"];
const tahunAjaranOptions = ["2023/2024", "2024/2025", "2025/2026"];
const kelasOptions = ["Kelas A", "Kelas B"];
const namaAnakOptions = ["Pilih Anak"];

export default function LaporanPerkembanganPage() {
  const [namaAnak, setNamaAnak] = useState("");
  const [semester, setSemester] = useState("");
  const [kelas, setKelas] = useState("");
  const [tahunAjaran, setTahunAjaran] = useState("");
  const [komentar] = useState("");
  const [riwayat] = useState<RiwayatItem[]>(dummyRiwayat);
  const [aspekNilai] = useState(dummyAspekNilai);

  const chartData = aspekList.map((label, i) => ({
    name: label,
    nilai: defaultNilai[i],
    color: aspekColors[i],
  }));

  const selectClass =
    "w-full border border-gray-300 rounded-full px-4 py-1.5 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300 appearance-none pr-8 cursor-pointer";

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Top section: filters + chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 relative">
        {/* PDF Button */}
        <button className="absolute top-4 right-4 flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors">
          <FileText size={15} />
          PDF
        </button>

        <div className="flex gap-8">
         {/* Filters */}
<div className="flex flex-col gap-3 min-w-[220px]">
  {/* Kelas */}
  <div className="relative">
    <select value={kelas} onChange={(e) => setKelas(e.target.value)} className={selectClass}>
      <option value="">Kelas</option>
      {kelasOptions.map((k) => (
        <option key={k} value={k}>{k}</option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
  </div>

  {/* Nama Anak */}
  <div className="relative">
    <select value={namaAnak} onChange={(e) => setNamaAnak(e.target.value)} className={selectClass}>
      <option value="">Nama Anak</option>
      {namaAnakOptions.map((n) => (
        <option key={n} value={n}>{n}</option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
  </div>

  <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full transition-colors text-left w-fit">
    Tampilkan
  </button>
</div>

{/* Semester & Tahun Ajaran */}
<div className="flex flex-col gap-3 min-w-[180px]">
  {/* Semester */}
  <div className="relative">
    <select value={semester} onChange={(e) => setSemester(e.target.value)} className={selectClass}>
      <option value="">Semester</option>
      {semesterOptions.map((s) => (
        <option key={s} value={s}>{s}</option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
  </div>

  {/* Tahun Ajaran */}
  <div className="relative">
    <select value={tahunAjaran} onChange={(e) => setTahunAjaran(e.target.value)} className={selectClass}>
      <option value="">Tahun Ajaran</option>
      {tahunAjaranOptions.map((t) => (
        <option key={t} value={t}>{t}</option>
      ))}
    </select>
    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs">▼</span>
  </div>
</div>
          {/* Chart */}
          <div className="flex-1 h-44 mt-8 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} barSize={36} barCategoryGap="20%" margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 5]} />
                <Tooltip
                  cursor={{ fill: "rgba(0,0,0,0.04)" }}
                  contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "12px" }}
                />
                <Bar dataKey="nilai" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Aspek Perkembangan Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-5 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-1/2">Aspek Perkembangan</th>
              <th className="px-5 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-1/2">Nilai</th>
            </tr>
          </thead>
          <tbody>
            {aspekNilai.map((item, i) => (
              <tr key={i}>
                <td className="px-5 py-2.5 border border-gray-300 text-gray-700">{item.aspek}</td>
                <td className="px-5 py-2.5 border border-gray-300 text-gray-700">{item.nilai}</td>
              </tr>
            ))}
            {Array.from({ length: Math.max(0, 5 - aspekNilai.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="px-5 py-2.5 border border-gray-300">&nbsp;</td>
                <td className="px-5 py-2.5 border border-gray-300">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Komentar Guru */}
      <div className="bg-gray-100 rounded-xl border border-gray-200 p-4 min-h-[80px]">
        <p className="text-sm text-gray-400 italic">
          {komentar || "Komentar Guru ..."}
        </p>
      </div>

      {/* Riwayat Perkembangan */}
      <div>
        <h2 className="text-sm font-semibold text-gray-800 mb-2">Riwayat Perkembangan</h2>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300 w-10">No</th>
                <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Tanggal</th>
                <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Aspek</th>
                <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Kegiatan</th>
                <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Indikator</th>
                <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Nilai</th>
                <th className="px-3 py-2.5 text-center font-bold text-gray-800 border border-gray-300">Dokumentasi</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.map((item, index) => (
                <tr key={item.id}>
                  <td className="px-3 py-2.5 text-center text-gray-700 border border-gray-300">{index + 1}</td>
                  <td className="px-3 py-2.5 text-gray-700 border border-gray-300">{item.tanggal}</td>
                  <td className="px-3 py-2.5 text-gray-700 border border-gray-300">{item.aspek}</td>
                  <td className="px-3 py-2.5 text-gray-700 border border-gray-300">{item.kegiatan}</td>
                  <td className="px-3 py-2.5 text-gray-700 border border-gray-300">{item.indikator}</td>
                  <td className="px-3 py-2.5 text-center text-gray-700 border border-gray-300">{item.nilai}</td>
                  <td className="px-3 py-2.5 text-center border border-gray-300">
                    {item.dokumentasi && (
                      <span className="bg-gray-100 border border-gray-300 text-gray-600 text-xs px-3 py-1 rounded-full">foto</span>
                    )}
                  </td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 5 - riwayat.length) }).map((_, i) => (
                <tr key={`empty-${i}`}>
                  <td className="px-3 py-2.5 border border-gray-300">&nbsp;</td>
                  <td className="px-3 py-2.5 border border-gray-300">&nbsp;</td>
                  <td className="px-3 py-2.5 border border-gray-300">&nbsp;</td>
                  <td className="px-3 py-2.5 border border-gray-300">&nbsp;</td>
                  <td className="px-3 py-2.5 border border-gray-300">&nbsp;</td>
                  <td className="px-3 py-2.5 border border-gray-300">&nbsp;</td>
                  <td className="px-3 py-2.5 border border-gray-300">&nbsp;</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}