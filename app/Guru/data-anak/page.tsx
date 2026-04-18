"use client";

import { useState } from "react";

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
}

const dataAwal: Anak[] = [];

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
      <div className="flex justify-end mb-3">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-48"
        />
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="px-4 py-2 text-center font-semibold text-gray-700 border border-gray-300 w-16">
                No
              </th>
              <th className="px-4 py-2 text-center font-semibold text-gray-700 border border-gray-300">
                Nama Anak
              </th>
              <th className="px-4 py-2 text-center font-semibold text-gray-700 border border-gray-300">
                Nama Orangtua
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.length > 0 ? (
              filtered.map((anak, index) => (
                <tr key={anak.id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-2 text-center border border-gray-300 text-gray-600">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-gray-700">
                    {anak.namaAnak}
                  </td>
                  <td className="px-4 py-2 border border-gray-300 text-gray-700">
                    {anak.orangTua}
                  </td>
                </tr>
              ))
            ) : null}

            {/* Baris kosong */}
            {Array.from({ length: Math.max(0, 10 - filtered.length) }).map(
              (_, i) => (
                <tr key={i}>
                  <td className="px-4 py-2 border border-gray-300">&nbsp;</td>
                  <td className="px-4 py-2 border border-gray-300">&nbsp;</td>
                  <td className="px-4 py-2 border border-gray-300">&nbsp;</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}