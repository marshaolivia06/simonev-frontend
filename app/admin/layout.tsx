"use client";

import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  ClipboardList,
  FileText,
  Megaphone,
} from "lucide-react";
import Sidebar, { NavItem } from "@/components/Sidebar";

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  {
    label: "Data",
    icon: Database,
    href: "/admin/data-guru",
    children: [
      { label: "Data Guru", href: "/admin/data-guru" },
      { label: "Data Kelas", href: "/admin/data-kelas" },
      { label: "Data Anak", href: "/admin/data-anak" },
      { label: "Akun Pengguna", href: "/admin/akun-pengguna" },
    ],
  },
  {
    label: "Penilaian",
    icon: ClipboardList,
    href: "/admin/penilaian-input",
    children: [
      { label: "Aspek Perkembangan", href: "/admin/aspek-perkembangan" },
      { label: "Indikator Penilaian", href: "/admin/indikator-penilaian" },
    ],
  },
  { label: "Laporan Perkembangan", icon: FileText, href: "/admin/laporan-perkembangan" },
  { label: "Pengumuman", icon: Megaphone, href: "/admin/pengumuman" },
];

const pageTitles: Record<string, string> = {
  "/admin/dashboard": "Dashboard Admin",

  "/admin/data-guru": "Data Guru",
  "/admin/data-kelas": "Data Kelas",
  "/admin/data-anak": "Data Anak",
  "/admin/akun-pengguna": "Akun Pengguna",
  "/admin/penilaian-input": "Aspek Perkembangan",
  "/admin/aspek-perkembangan": "Aspek Perkembangan",
  "/admin/indikator-penilaian": "Indikator Penilaian",
  "/admin/laporan-perkembangan": "Laporan Perkembangan",
  "/admin/pengumuman": "Pengumuman",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const pageTitle =
    pageTitles[pathname] ?? "Sistem Monitoring & Evaluasi";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar navItems={navItems} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="w-[120px]" />

          <h1 className="text-lg font-semibold text-gray-800 text-center flex-1">
            {pageTitle}
          </h1>

          <div className="flex items-center gap-2 bg-[#1976D2] text-white px-4 py-1.5 rounded-lg text-sm font-medium">
            <div className="w-5 h-5 bg-blue-300 rounded-full" />
            Admin
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}