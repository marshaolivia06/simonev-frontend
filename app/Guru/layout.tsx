"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Users, ClipboardList, Megaphone, LogOut, User,
} from "lucide-react";
import Sidebar, { NavItem } from "@/components/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/guru/dashboard" },
  { label: "Data Anak",  icon: Users,           href: "/guru/data-anak"  },
  {
    label: "Penilaian",
    icon: ClipboardList,
    href: "/guru/penilaian",
    children: [
      { label: "Penilaian Perkembangan", href: "/guru/penilaian-perkembangan" },
      { label: "Laporan Perkembangan",   href: "/guru/laporan-perkembangan"   },
    ],
  },
  { label: "Pengumuman", icon: Megaphone, href: "/guru/pengumuman" },
];

const pageTitles: Record<string, string> = {
  "/guru/dashboard":              "Dashboard Guru",
  "/guru/data-anak":              "Data Anak Kelas",
  "/guru/penilaian-perkembangan": "Penilaian Perkembangan",
  "/guru/laporan-perkembangan":   "Laporan Perkembangan",
  "/guru/pengumuman":             "Pengumuman",
  "/guru/profil":                 "Profil Guru",
};

function getInitials(nama: string): string {
  return nama
    .replace(/,.*/, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function GuruLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router   = useRouter();
  const [open, setOpen]             = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [namaGuru, setNamaGuru]     = useState("Guru");

  useEffect(() => {
  const namaFromStorage = localStorage.getItem("nama_guru")
  const userStr         = localStorage.getItem("user")

  if (namaFromStorage) {
    // Ambil 2 kata pertama saja
    const duaKata = namaFromStorage.split(" ").slice(0, 2).join(" ")
    setNamaGuru(duaKata)
  } else if (userStr) {
    const user = JSON.parse(userStr)
    setNamaGuru(user.username || "Guru")
  }
}, [])

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token")
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        }
      })
    } catch {
      // tetap logout meski error
    } finally {
      localStorage.clear()
      router.push("/login")
    }
  }

  const pageTitle = pageTitles[pathname] ?? "Sistem Monitoring & Evaluasi";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="w-[120px]" />

          <h1 className="text-lg font-semibold text-gray-800 text-center flex-1">{pageTitle}</h1>

          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 bg-[#1976D2] text-white pl-1.5 pr-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1565C0] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-white leading-none">
                  {getInitials(namaGuru)}
                </span>
              </div>
              {namaGuru}
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-xl shadow-md overflow-hidden z-50">
                <button
                  onClick={() => { setOpen(false); router.push("/guru/profil"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={14} /> Profil
                </button>
                <button
                  onClick={() => { setOpen(false); setShowLogout(true); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>

      {showLogout && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
            <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <LogOut className="text-red-500" size={20} />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Konfirmasi Logout</h3>
            <p className="text-sm text-gray-500 mb-5">Apakah Anda yakin ingin logout dari akun ini?</p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogout(false)}
                className="flex-1 py-2 text-sm rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Batal
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}