"use client";

import { useState } from "react";
import { CheckCircle, XCircle, Eye, Search, ShieldCheck } from "lucide-react";

type Status = "pending" | "disetujui" | "ditolak";
type Role = "guru" | "ortu";

interface Pendaftar {
  id: number;
  nama: string;
  email: string;
  noHp: string;
  role: Role;
  nik: string;
  tanggalDaftar: string;
  status: Status;
  // Guru
  nipNoPegawai?: string;
  namaLembaga?: string;
  jabatan?: string;
  suratTugas?: string;
  // Ortu
  hubungan?: string;
  namaAnak?: string;
  kelasAnak?: string;
  alamat?: string;
  fotoKtp?: string;
  // Catatan penolakan
  catatanReject?: string;
}

const dummyPendaftar: Pendaftar[] = [
  {
    id: 1,
    nama: "Dewi Rahmawati, S.Pd",
    email: "dewi.rahmawati@gmail.com",
    noHp: "0812-3456-7890",
    role: "guru",
    nik: "3171012345678901",
    tanggalDaftar: "2024-11-01",
    status: "pending",
    nipNoPegawai: "198801012015042001",
    namaLembaga: "TK Permata Bangsa",
    jabatan: "Guru Kelas",
    suratTugas: "surat_tugas_dewi.pdf",
  },
  {
    id: 2,
    nama: "Rudi Hartono",
    email: "rudi.hartono@gmail.com",
    noHp: "0856-7890-1234",
    role: "ortu",
    nik: "3171056789012345",
    tanggalDaftar: "2024-11-02",
    status: "pending",
    hubungan: "Ayah",
    namaAnak: "Daffa Ramadhan",
    kelasAnak: "TK B2",
    alamat: "Jl. Teuku Umar No. 22, Batu Aji, Batam",
    fotoKtp: "ktp_rudi.jpg",
  },
  {
    id: 3,
    nama: "Sri Wahyuni",
    email: "sri.wahyuni@gmail.com",
    noHp: "0878-2345-6789",
    role: "ortu",
    nik: "3171078901234567",
    tanggalDaftar: "2024-11-03",
    status: "pending",
    hubungan: "Ibu",
    namaAnak: "Intan Permata",
    kelasAnak: "TK A2",
    alamat: "Jl. Kartini No. 3, Sagulung, Batam",
  },
  {
    id: 4,
    nama: "Budi Santoso, S.Pd",
    email: "budi.santoso@gmail.com",
    noHp: "0813-9012-3456",
    role: "guru",
    nik: "3171034567890123",
    tanggalDaftar: "2024-10-28",
    status: "disetujui",
    nipNoPegawai: "",
    namaLembaga: "TK Permata Bangsa",
    jabatan: "Guru Kelas",
  },
  {
    id: 5,
    nama: "Sumber Tidak Jelas",
    email: "random123@yopmail.com",
    noHp: "0800-0000-0000",
    role: "guru",
    nik: "0000000000000000",
    tanggalDaftar: "2024-10-30",
    status: "ditolak",
    namaLembaga: "Sekolah ABC",
    jabatan: "Guru Kelas",
    catatanReject: "NIK tidak valid dan nama lembaga tidak ditemukan dalam database.",
  },
];

const statusLabel: Record<Status, string> = {
  pending: "Menunggu",
  disetujui: "Disetujui",
  ditolak: "Ditolak",
};

const statusColor: Record<Status, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  disetujui: "bg-green-100 text-green-700",
  ditolak: "bg-red-100 text-red-700",
};

const roleLabel: Record<Role, string> = {
  guru: "Guru",
  ortu: "Orang Tua",
};

const roleColor: Record<Role, string> = {
  guru: "bg-blue-100 text-blue-700",
  ortu: "bg-purple-100 text-purple-700",
};

export default function VerifikasiAkunPage() {
  const [data, setData] = useState<Pendaftar[]>(dummyPendaftar);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | "">("");
  const [filterRole, setFilterRole] = useState<Role | "">("");
  const [selectedUser, setSelectedUser] = useState<Pendaftar | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [catatanReject, setCatatanReject] = useState("");
  const [rejectTargetId, setRejectTargetId] = useState<number | null>(null);

  const filtered = data.filter((d) => {
    const matchSearch =
      d.nama.toLowerCase().includes(search.toLowerCase()) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.nik.includes(search);
    const matchStatus = filterStatus ? d.status === filterStatus : true;
    const matchRole = filterRole ? d.role === filterRole : true;
    return matchSearch && matchStatus && matchRole;
  });

  const handleSetujui = (id: number) => {
    setData(data.map((d) => d.id === id ? { ...d, status: "disetujui" } : d));
    if (selectedUser?.id === id) setSelectedUser({ ...selectedUser, status: "disetujui" });
  };

  const handleTolakConfirm = () => {
    if (!rejectTargetId) return;
    setData(data.map((d) =>
      d.id === rejectTargetId ? { ...d, status: "ditolak", catatanReject } : d
    ));
    if (selectedUser?.id === rejectTargetId) {
      setSelectedUser({ ...selectedUser, status: "ditolak", catatanReject });
    }
    setShowRejectModal(false);
    setCatatanReject("");
    setRejectTargetId(null);
  };

  const openRejectModal = (id: number) => {
    setRejectTargetId(id);
    setCatatanReject("");
    setShowRejectModal(true);
  };

  const pendingCount = data.filter((d) => d.status === "pending").length;

  return (
    <div className="w-full font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-500 text-white rounded-lg p-2">
            <ShieldCheck size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Verifikasi Akun</h1>
            <p className="text-xs text-gray-400">
              {pendingCount} pendaftar menunggu verifikasi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Role */}
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as Role | "")}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
          >
            <option value="">Semua Role</option>
            <option value="guru">Guru</option>
            <option value="ortu">Orang Tua</option>
          </select>

          {/* Filter Status */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as Status | "")}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="disetujui">Disetujui</option>
            <option value="ditolak">Ditolak</option>
          </select>

          {/* Search */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, email, NIK..."
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs w-56"
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[50px] border-r border-gray-300">No</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Nama</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Role</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">NIK</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Tgl. Daftar</th>
              <th className="px-5 py-3 text-center text-xs font-bold text-gray-700 border-r border-gray-300">Status</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[180px]">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filtered.map((d, i) => (
              <tr key={d.id} className="hover:bg-gray-50">
                <td className="text-center px-4 py-3 border-r border-gray-200 text-gray-500">{i + 1}</td>
                <td className="px-5 py-3 border-r border-gray-200">
                  <p className="font-medium text-gray-800">{d.nama}</p>
                  <p className="text-xs text-gray-400">{d.email}</p>
                </td>
                <td className="px-5 py-3 border-r border-gray-200">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor[d.role]}`}>
                    {roleLabel[d.role]}
                  </span>
                </td>
                <td className="px-5 py-3 border-r border-gray-200 text-gray-600 text-xs font-mono">
                  {d.nik}
                </td>
                <td className="px-5 py-3 border-r border-gray-200 text-gray-600 text-xs">
                  {d.tanggalDaftar}
                </td>
                <td className="px-5 py-3 border-r border-gray-200 text-center">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[d.status]}`}>
                    {statusLabel[d.status]}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-1.5">
                    {/* Detail */}
                    <button
                      onClick={() => setSelectedUser(d)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                    >
                      <Eye size={12} /> Detail
                    </button>

                    {/* Setujui - hanya jika pending */}
                    {d.status === "pending" && (
                      <>
                        <button
                          onClick={() => handleSetujui(d.id)}
                          className="bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                        >
                          <CheckCircle size={12} /> Setujui
                        </button>
                        <button
                          onClick={() => openRejectModal(d.id)}
                          className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                        >
                          <XCircle size={12} /> Tolak
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DETAIL */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div>
                <h2 className="font-bold text-gray-800 text-base">{selectedUser.nama}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleColor[selectedUser.role]}`}>
                    {roleLabel[selectedUser.role]}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor[selectedUser.status]}`}>
                    {statusLabel[selectedUser.status]}
                  </span>
                </div>
              </div>
              <button onClick={() => setSelectedUser(null)} className="text-gray-400 hover:text-gray-600 text-xl font-bold">✕</button>
            </div>

            {/* Modal Body */}
            <div className="px-6 py-4 space-y-3 max-h-[70vh] overflow-y-auto">

              <Section title="Informasi Akun">
                <Row label="Email" value={selectedUser.email} />
                <Row label="No. HP" value={selectedUser.noHp} />
                <Row label="Tgl. Daftar" value={selectedUser.tanggalDaftar} />
              </Section>

              <Section title="Data Identitas">
                <Row label="NIK" value={selectedUser.nik} mono />
              </Section>

              {selectedUser.role === "guru" && (
                <Section title="Data Verifikasi Guru">
                  <Row label="NIP / No. Pegawai" value={selectedUser.nipNoPegawai || "-"} />
                  <Row label="Jabatan" value={selectedUser.jabatan || "-"} />
                  <Row label="Nama Lembaga" value={selectedUser.namaLembaga || "-"} />
                  <Row
                    label="Surat Tugas"
                    value={selectedUser.suratTugas
                      ? <span className="text-blue-500 underline cursor-pointer">{selectedUser.suratTugas}</span>
                      : <span className="text-gray-400 italic">Tidak diupload</span>
                    }
                  />
                </Section>
              )}

              {selectedUser.role === "ortu" && (
                <Section title="Data Verifikasi Orang Tua">
                  <Row label="Hubungan" value={selectedUser.hubungan || "-"} />
                  <Row label="Nama Anak" value={selectedUser.namaAnak || "-"} />
                  <Row label="Kelas Anak" value={selectedUser.kelasAnak || "-"} />
                  <Row label="Alamat" value={selectedUser.alamat || "-"} />
                  <Row
                    label="Foto KTP"
                    value={selectedUser.fotoKtp
                      ? <span className="text-blue-500 underline cursor-pointer">{selectedUser.fotoKtp}</span>
                      : <span className="text-gray-400 italic">Tidak diupload</span>
                    }
                  />
                </Section>
              )}

              {selectedUser.status === "ditolak" && selectedUser.catatanReject && (
                <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-xs text-red-700">
                  <p className="font-semibold mb-1">Alasan Penolakan:</p>
                  <p>{selectedUser.catatanReject}</p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            {selectedUser.status === "pending" && (
              <div className="flex gap-2 px-6 py-4 border-t border-gray-200">
                <button
                  onClick={() => { handleSetujui(selectedUser.id); setSelectedUser(null); }}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <CheckCircle size={15} /> Setujui
                </button>
                <button
                  onClick={() => { openRejectModal(selectedUser.id); setSelectedUser(null); }}
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-lg flex items-center justify-center gap-1.5"
                >
                  <XCircle size={15} /> Tolak
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL REJECT */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm shadow-xl p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle size={20} className="text-red-500" />
              </div>
              <div>
                <h2 className="font-bold text-gray-800">Tolak Pendaftaran</h2>
                <p className="text-xs text-gray-400">Berikan alasan penolakan</p>
              </div>
            </div>

            <textarea
              rows={3}
              value={catatanReject}
              onChange={(e) => setCatatanReject(e.target.value)}
              placeholder="Contoh: NIK tidak valid, data tidak sesuai, dsb."
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 bg-gray-50 resize-none"
            />

            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 border border-gray-200 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleTolakConfirm}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold py-2 rounded-lg"
              >
                Konfirmasi Tolak
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper components
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">{title}</p>
      <div className="bg-gray-50 rounded-lg border border-gray-200 divide-y divide-gray-200">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex justify-between items-start px-3 py-2 gap-4">
      <span className="text-xs text-gray-500 shrink-0">{label}</span>
      <span className={`text-xs text-gray-800 text-right ${mono ? "font-mono" : ""}`}>{value}</span>
    </div>
  );
}