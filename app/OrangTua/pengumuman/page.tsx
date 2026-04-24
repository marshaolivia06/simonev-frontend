"use client";

import { Calendar, Megaphone } from "lucide-react";

interface Pengumuman {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
  badge: string;
  badgeColor: string;
  posting: string;
}

const dummyPengumuman: Pengumuman[] = [
  {
    id: 1,
    judul: "Libur Hari Raya",
    tanggal: "16 - 30 Maret 2026",
    posting: "Diposting: 10 Maret 2026",
    isi: "Sekolah akan diliburkan selama dua minggu menjelang Hari Raya Idul Fitri.",
    badge: "Libur",
    badgeColor: "bg-green-100 text-green-700",
  },
  {
    id: 2,
    judul: "Kegiatan Outing Class",
    tanggal: "5 April 2026",
    posting: "Diposting: 28 Maret 2026",
    isi: "Siswa akan mengikuti kegiatan outing class ke taman edukasi sebagai sarana pembelajaran di luar kelas.",
    badge: "Kegiatan",
    badgeColor: "bg-blue-100 text-blue-700",
  },
  {
    id: 3,
    judul: "Pembagian Raport",
    tanggal: "20 Juni 2026",
    posting: "Diposting: 10 Juni 2026",
    isi: "Pembagian raport semester genap akan dilaksanakan di sekolah bersama wali murid.",
    badge: "Penting",
    badgeColor: "bg-yellow-100 text-yellow-700",
  },
  {
    id: 4,
    judul: "Pendaftaran Siswa Baru",
    tanggal: "1 - 15 Juli 2026",
    posting: "Diposting: 20 Juni 2026",
    isi: "Pendaftaran siswa baru tahun ajaran 2026/2027 telah dibuka secara online.",
    badge: "Info",
    badgeColor: "bg-purple-100 text-purple-700",
  },
];

export default function PengumumanPage() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Pengumuman Sekolah</h1>
        <p className="text-sm text-gray-500">
          Informasi terbaru terkait kegiatan dan agenda sekolah
        </p>
      </div>

      {/* LIST */}
      <div className="grid gap-5">

        {dummyPengumuman.map((item) => (
          <div
            key={item.id}
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

            {/* Glow effect */}
            <div className="
              absolute inset-0 opacity-0 group-hover:opacity-100
              bg-gradient-to-r from-blue-200/20 via-blue-300/10 to-blue-200/20
              transition duration-500
            "></div>

            {/* Content */}
            <div className="relative z-10">

              {/* Header */}
              <div className="flex justify-between items-start gap-4 mb-3">

                <div className="flex gap-3">

                  {/* Icon */}
                  <div className="
                    w-11 h-11 flex items-center justify-center
                    rounded-xl bg-blue-100
                    group-hover:bg-blue-600 transition
                  ">
                    <Megaphone
                      size={18}
                      className="text-blue-600 group-hover:text-white transition"
                    />
                  </div>

                  <div>
                    {/* Badge */}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${item.badgeColor}`}>
                      {item.badge}
                    </span>

                    {/* Judul */}
                    <h3 className="
                      text-base font-semibold text-gray-800 mt-1
                      group-hover:text-blue-700 transition
                    ">
                      {item.judul}
                    </h3>

                    {/* Tanggal */}
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                      <Calendar size={12} />
                      {item.tanggal}
                    </div>
                  </div>
                </div>

                {/* Posting */}
                <span className="
                  text-[11px] text-blue-600
                  bg-blue-50 px-2 py-1 rounded-full
                  border border-blue-100
                  group-hover:bg-blue-600 group-hover:text-white
                  transition
                ">
                  {item.posting}
                </span>

              </div>

              {/* Isi */}
              <p className="
                text-sm text-gray-700 leading-relaxed
                group-hover:text-gray-800 transition
              ">
                {item.isi}
              </p>

            </div>

          </div>
        ))}

      </div>
    </div>
  );
}