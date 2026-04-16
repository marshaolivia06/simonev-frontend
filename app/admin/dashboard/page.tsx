"use client";

import { Users, School, Baby } from "lucide-react";

const stats = [
  { label: "Jumlah Guru", value: 0, icon: Users, color: "bg-emerald-100 border-emerald-200", iconColor: "text-emerald-600", textColor: "text-emerald-800" },
  { label: "Jumlah Kelas", value: 0, icon: School, color: "bg-rose-100 border-rose-200", iconColor: "text-rose-600", textColor: "text-rose-800" },
  { label: "Jumlah Anak", value: 0, icon: Baby, color: "bg-yellow-100 border-yellow-200", iconColor: "text-yellow-600", textColor: "text-yellow-800" },
  { label: "Jumlah Anak TK A", value: 0, icon: Users, color: "bg-purple-100 border-purple-200", iconColor: "text-purple-600", textColor: "text-purple-800" },
  { label: "Jumlah Anak TK B", value: 0, icon: Users, color: "bg-orange-100 border-orange-200", iconColor: "text-orange-600", textColor: "text-orange-800" },
];

export default function AdminDashboard() {
  const announcements: string[] = [];

  return (
    <div>
      {/* Stat Cards Row 1 */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {stats.slice(0, 3).map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-5 flex flex-col gap-3`}>
            <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.label} :</p>
            <div className="flex items-center gap-3">
              <stat.icon size={32} className={stat.iconColor} />
              <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stat Cards Row 2 */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {stats.slice(3).map((stat) => (
          <div key={stat.label} className={`${stat.color} border rounded-xl p-5 flex flex-col gap-3`}>
            <p className={`text-sm font-semibold ${stat.textColor}`}>{stat.label} :</p>
            <div className="flex items-center gap-3">
              <stat.icon size={32} className={stat.iconColor} />
              <span className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</span>
            </div>
          </div>
        ))}
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