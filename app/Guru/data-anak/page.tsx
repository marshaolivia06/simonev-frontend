"use client";

import { useState } from "react";
import { Search, Users } from "lucide-react";

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
  email: string;
  alamat: string;
  kelas: string;
  jenisKelamin: string;
  tanggalLahir: string;
}

const dataAwal: Anak[] = [
  { id: 1, namaAnak: "Aisyah Azizah", orangTua: "Sari Sri Hastuti", email: "sari@email.com", alamat: "Jl. Melati No. 1", kelas: "A", jenisKelamin: "Perempuan", tanggalLahir: "2019-03-12" },
  { id: 2, namaAnak: "Bima Sakti", orangTua: "Andi Saputra", email: "andi@email.com", alamat: "Jl. Mawar No. 5", kelas: "B", jenisKelamin: "Laki-laki", tanggalLahir: "2018-07-24" },
  { id: 3, namaAnak: "Citra Lestari", orangTua: "Lina Wijaya", email: "lina@email.com", alamat: "Jl. Kenanga No. 3", kelas: "A", jenisKelamin: "Perempuan", tanggalLahir: "2019-01-05" },
  { id: 4, namaAnak: "Dafa Ramadhan", orangTua: "Budi Santoso", email: "budi@email.com", alamat: "Jl. Anggrek No. 7", kelas: "C", jenisKelamin: "Laki-laki", tanggalLahir: "2017-11-30" },
  { id: 5, namaAnak: "Elsa Nabila", orangTua: "Dewi Rahayu", email: "dewi@email.com", alamat: "Jl. Dahlia No. 2", kelas: "B", jenisKelamin: "Perempuan", tanggalLahir: "2018-05-17" },
  { id: 6, namaAnak: "Farhan Maulana", orangTua: "Hendra Kusuma", email: "hendra@email.com", alamat: "Jl. Flamboyan No. 9", kelas: "A", jenisKelamin: "Laki-laki", tanggalLahir: "2019-08-09" },
  { id: 7, namaAnak: "Ghina Aulia", orangTua: "Rina Marlina", email: "rina@email.com", alamat: "Jl. Tulip No. 4", kelas: "C", jenisKelamin: "Perempuan", tanggalLahir: "2017-04-22" },
  { id: 8, namaAnak: "Hafiz Pratama", orangTua: "Yusuf Hakim", email: "yusuf@email.com", alamat: "Jl. Bougenville No. 6", kelas: "B", jenisKelamin: "Laki-laki", tanggalLahir: "2018-12-01" },
  { id: 9, namaAnak: "Indira Putri", orangTua: "Nita Sari", email: "nita@email.com", alamat: "Jl. Cempaka No. 8", kelas: "A", jenisKelamin: "Perempuan", tanggalLahir: "2019-06-14" },
  { id: 10, namaAnak: "Jaka Tarub", orangTua: "Agus Priyono", email: "agus@email.com", alamat: "Jl. Seroja No. 10", kelas: "C", jenisKelamin: "Laki-laki", tanggalLahir: "2017-09-03" },
];

const ROWS = 10;

const avatarColors = [
  "bg-blue-100 text-blue-600",
  "bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600",
  "bg-pink-100 text-pink-600",
  "bg-orange-100 text-orange-600",
  "bg-teal-100 text-teal-600",
  "bg-yellow-100 text-yellow-600",
  "bg-red-100 text-red-600",
];

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

function formatTanggal(tgl: string) {
  const [y, m, d] = tgl.split("-");
  const bulan = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"];
  return `${d} ${bulan[parseInt(m) - 1]} ${y}`;
}

export default function DataAnakPage() {
  const [search, setSearch] = useState("");
  const [kelasFilter, setKelasFilter] = useState("Semua");
  const [data] = useState<Anak[]>(dataAwal);

  const filtered = data.filter((a) => {
    const matchSearch =
      a.namaAnak.toLowerCase().includes(search.toLowerCase()) ||
      a.orangTua.toLowerCase().includes(search.toLowerCase());
    const matchKelas = kelasFilter === "Semua" || a.kelas === kelasFilter;
    return matchSearch && matchKelas;
  });

  return (
    <div className="max-w-6xl mx-auto">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mt-0.5">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800 leading-tight">Data Anak</p>
            <p className="text-sm text-gray-500">{data.length} anak terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={kelasFilter}
            onChange={(e) => setKelasFilter(e.target.value)}
            className="bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none text-gray-700"
          >
            <option value="Semua">Semua Kelas</option>
            <option value="A">Kelas A</option>
            <option value="B">Kelas B</option>
            <option value="C">Kelas C</option>
          </select>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Cari anak..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none w-48"
            />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm table-fixed border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-200">
              <th className="px-4 py-3 text-center font-bold text-black w-[48px]">No</th>
              <th className="px-4 py-3 text-left font-bold text-black">Nama Anak</th>
              <th className="px-4 py-3 text-center font-bold text-black">Jenis Kelamin</th>
              <th className="px-4 py-3 text-center font-bold text-black">Tanggal Lahir</th>
              <th className="px-4 py-3 text-center font-bold text-black">Nama Orangtua</th>
              <th className="px-4 py-3 text-center font-bold text-black">Email Orangtua</th>
              <th className="px-4 py-3 text-center font-bold text-black">Alamat</th>
              <th className="px-4 py-3 text-center font-bold text-black w-[80px]">Kelas</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((anak, index) => (
              <tr key={anak.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 text-center text-gray-700">{index + 1}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                      {getInitials(anak.namaAnak)}
                    </div>
                    <span className="font-medium text-gray-800">{anak.namaAnak}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${anak.jenisKelamin === "Perempuan" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                    {anak.jenisKelamin}
                  </span>
                </td>
                <td className="px-4 py-3 text-center text-gray-700">{formatTanggal(anak.tanggalLahir)}</td>
                <td className="px-4 py-3 text-center text-gray-700">{anak.orangTua}</td>
                <td className="px-4 py-3 text-center text-gray-700">{anak.email}</td>
                <td className="px-4 py-3 text-center text-gray-700">{anak.alamat}</td>
                <td className="px-4 py-3 text-center text-gray-700">{anak.kelas}</td>
              </tr>
            ))}

            {Array.from({ length: Math.max(0, ROWS - filtered.length) }).map((_, i) => (
              <tr key={`empty-${i}`}>
                <td className="px-4 py-3">&nbsp;</td>
                <td className="px-4 py-3">&nbsp;</td>
                <td className="px-4 py-3">&nbsp;</td>
                <td className="px-4 py-3">&nbsp;</td>
                <td className="px-4 py-3">&nbsp;</td>
                <td className="px-4 py-3">&nbsp;</td>
                <td className="px-4 py-3">&nbsp;</td>
                <td className="px-4 py-3">&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}