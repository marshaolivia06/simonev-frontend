"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, FileText, Megaphone, User, LogOut } from "lucide-react";
import Sidebar, { NavItem } from "@/components/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/OrangTua/dashboard" },
  { label: "Laporan Perkembangan", icon: FileText, href: "/OrangTua/laporan-perkembangan" },
  { label: "Pengumuman", icon: Megaphone, href: "/OrangTua/pengumuman" },
];

const pageTitles: Record<string, string> = {
  "/OrangTua/dashboard": "Dashboard Orangtua",
  "/OrangTua/laporan-perkembangan": "Perkembangan Anak",
  "/OrangTua/pengumuman": "Pengumuman",
  "/OrangTua/profile": "Profil Orangtua",
};

function getInitials(nama: string): string {
  return nama
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function OrangtuaLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [namaOrtu, setNamaOrtu] = useState("Orangtua");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = pageTitles[pathname] ?? "Sistem Monitoring & Evaluasi";

  // Ambil nama ortu dari localStorage
  useEffect(() => {
    try {
      const namaFromStorage = localStorage.getItem("nama_ortu")
      const userStr = localStorage.getItem("user")

      if (namaFromStorage) {
        const duaKata = namaFromStorage.split(" ").slice(0, 2).join(" ")
        setNamaOrtu(duaKata)
      } else if (userStr) {
        const user = JSON.parse(userStr)
        setNamaOrtu(user.username || "Orangtua")
      }
    } catch {
      setNamaOrtu("Orangtua")
    }
  }, []);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="w-[120px]" />

          <h1 className="text-lg font-semibold text-gray-800 text-center flex-1">
            {pageTitle}
          </h1>

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-2 bg-[#1976D2] text-white pl-1.5 pr-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1565C0] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-white leading-none">
                  {getInitials(namaOrtu)}
                </span>
              </div>
              {namaOrtu}
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { setShowDropdown(false); router.push("/OrangTua/profile"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={14} />
                  Profil
                </button>
                <button
                  onClick={() => { setShowDropdown(false); setShowLogoutModal(true); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-500 hover:bg-gray-100"
                >
                  <LogOut size={14} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-80 shadow-xl text-center">
            <div className="mx-auto mb-3 flex items-center justify-center w-12 h-12 rounded-full bg-red-100">
              <LogOut className="text-red-500" size={20} />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Konfirmasi Logout
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Apakah Anda yakin ingin logout dari akun ini?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutModal(false)}
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