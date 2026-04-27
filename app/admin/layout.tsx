"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import {
  LayoutDashboard, Database, ClipboardList, FileText, Megaphone, User, LogOut,
} from "lucide-react";
import Sidebar, { NavItem } from "@/components/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  {
    label: "Data",
    icon: Database,
    href: "/admin/data-guru",
    children: [
      { label: "Data Guru",        href: "/admin/data-guru"        },
      { label: "Data Kelas",       href: "/admin/data-kelas"       },
      { label: "Data Anak",        href: "/admin/data-anak"        },
      { label: "Verifikasi Akun",  href: "/admin/verifikasi-akun"  },
    ],
  },
  {
    label: "Penilaian",
    icon: ClipboardList,
    href: "/admin/penilaian-input",
    children: [
      { label: "Aspek Perkembangan",  href: "/admin/aspek-perkembangan"  },
      { label: "Indikator Penilaian", href: "/admin/indikator-penilaian" },
    ],
  },
  { label: "Laporan Perkembangan", icon: FileText,  href: "/admin/laporan-perkembangan" },
  { label: "Pengumuman",           icon: Megaphone, href: "/admin/pengumuman"           },
];

const pageTitles: Record<string, string> = {
  "/admin/dashboard":             "Dashboard Admin",
  "/admin/data-guru":             "Data Guru",
  "/admin/data-kelas":            "Data Kelas",
  "/admin/data-anak":             "Data Anak",
  "/admin/verifikasi-akun":       "Verifikasi Akun",
  "/admin/aspek-perkembangan":    "Aspek Perkembangan",
  "/admin/indikator-penilaian":   "Indikator Penilaian",
  "/admin/laporan-perkembangan":  "Laporan Perkembangan",
  "/admin/pengumuman":            "Pengumuman",
  "/admin/profile":               "Profil Admin",
};

/* Ganti dengan nama dari session / auth */
const NAMA_ADMIN = "Siti Rahayu";

function getInitials(nama: string): string {
  return nama
    .replace(/,.*/, "")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname    = usePathname();
  const router      = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [showDropdown,   setShowDropdown]   = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const pageTitle = pageTitles[pathname] ?? "Sistem Monitoring & Evaluasi";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="w-[120px]" />

          <h1 className="text-lg font-semibold text-gray-800 text-center flex-1">{pageTitle}</h1>

          {/* Tombol Admin — dengan lingkaran inisial */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowDropdown((prev) => !prev)}
              className="flex items-center gap-2 bg-[#1976D2] text-white pl-1.5 pr-4 py-1.5 rounded-lg text-sm font-medium hover:bg-[#1565C0] transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-white/25 flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-bold text-white leading-none">
                  {getInitials(NAMA_ADMIN)}
                </span>
              </div>
              Admin
            </button>

            {showDropdown && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
                <button
                  onClick={() => { setShowDropdown(false); router.push("/admin/profile"); }}
                  className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User size={14} /> Profil
                </button>
                <button
                  onClick={() => { setShowDropdown(false); setShowLogoutModal(true); }}
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

      {/* Modal Konfirmasi Logout */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-80 shadow-xl text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-red-100 p-3 rounded-full">
                <LogOut size={24} className="text-red-500" />
              </div>
            </div>
            <h2 className="text-base font-semibold text-gray-800 mb-1">Konfirmasi Logout?</h2>
            <p className="text-sm text-gray-500 mb-5">Apakah Anda yakin ingin logout dari akun ini?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="flex-1 border border-gray-300 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => { setShowLogoutModal(false); router.push("/"); }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-medium py-2 rounded-lg transition-colors"
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