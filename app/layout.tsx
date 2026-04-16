import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

// HAPUS import SidebarWrapper

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIMONEV - Sistem Monitoring & Evaluasi",
  description: "Sistem Monitoring dan Evaluasi Perkembangan Anak Usia Dini",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-gray-50 text-gray-900">
        {children} {/* ← langsung children, tanpa SidebarWrapper */}
      </body>
    </html>
  );
}