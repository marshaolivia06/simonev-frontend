"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, Users } from "lucide-react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

function getToken() { return typeof window !== "undefined" ? localStorage.getItem("token") ?? "" : ""; }
function authHeaders(): HeadersInit {
  return { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` };
}

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
  pekerjaanOrangTua: string;
  email: string;
  alamat: string;
  kelas: string;
  jenisKelamin: string;
  tanggalLahir: string;
}

function fromApi(item: Record<string, unknown>): Anak {
  const ortu = item.orang_tua as Record<string, unknown> | null;
  const kelas = item.kelas as Record<string, unknown> | null;
  const jk = item.jenis_kelamin as string | null;
  return {
    id: item.id_anak as number,
    namaAnak: item.nama_anak as string,
    orangTua: ortu ? (ortu.nama_orangtua as string) ?? "-" : "-",
    pekerjaanOrangTua: ortu ? (ortu.pekerjaan as string) ?? "-" : "-",
    email: ortu
      ? ((ortu.user as Record<string, unknown> | null)?.email as string) ?? "-"
      : "-",
    alamat: ortu ? (ortu.alamat as string) ?? "-" : "-",
    kelas: kelas ? (kelas.nama_kelas as string) ?? "-" : "-",
    jenisKelamin: jk === "L" ? "Laki-laki" : jk === "P" ? "Perempuan" : "-",
    tanggalLahir: (item.tanggal_lahir as string) ?? "-",
  };
}

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
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const ROWS = 10;

export default function DataAnakPage() {
  const [data, setData] = useState<Anak[]>([]);
  const [namaKelas, setNamaKelas] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Ambil profil guru
      const profilRes = await fetch(`${API_BASE}/profil`, { headers: authHeaders() });
const profilJson = await profilRes.json();
if (!profilJson.success) throw new Error("Gagal memuat profil guru");

const namaGuru = profilJson.data.guru?.nama_guru as string; // ← fix di sini
console.log("FULL DATA:", JSON.stringify(profilJson.data)); // ← ini

      const kelasRes = await fetch(`${API_BASE}/kelas`, { headers: authHeaders() });
const kelasJson = await kelasRes.json();
const kelasList = kelasJson.data as Record<string, unknown>[];

// Langsung ambil kelas pertama (sudah difilter by guru di backend)
const kelasSaya = kelasList.find(
  (k) => (k.wali_kelas as string)?.toLowerCase() === namaGuru?.toLowerCase()
) ?? null;

      if (!kelasSaya) {
        setData([]);
        setNamaKelas("");
        return;
      }

      setNamaKelas(kelasSaya.nama_kelas as string);

      // Ambil semua anak, filter by nama kelas
      const anakRes = await fetch(`${API_BASE}/anak`, { headers: authHeaders() });
      const anakJson = await anakRes.json();
      const semua = (anakJson.data as Record<string, unknown>[]).map(fromApi);
      const filtered = semua.filter(
        (a) => a.kelas === (kelasSaya.nama_kelas as string)
      );
      setData(filtered);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filtered = data.filter((a) =>
    a.namaAnak.toLowerCase().includes(search.toLowerCase()) ||
    a.orangTua.toLowerCase().includes(search.toLowerCase())
  );

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
            <p className="text-sm text-gray-500">
  {loading
    ? "Memuat data..."
    : namaKelas
      ? `Anda mengampu Kelas ${namaKelas} · ${filtered.length} anak terdaftar`
      : "Anda belum terdaftar sebagai wali kelas manapun"
  }
</p>
          </div>
        </div>

        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Cari anak / orang tua..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none w-52"
          />
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-600 mb-4">
          ⚠ {error}
        </div>
      )}

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse" style={{ minWidth: "900px" }}>
            <thead>
              <tr className="bg-gray-200 border-b border-gray-300">
                {["No","Nama Anak","Kelas","Jenis Kelamin","Tanggal Lahir","Nama Orangtua","Pekerjaan Orangtua","Email Orangtua","Alamat"].map((h, i, arr) => (
                  <th key={h}
                    className={`px-3 py-3 text-xs font-bold text-black whitespace-nowrap border-b border-gray-300 ${i < arr.length - 1 ? "border-r border-gray-300" : ""} ${["No","Kelas","Jenis Kelamin","Tanggal Lahir"].includes(h) ? "text-center" : "text-left"}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: ROWS }).map((_, i) => (
                  <tr key={`loading-${i}`}>
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-3 py-3">
                        <div className="h-4 bg-gray-100 rounded animate-pulse" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-12 text-gray-400 text-sm">
                    {namaKelas
                      ? "Belum ada anak di kelas ini"
                      : "Kamu belum terdaftar sebagai wali kelas manapun"}
                  </td>
                </tr>
              ) : (
                <>
                  {filtered.map((anak, index) => (
                    <tr key={anak.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-100">{index + 1}</td>
                      <td className="px-3 py-3 border-r border-gray-100">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                            {getInitials(anak.namaAnak)}
                          </div>
                          <span className="font-medium text-gray-800 whitespace-nowrap">{anak.namaAnak}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700 text-xs border-r border-gray-100">{anak.kelas}</td>
                      <td className="px-3 py-3 text-center border-r border-gray-100">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                          anak.jenisKelamin === "Perempuan"
                            ? "bg-pink-100 text-pink-600"
                            : anak.jenisKelamin === "Laki-laki"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-100 text-gray-400"
                        }`}>
                          {anak.jenisKelamin}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-center text-gray-700 text-xs whitespace-nowrap border-r border-gray-100">{anak.tanggalLahir}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs whitespace-nowrap border-r border-gray-100">{anak.orangTua}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs whitespace-nowrap border-r border-gray-100">{anak.pekerjaanOrangTua}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs border-r border-gray-100">{anak.email}</td>
                      <td className="px-3 py-3 text-gray-700 text-xs">{anak.alamat}</td>
                    </tr>
                  ))}

                  {Array.from({ length: Math.max(0, ROWS - filtered.length) }).map((_, i) => (
                    <tr key={`empty-${i}`}>
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-3 py-3 border-r border-gray-100 last:border-r-0">&nbsp;</td>
                      ))}
                    </tr>
                  ))}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}