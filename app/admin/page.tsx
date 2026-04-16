"use client";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-200 flex flex-col">

      {/* HEADER */}
      <div className="bg-[#1976D2] text-white flex justify-between items-center px-6 py-3">
        <div className="flex items-center gap-3">
          
          {/* LOGO */}
          <img
            src="/logo.png"
            alt="Logo"
            className="w-12 h-12 object-contain"
          />

          <div className="leading-tight">
            <p className="font-bold text-sm">
              SIMONEV PAUD
            </p>
            <p className="text-[#BBDEFB] text-xs">
              Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini
            </p>
          </div>
        </div>

        <button className="bg-white text-[#1976D2] px-4 py-1 rounded-md text-sm font-semibold">
          Login
        </button>
      </div>

      {/* NAVBAR SIMPLE */}
      <div className="bg-gray-300 flex justify-center gap-16 py-2 text-sm font-medium">
        <span>Beranda</span>
        <span>Tentang Sistem</span>
        <span>Fitur</span>
      </div>

      {/* CONTENT */}
      <div className="flex-1 px-10 py-6">

        {/* BANNER */}
        <div className="w-full h-[280px] bg-gray-300 mb-6 flex items-center justify-center relative">
          <div className="absolute w-full h-full">
            <div className="border-t border-gray-500 absolute top-0 left-0 w-full rotate-[25deg] origin-left"></div>
            <div className="border-t border-gray-500 absolute bottom-0 left-0 w-full -rotate-[25deg] origin-left"></div>
          </div>
        </div>

        {/* DESKRIPSI */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <p className="font-semibold text-sm mb-2">
            Simonev - Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini
          </p>
          <p className="text-xs text-gray-700">
            Platform berbasis web yang membantu guru dan lembaga PAUD dalam memantau serta mengevaluasi perkembangan anak secara lebih terstruktur. Melalui sistem ini, proses pencatatan perkembangan anak menjadi lebih mudah, rapi, dan dapat diakses secara digital
          </p>
        </div>

        {/* BOX */}
        <div className="flex justify-between items-start gap-10 px-10">

          {/* kiri */}
          <div className="bg-[#1976D2] text-white p-5 rounded-xl w-[45%] text-xs leading-relaxed">
            Sistem ini dirancang untuk membantu guru dalam mencatat dan mengelola data perkembangan anak berdasarkan indikator penilaian yang digunakan di sekolah. Selain itu, sistem juga memudahkan pihak sekolah dalam menyimpan data perkembangan anak serta memberikan informasi perkembangan kepada orang tua secara berkala.
          </div>

          {/* kanan */}
          <div className="bg-[#1976D2] text-white p-5 rounded-xl w-[30%] text-xs">
            <p className="mb-3 font-semibold">Fitur yang tersedia :</p>
            <ul className="space-y-2">
              <li>📁 Pengelolaan data anak</li>
              <li>📊 Monitoring Perkembangan</li>
              <li>📄 Laporan Perkembangan</li>
              <li>📢 Pengumuman</li>
            </ul>
          </div>

        </div>
      </div>

      {/* FOOTER */}
      <div className="bg-[#1976D2] text-white px-6 py-4 flex justify-between text-xs">
        
        <div className="flex items-center gap-2">
          <img src="/logo.png" className="w-8 h-8" />
          <div>
            <p className="font-semibold">SIMONEV</p>
            <p>Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini</p>
          </div>
        </div>

        <div className="text-right">
          <p>Beranda</p>
          <p>Tentang Sistem</p>
          <p>Fitur</p>
        </div>

        <div className="text-right max-w-xs">
          <p>Perum. Dotamana Komplek</p>
          <p>Masjid Al-Muhajirin, Kec. Batam Kota, Kota Batam, Prov. Kepulauan Riau</p>
        </div>

      </div>

    </div>
  );
}