"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus, Search, Users } from "lucide-react";

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
  email: string;
  alamat: string;
  kelas: string;
}

const kelasList = [
  "TK A1", "TK A2", "TK A3",
  "TK B1", "TK B2", "TK B3",
  "Playgroup A", "Playgroup B"
];

const dummyData: Anak[] = [
  {
    id: 1,
    namaAnak: "Aisyah Putri Lestari",
    orangTua: "Siti Rahmawati",
    email: "siti.aisyah@gmail.com",
    alamat: "Jl. Hang Tuah No. 12, Batam Kota",
    kelas: "TK A1",
  },
  {
    id: 2,
    namaAnak: "Bima Alfarizi",
    orangTua: "Andi Pratama",
    email: "andi.bima@gmail.com",
    alamat: "Jl. Sudirman No. 45, Nagoya",
    kelas: "TK A2",
  },
  {
    id: 3,
    namaAnak: "Citra Anindya",
    orangTua: "Lina Marlina",
    email: "lina.citra@gmail.com",
    alamat: "Jl. Imam Bonjol No. 8, Lubuk Baja",
    kelas: "TK B1",
  },
  {
    id: 4,
    namaAnak: "Daffa Ramadhan",
    orangTua: "Rudi Hartono",
    email: "rudi.daffa@gmail.com",
    alamat: "Jl. Teuku Umar No. 22, Batu Aji",
    kelas: "TK B2",
  },
  {
    id: 5,
    namaAnak: "Elina Zahra",
    orangTua: "Maya Sari",
    email: "maya.elina@gmail.com",
    alamat: "Jl. Diponegoro No. 10, Sekupang",
    kelas: "TK A3",
  },
  {
    id: 6,
    namaAnak: "Fahri Maulana",
    orangTua: "Budi Santoso",
    email: "budi.fahri@gmail.com",
    alamat: "Jl. Yos Sudarso No. 5, Batam Center",
    kelas: "TK B3",
  },
  {
    id: 7,
    namaAnak: "Gita Larasati",
    orangTua: "Dewi Lestari",
    email: "dewi.gita@gmail.com",
    alamat: "Jl. Engku Putri No. 18, Nongsa",
    kelas: "Playgroup A",
  },
  {
    id: 8,
    namaAnak: "Hafiz Akbar",
    orangTua: "Ahmad Fauzi",
    email: "ahmad.hafiz@gmail.com",
    alamat: "Jl. Raja Ali Haji No. 9, Batam Kota",
    kelas: "Playgroup B",
  },
  {
    id: 9,
    namaAnak: "Intan Permata",
    orangTua: "Sri Wahyuni",
    email: "sri.intan@gmail.com",
    alamat: "Jl. Kartini No. 3, Sagulung",
    kelas: "TK A2",
  },
  {
    id: 10,
    namaAnak: "Johan Prasetyo",
    orangTua: "Eko Prasetyo",
    email: "eko.johan@gmail.com",
    alamat: "Jl. Marina City No. 7, Batam Center",
    kelas: "TK A1",
  },
  {
    id: 11,
    namaAnak: "Keysa Aulia Putri",
    orangTua: "Nanda Aulia",
    email: "nanda.keysa@gmail.com",
    alamat: "Jl. Bukit Indah No. 3, Batam Kota",
    kelas: "TK A1",
  },
  {
    id: 12,
    namaAnak: "Luthfi Hakim",
    orangTua: "Hendra Wijaya",
    email: "hendra.luthfi@gmail.com",
    alamat: "Jl. Seraya No. 11, Batu Ampar",
    kelas: "TK A2",
  },
  {
    id: 13,
    namaAnak: "Mira Safitri",
    orangTua: "Yuni Safitri",
    email: "yuni.mira@gmail.com",
    alamat: "Jl. Anggrek No. 6, Sagulung",
    kelas: "TK A3",
  },
  {
    id: 14,
    namaAnak: "Naufal Rizky",
    orangTua: "Rizky Firmansyah",
    email: "rizky.naufal@gmail.com",
    alamat: "Jl. Melati No. 14, Sekupang",
    kelas: "TK B1",
  },
  {
    id: 15,
    namaAnak: "Olivia Darmawan",
    orangTua: "Tina Darmawan",
    email: "tina.olivia@gmail.com",
    alamat: "Jl. Flamboyan No. 2, Batam Center",
    kelas: "TK B2",
  },
  {
    id: 16,
    namaAnak: "Putra Aditya",
    orangTua: "Dian Aditya",
    email: "dian.putra@gmail.com",
    alamat: "Jl. Kamboja No. 8, Lubuk Baja",
    kelas: "TK B3",
  },
  {
    id: 17,
    namaAnak: "Qonita Azzahra",
    orangTua: "Farida Hanum",
    email: "farida.qonita@gmail.com",
    alamat: "Jl. Dahlia No. 5, Nagoya",
    kelas: "TK A1",
  },
  {
    id: 18,
    namaAnak: "Rafi Ananda",
    orangTua: "Andi Ananda",
    email: "andi.rafi@gmail.com",
    alamat: "Jl. Mawar No. 19, Nongsa",
    kelas: "Playgroup A",
  },
  {
    id: 19,
    namaAnak: "Salsabila Nur",
    orangTua: "Nurul Hidayah",
    email: "nurul.salsa@gmail.com",
    alamat: "Jl. Melur No. 4, Batu Aji",
    kelas: "Playgroup B",
  },
  {
    id: 20,
    namaAnak: "Taufik Hidayat",
    orangTua: "Hidayat Sulaiman",
    email: "hidayat.taufik@gmail.com",
    alamat: "Jl. Hang Lekiu No. 17, Batam Kota",
    kelas: "TK A2",
  },
];

export default function DataAnakPage() {
  const [search, setSearch] = useState("");
  const [filterKelas, setFilterKelas] = useState("");
  const [data, setData] = useState<Anak[]>(dummyData);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<Anak | null>(null);

  const [form, setForm] = useState({
    namaAnak: "",
    orangTua: "",
    email: "",
    alamat: "",
    kelas: "TK A1",
  });

  const filtered = data.filter((a) => {
    const matchSearch =
      a.namaAnak.toLowerCase().includes(search.toLowerCase()) ||
      a.orangTua.toLowerCase().includes(search.toLowerCase()) ||
      a.email.toLowerCase().includes(search.toLowerCase()) ||
      a.alamat.toLowerCase().includes(search.toLowerCase());

    const matchKelas = filterKelas ? a.kelas === filterKelas : true;
    return matchSearch && matchKelas;
  });

  const handleTambah = () => {
    setEditData(null);
    setForm({
      namaAnak: "",
      orangTua: "",
      email: "",
      alamat: "",
      kelas: "TK A1",
    });
    setShowModal(true);
  };

  const handleEdit = (anak: Anak) => {
    setEditData(anak);
    setForm(anak);
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin hapus data ini?")) {
      setData(data.filter((a) => a.id !== id));
    }
  };

  const handleSimpan = () => {
    if (editData) {
      setData(data.map((a) => (a.id === editData.id ? { ...form, id: a.id } : a)));
    } else {
      const newId = data.length ? Math.max(...data.map((a) => a.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  const getInitials = (name: string) =>
    name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase();

  const avatarColors = [
    "bg-blue-100 text-blue-700",
    "bg-emerald-100 text-emerald-700",
    "bg-violet-100 text-violet-700",
    "bg-amber-100 text-amber-700",
    "bg-rose-100 text-rose-700",
  ];

  return (
    <div className="w-full font-sans">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="bg-green-500 text-white rounded-lg p-2">
            <Users size={18} />
          </div>
          <div>
            <h1 className="text-base font-semibold text-gray-900">Data Anak</h1>
            <p className="text-xs text-gray-400">{data.length} anak terdaftar</p>
          </div>
        </div>

        <div className="flex items-center gap-3">

          {/* FILTER */}
          <select
            value={filterKelas}
            onChange={(e) => setFilterKelas(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs"
          >
            <option value="">Semua Kelas</option>
            {kelasList.map((k) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          {/* SEARCH */}
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari anak..."
              className="bg-gray-50 border border-gray-200 rounded-lg pl-8 pr-4 py-2 text-xs w-56"
            />
          </div>

          {/* TOMBOL TAMBAH */}
          <button
            onClick={handleTambah}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-full text-sm flex items-center gap-1"
          >
            <Plus size={15} />
            Tambah
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full text-sm border-collapse">

          <thead>
            <tr className="bg-gray-200 border-b border-gray-300">
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[60px] border-r border-gray-300">No</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Nama Anak</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Orang Tua</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Email</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Alamat</th>
              <th className="px-5 py-3 text-left text-xs font-bold text-gray-700 border-r border-gray-300">Kelas</th>
              <th className="px-4 py-3 text-center text-xs font-bold text-gray-700 w-[160px]">Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-200">
            {filtered.map((a, i) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="text-center px-4 py-3 border-r border-gray-200 text-gray-500">
                  {i + 1}
                </td>
                <td className="px-5 py-3 border-r border-gray-200">
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${avatarColors[i % avatarColors.length]}`}>
                      {getInitials(a.namaAnak)}
                    </div>
                    <span className="font-medium text-gray-800">{a.namaAnak}</span>
                  </div>
                </td>
                <td className="px-5 py-3 border-r border-gray-200 text-gray-700">
                  {a.orangTua}
                </td>
                <td className="px-5 py-3 border-r border-gray-200 text-gray-600 text-xs">
                  {a.email}
                </td>
                <td className="px-5 py-3 border-r border-gray-200 text-gray-600 text-xs">
                  {a.alamat}
                </td>
                <td className="px-5 py-3 border-r border-gray-200 text-gray-700">
                  {a.kelas}
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(a)}
                      className="bg-green-500 hover:bg-green-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                    >
                      <Pencil size={12} /> Edit
                    </button>
                    <button
                      onClick={() => handleHapus(a.id)}
                      className="bg-red-500 hover:bg-red-600 text-white text-xs px-2.5 py-1 rounded-md flex items-center gap-1"
                    >
                      <Trash2 size={12} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md space-y-2">

            <input className="w-full border p-2 rounded" placeholder="Nama Anak"
              value={form.namaAnak}
              onChange={(e) => setForm({ ...form, namaAnak: e.target.value })} />

            <input className="w-full border p-2 rounded" placeholder="Orang Tua"
              value={form.orangTua}
              onChange={(e) => setForm({ ...form, orangTua: e.target.value })} />

            <input className="w-full border p-2 rounded" placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />

            <input className="w-full border p-2 rounded" placeholder="Alamat"
              value={form.alamat}
              onChange={(e) => setForm({ ...form, alamat: e.target.value })} />

            <select className="w-full border p-2 rounded"
              value={form.kelas}
              onChange={(e) => setForm({ ...form, kelas: e.target.value })}>
              {kelasList.map((k) => (
                <option key={k}>{k}</option>
              ))}
            </select>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setShowModal(false)} className="px-3 py-1 border rounded">
                Batal
              </button>
              <button onClick={handleSimpan} className="px-3 py-1 bg-green-500 text-white rounded">
                Simpan
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}