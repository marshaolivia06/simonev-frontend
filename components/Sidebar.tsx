"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
  href: string;
  children?: { label: string; href: string }[];
}

interface SidebarProps {
  navItems: NavItem[];
}

export default function Sidebar({ navItems }: SidebarProps) {
  const pathname = usePathname();
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

  return (
    <aside className="w-64 bg-[#1976D2] text-white flex flex-col shadow-xl flex-shrink-0">
      
      {/* Logo */}
      <div className="px-3 pt-2 pb-2 border-b border-[#1565C0] flex flex-col items-start">
        <img
          src="/logo.png"
          alt="Logo"
          className="w-32 h-32 object-contain -mb-3"
        />
        <p className="font-bold text-sm leading-tight">
          SIMONEV - Sistem
        </p>
        <p className="text-[#BBDEFB] text-xs leading-tight">
          Monitoring & Evaluasi Perkembangan Anak Usia Dini
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {

          // ✅ FIX: parent ikut aktif kalau child aktif
          const isActive =
            pathname === item.href ||
            pathname.startsWith(item.href) ||
            (item.children &&
              item.children.some((child) => pathname === child.href));

          // ✅ FIX: dropdown otomatis kebuka kalau child aktif
          const isExpanded =
            expandedMenu === item.label ||
            (item.children &&
              item.children.some((child) => pathname === child.href));

          return (
            <div key={item.label}>
              {item.children ? (
                <button
                  onClick={() =>
                    setExpandedMenu(isExpanded ? null : item.label)
                  }
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-[#1976D2]"
                      : "text-[#BBDEFB] hover:bg-[#1565C0]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={16} />
                    <span>{item.label}</span>
                  </div>
                  <ChevronDown
                    size={14}
                    className={`transition-transform ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </button>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-[#1976D2]"
                      : "text-[#BBDEFB] hover:bg-[#1565C0]"
                  }`}
                >
                  <item.icon size={16} />
                  <span>{item.label}</span>
                </Link>
              )}

              {item.children && isExpanded && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      className={`block px-3 py-2 text-xs rounded-lg transition-colors ${
                        pathname === child.href
                          ? "text-white bg-[#1565C0]"
                          : "text-[#BBDEFB] hover:text-white hover:bg-[#1565C0]"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}