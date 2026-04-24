"use client";

import Link from "next/link";

// ── DATA ────────────────────────────────────────────────────────────────────

const features = [
  {
    emoji: "📊",
    bg: "#E3F2FD",
    title: "Laporan Perkembangan",
    desc: "Rekapitulasi lengkap perkembangan anak berdasarkan indikator penilaian yang terstruktur, jelas, dan mudah dipahami dari waktu ke waktu.",
  },
  {
    emoji: "📈",
    bg: "#E8F5E9",
    title: "Grafik Monitoring",
    desc: "Visualisasi perkembangan anak berdasarkan data penilaian guru agar progres setiap anak dapat dipantau secara lebih jelas dan mudah dianalisis.",
  },
  {
    emoji: "🔔",
    bg: "#E3F2FD",
    title: "Pengumuman",
    desc: "Informasi penting dari sekolah kepada guru dan orang tua — jadwal kegiatan, akademik, dan pemberitahuan lainnya secara cepat dan terpusat.",
  },
  {
    emoji: "✅",
    bg: "#E1F5FE",
    title: "Penilaian",
    desc: "Catat dan evaluasi perkembangan anak berdasarkan indikator PAUD yang ditentukan agar hasil penilaian lebih objektif dan mudah dipantau orang tua.",
  },
  {
    emoji: "👤",
    bg: "#E8EAF6",
    title: "Manajemen Profil",
    desc: "Kelola informasi pengguna — admin, guru, dan orang tua — termasuk data pribadi, akun, serta pengaturan akses secara mandiri dan terstruktur.",
  },
  {
    emoji: "🧒",
    bg: "#E3F2FD",
    title: "Data Anak",
    desc: "Kelola seluruh informasi peserta didik PAUD mulai dari identitas, data orang tua, hingga catatan perkembangan harian secara terpusat dan rapi.",
  },
];

const stats = [
  { value: "120+", label: "Data Anak" },
  { value: "30+", label: "Guru Terdaftar" },
  { value: "6", label: "Fitur Utama" },
];

const footerLinks = ["Laporan", "Grafik", "Pengumuman", "Penilaian", "Data Anak"];

// ── ILLUSTRATIONS ────────────────────────────────────────────────────────────

function HeroIllustration() {
  return (
    <svg viewBox="0 0 320 300" width="100%" style={{ maxWidth: 340 }} xmlns="http://www.w3.org/2000/svg">
      {/* Sky circle */}
      <circle cx="160" cy="150" r="140" fill="#E3F2FD" />
      <circle cx="160" cy="150" r="140" fill="none" stroke="#90CAF9" strokeWidth="2" />

      {/* Clouds */}
      <ellipse cx="220" cy="68" rx="32" ry="15" fill="white" />
      <ellipse cx="200" cy="72" rx="20" ry="13" fill="white" />
      <ellipse cx="240" cy="72" rx="20" ry="13" fill="white" />
      <ellipse cx="88" cy="88" rx="22" ry="11" fill="white" opacity={0.7} />
      <ellipse cx="73" cy="92" rx="14" ry="10" fill="white" opacity={0.7} />
      <ellipse cx="103" cy="92" rx="14" ry="10" fill="white" opacity={0.7} />

      {/* Sun */}
      <circle cx="62" cy="65" r="22" fill="#FDD835" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 62 + 28 * Math.cos(rad);
        const y1 = 65 + 28 * Math.sin(rad);
        const x2 = 62 + 36 * Math.cos(rad);
        const y2 = 65 + 36 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FDD835" strokeWidth="3" strokeLinecap="round" />;
      })}

      {/* Grass */}
      <ellipse cx="160" cy="272" rx="130" ry="26" fill="#81C784" />
      <ellipse cx="160" cy="270" rx="130" ry="15" fill="#A5D6A7" />

      {/* Tree left */}
      <rect x="58" y="210" width="10" height="52" rx="3" fill="#795548" />
      <circle cx="63" cy="196" r="27" fill="#42A5F5" />
      <circle cx="46" cy="208" r="17" fill="#64B5F6" />
      <circle cx="80" cy="208" r="17" fill="#64B5F6" />

      {/* Tree right */}
      <rect x="250" y="218" width="8" height="44" rx="3" fill="#795548" />
      <circle cx="254" cy="205" r="21" fill="#42A5F5" />
      <circle cx="240" cy="214" r="14" fill="#64B5F6" />
      <circle cx="268" cy="214" r="14" fill="#64B5F6" />

      {/* ── GIRL (blue dress, pigtails) ── */}
      <ellipse cx="118" cy="230" rx="18" ry="22" fill="#1976D2" />
      <ellipse cx="118" cy="210" rx="10" ry="5" fill="#1565C0" />
      <path d="M100 220 Q88 215 84 222" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M136 220 Q148 215 152 222" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round" fill="none" />
      <rect x="108" y="248" width="8" height="18" rx="4" fill="#0D47A1" />
      <rect x="120" y="248" width="8" height="18" rx="4" fill="#0D47A1" />
      <ellipse cx="112" cy="268" rx="7" ry="4" fill="#F44336" />
      <ellipse cx="124" cy="268" rx="7" ry="4" fill="#F44336" />
      <circle cx="118" cy="194" r="22" fill="#FFCC80" />
      <ellipse cx="118" cy="178" rx="22" ry="12" fill="#5D4037" />
      <ellipse cx="96" cy="182" rx="7" ry="10" fill="#5D4037" />
      <ellipse cx="140" cy="182" rx="7" ry="10" fill="#5D4037" />
      <ellipse cx="96" cy="174" rx="6" ry="4" fill="#42A5F5" transform="rotate(-20 96 174)" />
      <ellipse cx="140" cy="174" rx="6" ry="4" fill="#42A5F5" transform="rotate(20 140 174)" />
      <ellipse cx="110" cy="193" rx="4" ry="4.5" fill="white" />
      <ellipse cx="126" cy="193" rx="4" ry="4.5" fill="white" />
      <circle cx="111" cy="194" r="2.5" fill="#3E2723" />
      <circle cx="127" cy="194" r="2.5" fill="#3E2723" />
      <circle cx="112" cy="192.5" r="1" fill="white" />
      <circle cx="128" cy="192.5" r="1" fill="white" />
      <path d="M112 202 Q118 207 124 202" stroke="#E64A19" strokeWidth="2" strokeLinecap="round" fill="none" />
      <circle cx="104" cy="200" r="5" fill="#FFB3A7" opacity={0.5} />
      <circle cx="132" cy="200" r="5" fill="#FFB3A7" opacity={0.5} />

      {/* ── BOY (light blue, waving) ── */}
      <ellipse cx="202" cy="228" rx="18" ry="22" fill="#42A5F5" />
      <path d="M184 214 Q172 200 168 192" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round" fill="none" />
      <path d="M220 214 Q232 200 240 192" stroke="#FFCC80" strokeWidth="7" strokeLinecap="round" fill="none" />
      <circle cx="166" cy="189" r="8" fill="#FFCC80" />
      <circle cx="241" cy="189" r="8" fill="#FFCC80" />
      <rect x="191" y="246" width="9" height="20" rx="4" fill="#1565C0" />
      <rect x="203" y="246" width="9" height="20" rx="4" fill="#1565C0" />
      <ellipse cx="196" cy="268" rx="7" ry="4" fill="#37474F" />
      <ellipse cx="207" cy="268" rx="7" ry="4" fill="#37474F" />
      <circle cx="202" cy="192" r="22" fill="#FFCC80" />
      <ellipse cx="202" cy="176" rx="22" ry="11" fill="#4E342E" />
      <ellipse cx="194" cy="191" rx="4" ry="4.5" fill="white" />
      <ellipse cx="210" cy="191" rx="4" ry="4.5" fill="white" />
      <circle cx="195" cy="192" r="2.5" fill="#3E2723" />
      <circle cx="211" cy="192" r="2.5" fill="#3E2723" />
      <circle cx="196" cy="190.5" r="1" fill="white" />
      <circle cx="212" cy="190.5" r="1" fill="white" />
      <path d="M195 201 Q202 208 209 201" stroke="#E64A19" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      <circle cx="186" cy="198" r="5" fill="#FFB3A7" opacity={0.5} />
      <circle cx="218" cy="198" r="5" fill="#FFB3A7" opacity={0.5} />

      {/* Flowers */}
      <circle cx="90" cy="258" r="5" fill="#90CAF9" />
      <circle cx="87" cy="253" r="3.5" fill="#42A5F5" />
      <circle cx="93" cy="253" r="3.5" fill="#42A5F5" />
      <circle cx="85" cy="257" r="3.5" fill="#42A5F5" />
      <circle cx="95" cy="257" r="3.5" fill="#42A5F5" />
      <circle cx="238" cy="258" r="5" fill="#FFF176" />
      <circle cx="235" cy="253" r="3.5" fill="#FDD835" />
      <circle cx="241" cy="253" r="3.5" fill="#FDD835" />
      <circle cx="233" cy="257" r="3.5" fill="#FDD835" />
      <circle cx="243" cy="257" r="3.5" fill="#FDD835" />

      {/* Sparkles */}
      <text x="156" y="108" fontSize="16" fill="#FDD835" textAnchor="middle">★</text>
      <text x="174" y="95" fontSize="11" fill="#90CAF9" textAnchor="middle">★</text>
      <text x="145" y="96" fontSize="11" fill="#42A5F5" textAnchor="middle">✦</text>
    </svg>
  );
}

function TeacherIllustration() {
  return (
    <svg viewBox="0 0 220 145" width={220} height={145} xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      {/* Blackboard */}
      <rect x="10" y="10" width="120" height="80" rx="8" fill="#1565C0" />
      <rect x="14" y="14" width="112" height="72" rx="6" fill="#1976D2" />
      <text x="70" y="42" fontFamily="'Fredoka One', cursive" fontSize="13" fill="white" textAnchor="middle">SIMONEV</text>
      <line x1="30" y1="52" x2="110" y2="52" stroke="white" strokeWidth="1.5" opacity={0.5} />
      <line x1="30" y1="62" x2="90" y2="62" stroke="white" strokeWidth="1.5" opacity={0.5} />
      <line x1="30" y1="72" x2="100" y2="72" stroke="white" strokeWidth="1.5" opacity={0.5} />
      <line x1="50" y1="90" x2="40" y2="118" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
      <line x1="90" y1="90" x2="100" y2="118" stroke="#5D4037" strokeWidth="4" strokeLinecap="round" />
      {/* Teacher */}
      <ellipse cx="168" cy="100" rx="16" ry="22" fill="#1976D2" />
      <circle cx="168" cy="72" r="18" fill="#FFCC80" />
      <ellipse cx="168" cy="58" rx="18" ry="10" fill="#4E342E" />
      <circle cx="168" cy="52" r="8" fill="#4E342E" />
      <ellipse cx="162" cy="72" rx="3" ry="3.5" fill="white" />
      <ellipse cx="174" cy="72" rx="3" ry="3.5" fill="white" />
      <circle cx="163" cy="73" r="2" fill="#3E2723" />
      <circle cx="175" cy="73" r="2" fill="#3E2723" />
      <path d="M162 80 Q168 85 174 80" stroke="#E64A19" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <rect x="158" y="69" width="8" height="6" rx="3" fill="none" stroke="#37474F" strokeWidth="1.2" />
      <rect x="170" y="69" width="8" height="6" rx="3" fill="none" stroke="#37474F" strokeWidth="1.2" />
      <line x1="166" y1="72" x2="170" y2="72" stroke="#37474F" strokeWidth="1.2" />
      <path d="M152 92 Q138 85 126 80" stroke="#FFCC80" strokeWidth="6" strokeLinecap="round" fill="none" />
      <circle cx="123" cy="79" r="6" fill="#FFCC80" />
      <circle cx="156" cy="78" r="4" fill="#FFB3A7" opacity={0.5} />
      <circle cx="180" cy="78" r="4" fill="#FFB3A7" opacity={0.5} />
      <rect x="158" y="118" width="7" height="16" rx="3.5" fill="#0D47A1" />
      <rect x="169" y="118" width="7" height="16" rx="3.5" fill="#0D47A1" />
      <ellipse cx="162" cy="135" rx="6" ry="3.5" fill="#37474F" />
      <ellipse cx="172" cy="135" rx="6" ry="3.5" fill="#37474F" />
    </svg>
  );
}

// ── PAGE ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800;900&family=Fredoka+One&display=swap');

        .paud-body {
          font-family: 'Nunito', sans-serif;
          background: #F0F6FF;
          color: #1A2B4A;
          overflow-x: hidden;
        }

        .paud-btn-primary {
          background: linear-gradient(135deg, #42A5F5, #1565C0);
          color: white;
          border: none;
          padding: 11px 24px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(25,118,210,0.3);
          transition: transform 0.15s, box-shadow 0.15s;
          display: inline-block;
          text-decoration: none;
        }
        .paud-btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(25,118,210,0.4);
        }

        .paud-btn-secondary {
          background: white;
          color: #1976D2;
          border: 2px solid #90CAF9;
          padding: 11px 24px;
          border-radius: 50px;
          font-family: 'Nunito', sans-serif;
          font-weight: 800;
          font-size: 14px;
          cursor: pointer;
          transition: background 0.15s;
          display: inline-block;
          text-decoration: none;
        }
        .paud-btn-secondary:hover { background: #E3F2FD; }

        .paud-feature-card {
          background: white;
          border: 2px solid #BBDEFB;
          border-radius: 20px;
          padding: 22px;
          transition: transform 0.2s, box-shadow 0.2s, border-color 0.2s;
          cursor: default;
        }
        .paud-feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 28px rgba(25,118,210,0.12);
          border-color: #42A5F5;
        }

        .paud-stat-card {
          background: white;
          border: 2px solid #BBDEFB;
          border-radius: 18px;
          padding: 16px 18px;
          flex: 1;
          text-align: center;
          box-shadow: 0 2px 8px rgba(25,118,210,0.06);
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }
        .paud-float { animation: float 4s ease-in-out infinite; }
      `}</style>

      <div className="paud-body min-h-screen">

        {/* ── NAVBAR ────────────────────────────────────────────────── */}
        <header className="sticky top-0 z-50 bg-white border-b-2 border-blue-100 shadow-sm">
          <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
            <div className="flex items-center gap-3">
              {/* Logo */}
             <div style={{
  width: 46,
  height: 46,
  borderRadius: 14,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}}>
  <img 
    src="/logo.png" 
    alt="Logo SIMONEV"
    className="w-10 h-10 object-contain"
  />
</div>
              <div>
                <p style={{ fontFamily: "'Fredoka One', cursive", color: "#1565C0", fontSize: 17, lineHeight: 1 }}>
                  SIMONEV PAUD
                </p>
                <p className="text-[10px] text-gray-400 tracking-wide hidden sm:block">
                  Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
  <Link href="/login">
    <button
      className="paud-btn-primary"
      style={{ padding: "8px 22px", fontSize: 13 }}
    >
      Masuk
    </button>
  </Link>

  <Link href="/register">
    <button
      className="paud-btn-primary"
      style={{ padding: "8px 22px", fontSize: 13 }}
    >
      Daftar
    </button>
  </Link>
</div>
          </div>
        </header>

        {/* ── HERO ──────────────────────────────────────────────────── */}
        <section className="relative overflow-hidden pt-14 pb-6 px-6">
          {/* Decorative blobs */}
          <div className="pointer-events-none absolute -top-20 -left-20 w-96 h-96 rounded-full opacity-30"
            style={{ background: "#BBDEFB", filter: "blur(60px)" }} />
          <div className="pointer-events-none absolute top-10 right-0 w-72 h-72 rounded-full opacity-30"
            style={{ background: "#E3F2FD", filter: "blur(50px)" }} />

          <div className="relative max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left */}
            <div>
              <span style={{
                display: "inline-block", marginBottom: 14,
                padding: "4px 14px", borderRadius: 50,
                background: "#E3F2FD", border: "1.5px solid #90CAF9",
                color: "#1565C0", fontSize: 10, fontWeight: 800,
                textTransform: "uppercase", letterSpacing: "1.5px"
              }}>
                Platform Digital PAUD
              </span>

              <h1 style={{ fontFamily: "'Fredoka One', cursive", fontSize: "clamp(28px,4vw,40px)", lineHeight: 1.15, color: "#1A2B4A", margin: "0 0 14px" }}>
                Pantau Tumbuh Kembang Anak{" "}
                <span style={{ color: "#1976D2" }}>Lebih Cerdas & Menyenangkan!</span>
              </h1>

              <p style={{ fontSize: 14, color: "#546E8A", lineHeight: 1.75, margin: "0 0 22px" }}>
                Platform berbasis web yang membantu guru dan lembaga PAUD dalam memantau serta
                mengevaluasi perkembangan anak — lebih mudah, rapi, dan dapat diakses kapan saja secara digital.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link href="/login">
                  <button className="paud-btn-primary">✨ Mulai Sekarang</button>
                </Link>
                <a href="#fitur">
                  <button className="paud-btn-secondary">Lihat Fitur</button>
                </a>
              </div>
            </div>

            {/* Right - Illustration */}
            <div className="flex justify-center paud-float">
              <HeroIllustration />
            </div>
          </div>
        </section>

        {/* ── STATS ─────────────────────────────────────────────────── */}
        <section className="max-w-4xl mx-auto px-6 mt-8 mb-12">
          <div className="flex gap-4">
            {stats.map((s, i) => (
              <div key={i} className="paud-stat-card">
                <p style={{ fontFamily: "'Fredoka One', cursive", fontSize: 30, color: "#1976D2", margin: 0 }}>{s.value}</p>
                <p style={{ fontSize: 12, color: "#90A4AE", fontWeight: 600, marginTop: 4 }}>{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────────────────── */}
        <section id="fitur" className="max-w-6xl mx-auto px-6 mb-16">
          <div className="text-center mb-10">
            <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#1976D2", marginBottom: 6 }}>
              Fitur Utama
            </p>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#1A2B4A", margin: "0 0 6px" }}>
              Semua yang Anda Butuhkan 🌟
            </h2>
            <p style={{ fontSize: 13, color: "#90A4AE", maxWidth: 480, margin: "0 auto" }}>
              Enam fitur utama yang dirancang khusus untuk kebutuhan monitoring dan evaluasi
              perkembangan anak usia dini.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <div key={i} className="paud-feature-card">
                <div style={{
                  width: 46, height: 46, borderRadius: 14,
                  background: f.bg, display: "flex", alignItems: "center",
                  justifyContent: "center", fontSize: 22, marginBottom: 14
                }}>
                  {f.emoji}
                </div>
                <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 16, color: "#1A2B4A", margin: "0 0 8px" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 12.5, color: "#90A4AE", lineHeight: 1.65, margin: 0 }}>
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ── TEACHER SECTION ───────────────────────────────────────── */}
        <section className="max-w-5xl mx-auto px-6 mb-16">
          <div style={{
            background: "white", borderRadius: 28, border: "2px solid #BBDEFB",
            padding: "28px 32px", display: "flex", alignItems: "center", gap: 28,
            flexWrap: "wrap"
          }}>
            <TeacherIllustration />
            <div style={{ flex: 1, minWidth: 200 }}>
              <h3 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 22, color: "#1A2B4A", marginBottom: 10 }}>
                Dirancang untuk Guru PAUD 🧑‍🏫
              </h3>
              <p style={{ fontSize: 13.5, color: "#546E8A", lineHeight: 1.75, margin: 0 }}>
                SIMONEV hadir sebagai sahabat guru dalam proses monitoring harian. Tidak perlu repot
                mencatat manual — semua data perkembangan si kecil tersimpan rapi dan bisa diakses
                kapan saja oleh guru maupun orang tua.
              </p>
            </div>
          </div>
        </section>

        {/* ── APP PREVIEW ───────────────────────────────────────────── */}
        <section style={{ background: "linear-gradient(to bottom, white, #EBF3FF)", padding: "48px 24px" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p style={{ fontSize: 10, fontWeight: 800, textTransform: "uppercase", letterSpacing: "2px", color: "#1976D2", marginBottom: 6 }}>
                Tampilan Aplikasi
              </p>
              <h2 style={{ fontFamily: "'Fredoka One', cursive", fontSize: 28, color: "#1A2B4A", margin: "0 0 6px" }}>
                Preview Sistem SIMONEV
              </h2>
              <p style={{ fontSize: 13, color: "#90A4AE", maxWidth: 480, margin: "0 auto" }}>
                Desain bersih dan terstruktur yang memudahkan guru dalam proses pemantauan
                perkembangan anak setiap harinya.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-5">
              {[
                { src: "/dashboard.png", label: "Dashboard Admin" },
                { src: "/perkembangan.png", label: "Laporan Perkembangan" },
                { src: "/dashboard guru.png", label: "Dashboard Guru" },
                { src: "/pengumuman.png", label: "Pengumuman" },
              ].map((item, i) => (
                <div key={i} style={{
                  background: "white", borderRadius: 20,
                  overflow: "hidden", border: "2px solid #BBDEFB",
                  boxShadow: "0 2px 8px rgba(25,118,210,0.07)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.src}
                    alt={item.label}
                    style={{ width: "100%", height: 160, objectFit: "cover" }}
                  />
                  <div style={{ padding: "10px 14px" }}>
                    <p style={{ fontSize: 12, fontWeight: 700, color: "#546E8A", margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 10, color: "#90A4AE", marginTop: 2 }}>Preview {i + 1}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────── */}
        <section style={{ padding: "0 24px", marginTop: 48, marginBottom: 48 }}>
          <div style={{
            maxWidth: 860, margin: "0 auto",
            background: "linear-gradient(135deg, #1976D2, #0D47A1)",
            borderRadius: 28, padding: "40px 32px", textAlign: "center",
            position: "relative", overflow: "hidden"
          }}>
            <div style={{ position: "absolute", top: -20, right: -20, width: 100, height: 100, background: "white", opacity: 0.07, borderRadius: "50%" }} />
            <div style={{ position: "absolute", bottom: -30, left: 20, width: 80, height: 80, background: "white", opacity: 0.07, borderRadius: "50%" }} />
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎉</div>
            <h2 style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: 24, margin: "0 0 10px" }}>
              Siap Memulai Pemantauan Perkembangan Anak?
            </h2>
            <p style={{ color: "#90CAF9", fontSize: 13, margin: "0 0 20px", lineHeight: 1.7 }}>
              Bergabunglah dengan SIMONEV dan buat proses monitoring anak usia dini jadi lebih mudah,
              cepat, dan menyenangkan!
            </p>
            <Link href="/login">
              <button style={{
                background: "white", color: "#1976D2", border: "none",
                padding: "12px 30px", borderRadius: 50,
                fontFamily: "'Nunito', sans-serif", fontWeight: 800, fontSize: 14,
                cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.15)"
              }}>
                ✨ Mulai Sekarang
              </button>
            </Link>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────────────────────────────── */}
        <footer style={{ background: "linear-gradient(180deg,#0D47A1,#08306B)", color: "#90CAF9", padding: "32px 24px 20px" }}>
          <div style={{ maxWidth: 1024, margin: "0 auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, paddingBottom: 20, borderBottom: "1px solid rgba(255,255,255,0.1)", flexWrap: "wrap" }}>

              {/* Brand */}
              <div style={{ maxWidth: 240 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                 <div style={{
  width: 46,
  height: 46,
  display: "flex",
  alignItems: "center",
  justifyContent: "center"
}}>
  <img 
    src="/logo.png" 
    alt="Logo SIMONEV"
    className="w-10 h-10 object-contain"
  />
</div>
                  <div>
                    <p style={{ fontFamily: "'Fredoka One', cursive", color: "white", fontSize: 16, margin: 0 }}>SIMONEV PAUD</p>
                    <p style={{ fontSize: 10, color: "#64B5F6", margin: 0, lineHeight: 1.4 }}>Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini</p>
                  </div>
                </div>
                <p style={{ fontSize: 11, color: "#64B5F6", lineHeight: 1.6, margin: 0 }}>
                  Platform digital untuk pemantauan perkembangan anak secara terstruktur, cepat, dan mudah digunakan oleh guru.
                </p>
              </div>

              {/* Fitur links */}
              <div>
                <p style={{ color: "white", fontWeight: 800, fontSize: 12, margin: "0 0 10px" }}>Fitur</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {footerLinks.map((l, i) => (
                    <li key={i} style={{ marginBottom: 6 }}>
                      <a href="#" style={{ color: "#64B5F6", fontSize: 12, textDecoration: "none" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "white")}
                        onMouseLeave={e => (e.currentTarget.style.color = "#64B5F6")}
                      >{l}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <p style={{ color: "white", fontWeight: 800, fontSize: 12, margin: "0 0 10px" }}>Kontak</p>
                <div style={{ fontSize: 12, color: "#64B5F6", lineHeight: 2 }}>
                  <p style={{ margin: 0 }}>📞 +62 812-0000-0000</p>
                  <p style={{ margin: 0 }}>✉️ admin@simonev.com</p>
                  <p style={{ margin: "8px 0 0", fontSize: 11, maxWidth: 200, lineHeight: 1.5 }}>
  📍 Kota Batam, Kepulauan Riau
</p>
                </div>
              </div>
            </div>

            <div style={{ paddingTop: 14, display: "flex", justifyContent: "space-between", fontSize: 11, color: "#1E88E5", flexWrap: "wrap", gap: 4 }}>
              <span>© {new Date().getFullYear()} SIMONEV PAUD</span>
              <span>PBL IF4PA-08 Polibatam 2026</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
