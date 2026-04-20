"use client";

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
    badgeColor: "bg-green-100 text-green-800",
  },
  {
    id: 2,
    judul: "Kegiatan Outing Class",
    tanggal: "5 April 2026",
    posting: "Diposting: 28 Maret 2026",
    isi: "Siswa akan mengikuti kegiatan outing class ke taman edukasi sebagai sarana pembelajaran di luar kelas.",
    badge: "Kegiatan",
    badgeColor: "bg-blue-100 text-blue-800",
  },
  {
    id: 3,
    judul: "Pembagian Raport",
    tanggal: "20 Juni 2026",
    posting: "Diposting: 10 Juni 2026",
    isi: "Pembagian raport semester genap akan dilaksanakan di sekolah bersama wali murid.",
    badge: "Penting",
    badgeColor: "bg-yellow-100 text-yellow-800",
  },
  {
    id: 4,
    judul: "Pendaftaran Siswa Baru",
    tanggal: "1 - 15 Juli 2026",
    posting: "Diposting: 20 Juni 2026",
    isi: "Pendaftaran siswa baru tahun ajaran 2026/2027 telah dibuka secara online.",
    badge: "Info",
    badgeColor: "bg-purple-100 text-purple-800",
  },
];

export default function PengumumanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-4">

      {dummyPengumuman.map((item) => (
        <div
          key={item.id}
          className="bg-gradient-to-r from-blue-50 to-white 
                     border border-blue-100 
                     rounded-xl p-5 
                     transition-all duration-200 
                     hover:shadow-md hover:-translate-y-1"
        >

          {/* Header */}
          <div className="flex justify-between items-start mb-2">

            <div>
              <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full mb-1 ${item.badgeColor}`}>
                {item.badge}
              </span>

              <h3 className="text-sm font-bold text-gray-800">
                {item.judul}
              </h3>

              <p className="text-xs text-gray-500">
                {item.tanggal}
              </p>
            </div>

            <span className="text-[11px] text-gray-500 bg-white/70 px-2 py-1 rounded-full border border-gray-100">
              {item.posting}
            </span>

          </div>

          {/* Isi */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {item.isi}
          </p>

        </div>
      ))}

    </div>
  );
}