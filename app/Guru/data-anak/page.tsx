"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
}

const dataAwal: Anak[] = [
  {
    id: 1,
    namaAnak: "Aisyah",
    orangTua: "Sari Sri Hastuti",
  },
  {
    id: 2,
    namaAnak: "Bima",
    orangTua: "Andi Saputra",
  },
  {
    id: 3,
    namaAnak: "Citra",
    orangTua: "Lina Wijaya",
  },
];

export default function DataAnakPage() {
  const [search, setSearch] = useState("");
  const [data] = useState<Anak[]>(dataAwal);

  const filtered = data.filter(
    (a) =>
      a.namaAnak.toLowerCase().includes(search.toLowerCase()) ||
      a.orangTua.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto">

      {/* Search */}
<div className="flex justify-end mb-4">
  <div className="relative">
    <Search
      size={14}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />
    <input
      type="text"
      placeholder="Cari anak..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none w-48"
    />
  </div>
</div>

      {/* Tabel */}
<div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
  <table className="w-full text-sm table-fixed border-collapse">
    <thead>
      <tr className="bg-gray-200 border-b border-gray-200">
        <th className="px-4 py-3 text-center text-sm font-bold text-black w-[48px]">
          No
        </th>
        <th className="px-4 py-3 text-center text-sm font-bold text-black">
          Nama Anak
        </th>
        <th className="px-4 py-3 text-center text-sm font-bold text-black">
          Nama Orangtua
        </th>
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-100">
      {filtered.length > 0 ? (
        filtered.map((anak, index) => (
          <tr key={anak.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 text-center text-gray-700">
              {index + 1}
            </td>
            <td className="px-4 py-3 text-center font-medium text-gray-800">
              {anak.namaAnak}
            </td>
            <td className="px-4 py-3 text-center text-gray-700">
              {anak.orangTua}
            </td>
          </tr>
        ))
      ) : null}

      {/* Baris kosong */}
      {Array.from({ length: Math.max(0, 10 - filtered.length) }).map(
        (_, i) => (
          <tr key={i}>
            <td className="px-4 py-3 border-t border-gray-100">&nbsp;</td>
            <td className="px-4 py-3 border-t border-gray-100">&nbsp;</td>
            <td className="px-4 py-3 border-t border-gray-100">&nbsp;</td>
          </tr>
        )
      )}
    </tbody>
  </table>
</div>
    </div>
  );
}