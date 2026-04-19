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
    isi: "Sekolah akan diliburkan selama 2 minggu menjelang hari raya idul fitri. Minal Aidzin Walfaidzin Mohon Maaf lahir dan Bathin.",
  },
];

export default function PengumumanPage() {
  return (
    <div className="max-w-4xl mx-auto">

      <h2 className="text-base font-semibold text-gray-800 mb-3">
        Terbaru
      </h2>

      <div className="space-y-4">
        {dummyPengumuman.map((item) => (
          <div
            key={item.id}
            className="bg-gray-100 rounded-xl p-4 border border-gray-200"
          >
            <p className="text-sm font-semibold text-gray-800">
              Judul : {item.judul}
            </p>

            <p className="text-xs text-gray-600 mb-3">
              Tanggal : {item.tanggal}
            </p>

            <p className="text-sm text-gray-700 leading-relaxed">
              Isi Pengumuman :
              <br />
              {item.isi}
            </p>
          </div>
        ))}

        {/* Placeholder */}
        <div className="bg-gray-100 rounded-xl h-32 border border-gray-200" />
      </div>
    </div>
  );
}