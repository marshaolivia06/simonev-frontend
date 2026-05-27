"use client";

import { useEffect, useState } from "react";
import { Calendar, Megaphone } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

type Kategori = "Kegiatan" | "Libur" | "Penting" | "Info";

interface Pengumuman {
  id_pengumuman: number;
  judul_pengumuman: string;
  tanggal: string;
  isi_pengumuman: string;
  kategori: Kategori;
  created_at: string;
}

function formatPosting(createdAt: string): string {
  if (!createdAt) return "";
  const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const d = new Date(createdAt);
  return `Diposting: ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

const badgeStyle: Record<Kategori, string> = {
  Kegiatan: "bg-blue-100 text-blue-700",
  Libur:    "bg-green-100 text-green-700",
  Penting:  "bg-yellow-100 text-yellow-700",
  Info:     "bg-purple-100 text-purple-700",
};

const cardStyle: Record<Kategori, string> = {
  Kegiatan: "from-white via-blue-50 to-blue-100 border-blue-100",
  Libur:    "from-white via-green-50 to-green-100 border-green-100",
  Penting:  "from-white via-yellow-50 to-yellow-100 border-yellow-100",
  Info:     "from-white via-purple-50 to-purple-100 border-purple-100",
};

const iconStyle: Record<Kategori, string> = {
  Kegiatan: "bg-blue-100 group-hover:bg-blue-600",
  Libur:    "bg-green-100 group-hover:bg-green-600",
  Penting:  "bg-yellow-100 group-hover:bg-yellow-500",
  Info:     "bg-purple-100 group-hover:bg-purple-600",
};

const titleHover: Record<Kategori, string> = {
  Kegiatan: "group-hover:text-blue-700",
  Libur:    "group-hover:text-green-700",
  Penting:  "group-hover:text-yellow-600",
  Info:     "group-hover:text-purple-700",
};

const postingBadge: Record<Kategori, string> = {
  Kegiatan: "text-blue-600 bg-blue-50 border-blue-100 group-hover:bg-blue-600 group-hover:text-white",
  Libur:    "text-green-600 bg-green-50 border-green-100 group-hover:bg-green-600 group-hover:text-white",
  Penting:  "text-yellow-600 bg-yellow-50 border-yellow-100 group-hover:bg-yellow-500 group-hover:text-white",
  Info:     "text-purple-600 bg-purple-50 border-purple-100 group-hover:bg-purple-600 group-hover:text-white",
};

const KATEGORI_LIST: Kategori[] = ["Kegiatan", "Libur", "Penting", "Info"];

const filterStyle: Record<Kategori, { active: string; inactive: string }> = {
  Kegiatan: { active: "bg-blue-600 text-white border-blue-600",     inactive: "bg-white text-blue-600 border-blue-200 hover:border-blue-400"     },
  Libur:    { active: "bg-green-600 text-white border-green-600",   inactive: "bg-white text-green-600 border-green-200 hover:border-green-400"   },
  Penting:  { active: "bg-yellow-500 text-white border-yellow-500", inactive: "bg-white text-yellow-600 border-yellow-200 hover:border-yellow-400" },
  Info:     { active: "bg-purple-600 text-white border-purple-600", inactive: "bg-white text-purple-600 border-purple-200 hover:border-purple-400" },
};

export default function PengumumanPage() {
  const [data, setData]       = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [filterKat, setFilterKat] = useState<"Semua" | Kategori>("Semua");

  useEffect(() => {
    fetch(`${API}/pengumuman`)
      .then(r => r.json())
      .then(json => {
        if (json.success) setData(json.data);
        else setError("Gagal memuat pengumuman.");
      })
      .catch(() => setError("Gagal terhubung ke server."))
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.filter((p) => filterKat === "Semua" || p.kategori === filterKat);

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengumuman Sekolah</h1>
        <p className="text-sm text-gray-500">
          Informasi terbaru terkait kegiatan dan agenda sekolah
        </p>
      </div>

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap">
        <button onClick={() => setFilterKat("Semua")}
          className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
            filterKat === "Semua" ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
          }`}>
          Semua
        </button>
        {KATEGORI_LIST.map((k) => {
          const s = filterStyle[k];
          return (
            <button key={k} onClick={() => setFilterKat(k)}
              className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${
                filterKat === k ? s.active : s.inactive
              }`}>
              {k}
            </button>
          );
        })}
      </div>

      {/* STATE */}
      {loading && (
        <p className="text-center text-sm text-gray-400 py-16 animate-pulse">Memuat pengumuman...</p>
      )}
      {!loading && error && (
        <p className="text-center text-sm text-red-400 py-16">{error}</p>
      )}
      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center py-24 text-gray-300">
          <Megaphone size={44} className="mb-3" />
          <p className="text-sm">Belum ada pengumuman</p>
        </div>
      )}

      {/* LIST */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid gap-5">
          {filtered.map((item) => {
            const kat = (item.kategori as Kategori) ?? "Info";
            return (
              <div
                key={item.id_pengumuman}
                className={`group relative overflow-hidden bg-gradient-to-br ${cardStyle[kat]} border rounded-2xl p-6 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]`}
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-white/10 via-white/5 to-white/10 transition duration-500" />

                <div className="relative z-10">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex gap-3">
                      <div className={`w-11 h-11 flex items-center justify-center rounded-xl transition ${iconStyle[kat]}`}>
                        <Megaphone size={18} className="text-current group-hover:text-white transition" />
                      </div>
                      <div>
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeStyle[kat]}`}>
                          {item.kategori}
                        </span>
                        <h3 className={`text-base font-semibold text-gray-800 mt-1 transition ${titleHover[kat]}`}>
                          {item.judul_pengumuman}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar size={12} />
                          {item.tanggal}
                        </div>
                      </div>
                    </div>

                    <span className={`text-[11px] px-2 py-1 rounded-full border transition shrink-0 ${postingBadge[kat]}`}>
                      {formatPosting(item.created_at)}
                    </span>
                  </div>

                  <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-800 transition">
                    {item.isi_pengumuman}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}