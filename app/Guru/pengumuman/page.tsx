"use client";

interface Pengumuman {
  id: number;
  judul: string;
  tanggal: string;
  isi: string;
}

const dummyPengumuman: Pengumuman[] = [
  {
    id: 1,
    judul: "Libur Hari Raya",
    tanggal: "16 - 30 Maret 2026",
    isi: "Sekolah akan diliburkan selama dua minggu menjelang Hari Raya Idul Fitri.",
  },
  {
    id: 2,
    judul: "Kegiatan Outing Class",
    tanggal: "5 April 2026",
    isi: "Siswa akan mengikuti kegiatan outing class ke taman edukasi sebagai sarana pembelajaran di luar kelas.",
  },
  {
    id: 3,
    judul: "Pembagian Raport",
    tanggal: "20 Juni 2026",
    isi: "Pembagian raport semester genap akan dilaksanakan di sekolah bersama wali murid.",
  },
  {
    id: 4,
    judul: "Pendaftaran Siswa Baru",
    tanggal: "1 - 15 Juli 2026",
    isi: "Pendaftaran siswa baru tahun ajaran 2026/2027 telah dibuka secara online.",
  },
];

export default function PengumumanPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-5">

      {/* Card List */}
      <div className="space-y-4">
        {dummyPengumuman.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl p-5 border border-gray-200 
                       transition-all duration-200 
                       hover:shadow-md hover:-translate-y-1"
          >
            {/* Judul + Tanggal */}
            <div className="mb-2">
              <h3 className="text-sm font-semibold text-gray-800">
                {item.judul}
              </h3>
              <p className="text-xs text-gray-500">
                {item.tanggal}
              </p>
            </div>

            {/* Isi */}
            <p className="text-sm text-gray-600 leading-relaxed">
              {item.isi}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}