"use client";

import { useEffect, useState } from "react";
import { Calendar, Megaphone } from "lucide-react";

const API = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000/api";

interface Pengumuman {
  id_pengumuman: number;
  judul_pengumuman: string;
  tanggal: string;
  isi_pengumuman: string;
  kategori: string;
  created_at: string;
}

const badgeColor: Record<string, string> = {
  Kegiatan: "bg-blue-100 text-blue-700",
  Libur:    "bg-green-100 text-green-700",
  Penting:  "bg-yellow-100 text-yellow-700",
  Info:     "bg-purple-100 text-purple-700",
};

function formatPosting(createdAt: string): string {
  if (!createdAt) return "";
  const bulan = ["Januari","Februari","Maret","April","Mei","Juni","Juli","Agustus","September","Oktober","November","Desember"];
  const d = new Date(createdAt);
  return `Diposting: ${d.getDate()} ${bulan[d.getMonth()]} ${d.getFullYear()}`;
}

export default function PengumumanPage() {
  const [data, setData]       = useState<Pengumuman[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

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

  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengumuman Sekolah</h1>
        <p className="text-sm text-gray-500">
          Informasi terbaru terkait kegiatan dan agenda sekolah
        </p>
      </div>

      {/* STATE */}
      {loading && (
        <p className="text-center text-sm text-gray-400 py-16 animate-pulse">Memuat pengumuman...</p>
      )}
      {!loading && error && (
        <p className="text-center text-sm text-red-400 py-16">{error}</p>
      )}
      {!loading && !error && data.length === 0 && (
        <div className="flex flex-col items-center py-24 text-gray-300">
          <Megaphone size={44} className="mb-3" />
          <p className="text-sm">Belum ada pengumuman</p>
        </div>
      )}

      {/* LIST */}
      {!loading && !error && data.length > 0 && (
        <div className="grid gap-5">
          {data.map((item) => (
            <div
              key={item.id_pengumuman}
              className="
                group relative overflow-hidden
                bg-gradient-to-br from-white via-blue-50 to-blue-100
                border border-blue-100
                rounded-2xl p-6
                shadow-sm
                transition-all duration-300
                hover:shadow-xl hover:-translate-y-1 hover:scale-[1.01]
              "
            >
              <div className="
                absolute inset-0 opacity-0 group-hover:opacity-100
                bg-gradient-to-r from-blue-200/20 via-blue-300/10 to-blue-200/20
                transition duration-500
              "></div>

              <div className="relative z-10">
                <div className="flex justify-between items-start gap-4 mb-3">
                  <div className="flex gap-3">
                    <div className="
                      w-11 h-11 flex items-center justify-center
                      rounded-xl bg-blue-100
                      group-hover:bg-blue-600 transition
                    ">
                      <Megaphone size={18} className="text-blue-600 group-hover:text-white transition" />
                    </div>

                    <div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${badgeColor[item.kategori] ?? "bg-gray-100 text-gray-700"}`}>
                        {item.kategori}
                      </span>
                      <h3 className="
                        text-base font-semibold text-gray-800 mt-1
                        group-hover:text-blue-700 transition
                      ">
                        {item.judul_pengumuman}
                      </h3>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <Calendar size={12} />
                        {item.tanggal}
                      </div>
                    </div>
                  </div>

                  <span className="
                    text-[11px] text-blue-600
                    bg-blue-50 px-2 py-1 rounded-full
                    border border-blue-100
                    group-hover:bg-blue-600 group-hover:text-white
                    transition shrink-0
                  ">
                    {formatPosting(item.created_at)}
                  </span>
                </div>

                <p className="text-sm text-gray-700 leading-relaxed group-hover:text-gray-800 transition">
                  {item.isi_pengumuman}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}