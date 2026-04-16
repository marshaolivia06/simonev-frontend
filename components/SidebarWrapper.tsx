"use client";

import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

export default function SidebarWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const noSidebarRoutes = ["/", "/login", "/admin"];
  const hideSidebar = noSidebarRoutes.includes(pathname);

  if (hideSidebar) {
    return <>{children}</>;
  }

  return (
    <div className="flex">
      <Sidebar navItems={[]} />
      <main className="flex-1">{children}</main>
    </div>
  );
}