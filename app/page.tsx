"use client";

import Link from "next/link";
import Image from "next/image";

const features = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Laporan Perkembangan",
    desc: "Rekapitulasi lengkap perkembangan anak berdasarkan indikator penilaian yang terstruktur, jelas, dan mudah dipahami dari waktu ke waktu.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
    title: "Grafik Monitoring",
    desc: "Visualisasi perkembangan anak berdasarkan data penilaian guru agar progres setiap anak dapat dipantau secara lebih jelas dan mudah dianalisis.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    ),
    title: "Pengumuman",
    desc: "Informasi penting dari sekolah kepada guru dan orang tua — jadwal kegiatan, akademik, dan pemberitahuan lainnya secara cepat dan terpusat.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    ),
    title: "Penilaian",
    desc: "Catat dan evaluasi perkembangan anak berdasarkan indikator PAUD yang ditentukan agar hasil penilaian lebih objektif dan mudah dipantau orang tua.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    title: "Manajemen Profil",
    desc: "Kelola informasi pengguna — admin, guru, dan orang tua — termasuk data pribadi, akun, serta pengaturan akses secara mandiri dan terstruktur.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-7 h-7">
        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Data Anak",
    desc: "Kelola seluruh informasi peserta didik PAUD mulai dari identitas, data orang tua, hingga catatan perkembangan harian secara terpusat dan rapi.",
  },
];

const stats = [
  { value: "120+", label: "Data Anak" },
  { value: "30+", label: "Guru Terdaftar" },
  { value: "6", label: "Fitur Utama" },
];

const previews = [
  { src: "/dashboard.png", label: "Dashboard Admin" },
  { src: "/perkembangan.png", label: "Laporan Perkembangan" },
  { src: "/dashboard guru.png", label: "Dashboard Guru" },
  { src: "/pengumuman.png", label: "Pengumuman" },
];

const footerLinks = [
  { label: "Laporan", href: "#" },
  { label: "Grafik", href: "#" },
  { label: "Pengumuman", href: "#" },
  { label: "Penilaian", href: "#" },
  { label: "Data Anak", href: "#" },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#F7FAFF] text-gray-800 font-sans">

      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">

       {/* Logo */}
<div className="flex items-center gap-3">
  <img
    src="/logo.png"
    alt="Logo"
    className="w-14 h-14 object-contain"
  />

  <div className="leading-tight">
    <p className="font-bold text-[#1976D2] text-base tracking-wide">
      SIMONEV PAUD
    </p>
    <p className="text-[10px] text-gray-400 tracking-wide hidden sm:block">
      Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini
    </p>
  </div>
</div>

          {/* Nav actions */}
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="bg-[#1976D2] hover:bg-[#1565C0] active:scale-95 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm shadow-blue-200">
                Masuk
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 px-6 text-center">

        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full bg-blue-100 opacity-40 blur-3xl" />
        <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full bg-sky-100 opacity-50 blur-3xl" />

        <div className="relative max-w-3xl mx-auto">
          <span className="inline-block mb-4 px-4 py-1 rounded-full bg-blue-50 border border-blue-200 text-[#1976D2] text-xs font-semibold tracking-widest uppercase">
            Platform Digital PAUD
          </span>

          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight text-gray-900">
            Pantau Perkembangan Anak{" "}
            <span className="text-[#1976D2]">Secara Cerdas & Terstruktur</span>
          </h1>

          <p className="mt-5 text-gray-500 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
            Platform berbasis web yang membantu guru dan lembaga PAUD dalam memantau serta mengevaluasi perkembangan anak — lebih mudah, rapi, dan dapat diakses kapan saja secara digital.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/login">
              <button className="bg-[#1976D2] hover:bg-[#1565C0] text-white px-7 py-3 rounded-full font-semibold text-sm shadow-md shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95">
                Mulai Sekarang
              </button>
            </Link>
            <a href="#fitur">
              <button className="border border-blue-200 bg-white hover:bg-blue-50 text-[#1976D2] px-7 py-3 rounded-full font-semibold text-sm transition-all active:scale-95">
                Lihat Fitur
              </button>
            </a>
          </div>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-6 -mt-10 mb-20">
        <div className="grid grid-cols-3 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-blue-100 shadow-sm p-6 sm:p-8 text-center"
            >
              <p className="text-3xl sm:text-4xl font-extrabold text-[#1976D2]">{s.value}</p>
              <p className="mt-1.5 text-xs sm:text-sm text-gray-400 font-medium">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────────── */}
      <section id="fitur" className="max-w-6xl mx-auto px-6 mb-24">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-[#1976D2] uppercase tracking-widest mb-2">Fitur Utama</p>
          <h2 className="text-3xl font-extrabold text-gray-900">Semua yang Anda Butuhkan</h2>
          <p className="mt-3 text-gray-500 text-sm max-w-lg mx-auto">
            Enam fitur utama yang dirancang khusus untuk kebutuhan monitoring dan evaluasi perkembangan anak usia dini.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={i}
              className="group bg-white border border-gray-100 rounded-2xl p-7 hover:-translate-y-1 hover:shadow-lg hover:border-blue-200 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1976D2] flex items-center justify-center mb-4 group-hover:bg-[#1976D2] group-hover:text-white transition-colors duration-300">
                {f.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-base mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── APP PREVIEW ────────────────────────────────────────────── */}
      <section className="bg-gradient-to-b from-white to-[#EBF3FF] py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-[#1976D2] uppercase tracking-widest mb-2">Tampilan Aplikasi</p>
            <h2 className="text-3xl font-extrabold text-gray-900">Preview Sistem SIMONEV</h2>
            <p className="mt-3 text-gray-500 text-sm max-w-lg mx-auto">
              Desain bersih dan terstruktur yang memudahkan guru dalam proses pemantauan perkembangan anak setiap harinya.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
            {previews.map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
              >
                <div className="overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.label}
                    width={400}
                    height={300}
                    className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="text-xs font-semibold text-gray-600">{item.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Preview {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ─────────────────────────────────────────────── */}
      <section className="bg-[#1976D2] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
            Siap Memulai Pemantauan Perkembangan Anak?
          </h2>
          <p className="mt-3 text-blue-100 text-sm">
            Ayo Bergabung bersama menggunakan SIMONEV untuk me-monitoring dan mengevaluasi perkembangan anak usia dini sekarang juga
          </p>
          <Link href="/login">
            <button className="mt-6 bg-white text-[#1976D2] hover:bg-blue-50 px-8 py-3 rounded-full font-bold text-sm transition-all active:scale-95 shadow-md">
              Mulai Sekarang
            </button>
          </Link>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────────── */}
<footer className="bg-gradient-to-b from-[#0D47A1] to-[#08306B] text-white px-6 py-10">
  <div className="max-w-6xl mx-auto">

    {/* TOP SECTION */}
    <div className="flex flex-col lg:flex-row justify-between gap-10 pb-8 border-b border-white/10">

      {/* BRAND */}
      <div className="max-w-sm">
        <div className="flex items-center gap-4 mb-4">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-16 h-16 object-contain drop-shadow"
          />

          <div>
            <p className="font-bold text-base tracking-wide">
              SIMONEV PAUD
            </p>
            <p className="text-[11px] text-blue-200 leading-snug">
              Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini
            </p>
          </div>
        </div>

        <p className="text-blue-200 text-xs leading-relaxed">
          Platform digital untuk pemantauan perkembangan anak secara terstruktur, cepat, dan mudah digunakan oleh guru.
        </p>
      </div>

      {/* FITUR (1 KOLOM) */}
<div>
  <p className="font-semibold text-sm mb-3">Fitur</p>
  <ul className="space-y-2 text-xs text-blue-200">
    {footerLinks.map((l, i) => (
      <li key={i}>
        <a className="hover:text-white transition" href={l.href}>
          {l.label}
        </a>
      </li>
    ))}
  </ul>
</div>

      {/* KONTAK */}
      <div>
        <p className="font-semibold text-sm mb-3">Kontak</p>

        <div className="space-y-3 text-xs text-blue-200">

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            +62 812-0000-0000
          </div>

          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            admin@simonev.com
          </div>
          
          <div className="pt-2 border-t border-white/10">
  <p className="text-[11px] leading-relaxed text-blue-200 max-w-[240px] break-words">
    📍 Perum. Dotamana Komplek Masjid Al-Muhajirin, Kec. Batam Kota, Kota Batam, Prov. Kepulauan Riau
  </p>
</div>
        </div>
      </div>
    </div>

    {/* BOTTOM */}
    <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-blue-300">
      <p>© {new Date().getFullYear()} SIMONEV PAUD</p>
      <p className="opacity-80">PBL IF4PA-08 Polibatam 2026</p>
    </div>

  </div>
</footer>

    </div>
  );
}
