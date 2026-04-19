"use client";

import { ClipboardList, BarChart2 } from "lucide-react";

const childInfo = {
  namaAnak: "Budi",
  kelas: "TK A",
  guruKelas: "",
  semester: "",
  tahunAjaran: "",
};

const latestProgress = {
  label: "BSH - Berkembang Sesuai Herapan",
  tanggal: "15 Maret 2026",
};

const announcements: string[] = [];

export default function OrangtuaDashboard() {
  return (
    <div>
      {/* Info Cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {/* Informasi Anak */}
        <div className="bg-emerald-100 border border-emerald-200 rounded-xl p-5 flex items-start gap-4">
          <ClipboardList size={36} className="text-emerald-700 mt-1 flex-shrink-0" />
          <div className="text-sm text-emerald-900 space-y-1">
            <p><span className="font-semibold">Nama Anak :</span> {childInfo.namaAnak}</p>
            <p><span className="font-semibold">Kelas :</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{childInfo.kelas}</p>
            <p><span className="font-semibold">Guru Kelas :</span> {childInfo.guruKelas}</p>
            <p><span className="font-semibold">Semester :</span> {childInfo.semester}</p>
            <p><span className="font-semibold">Tahun Ajaran :</span> {childInfo.tahunAjaran}</p>
          </div>
        </div>

        {/* Perkembangan Terakhir */}
        <div className="bg-rose-100 border border-rose-200 rounded-xl p-5 flex items-start gap-4">
          <BarChart2 size={36} className="text-rose-700 mt-1 flex-shrink-0" />
          <div className="text-sm text-rose-900 space-y-2">
            <p className="font-semibold">Perkembangan Terakhir :</p>
            <p className="font-bold text-base">{latestProgress.label}</p>
            <p>Tanggal : {latestProgress.tanggal}</p>
          </div>
        </div>
      </div>

      {/* Pengumuman */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-800 mb-4">Pengumuman Terbaru</h2>
        {announcements.length === 0 ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-100 rounded-full w-full" />
            ))}
            <p className="text-sm text-gray-400 text-center pt-2">Belum ada pengumuman</p>
          </div>
        ) : (
          announcements.map((a, i) => (
            <div key={i} className="py-3 border-b border-gray-100 last:border-0 text-sm text-gray-700">{a}</div>
          ))
        )}
      </div>
    </div>
  );
}