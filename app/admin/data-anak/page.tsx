"use client";

import { useState } from "react";
import { Search, Users, Pencil, Trash2, Plus, X } from "lucide-react";

interface Anak {
  id: number;
  namaAnak: string;
  orangTua: string;
  pekerjaanOrangTua: string;
  email: string;
  alamat: string;
  kelas: string;
  jenisKelamin: string;
  tanggalLahir: string;
}

const dataAwal: Anak[] = [
  { id: 1,  namaAnak: "Aisyah Azizah",   orangTua: "Sari Sri Hastuti", pekerjaanOrangTua: "Guru",        email: "sari@email.com",   alamat: "Jl. Melati No. 1",      kelas: "TK A1", jenisKelamin: "P", tanggalLahir: "2019-03-12" },
  { id: 2,  namaAnak: "Bima Sakti",       orangTua: "Andi Saputra",    pekerjaanOrangTua: "Wiraswasta",  email: "andi@email.com",   alamat: "Jl. Mawar No. 5",       kelas: "TK B1", jenisKelamin: "L", tanggalLahir: "2018-07-24" },
  { id: 3,  namaAnak: "Citra Lestari",    orangTua: "Lina Wijaya",     pekerjaanOrangTua: "Pegawai",     email: "lina@email.com",   alamat: "Jl. Kenanga No. 3",     kelas: "TK A2", jenisKelamin: "P", tanggalLahir: "2019-01-05" },
  { id: 4,  namaAnak: "Dafa Ramadhan",    orangTua: "Budi Santoso",    pekerjaanOrangTua: "TNI",         email: "budi@email.com",   alamat: "Jl. Anggrek No. 7",     kelas: "TK B2", jenisKelamin: "L", tanggalLahir: "2017-11-30" },
  { id: 5,  namaAnak: "Elsa Nabila",      orangTua: "Dewi Rahayu",     pekerjaanOrangTua: "Dokter",      email: "dewi@email.com",   alamat: "Jl. Dahlia No. 2",      kelas: "TK A1", jenisKelamin: "P", tanggalLahir: "2018-05-17" },
  { id: 6,  namaAnak: "Farhan Maulana",   orangTua: "Hendra Kusuma",   pekerjaanOrangTua: "Pengusaha",   email: "hendra@email.com", alamat: "Jl. Flamboyan No. 9",   kelas: "TK A3", jenisKelamin: "L", tanggalLahir: "2019-08-09" },
  { id: 7,  namaAnak: "Ghina Aulia",      orangTua: "Rina Marlina",    pekerjaanOrangTua: "Bidan",       email: "rina@email.com",   alamat: "Jl. Tulip No. 4",       kelas: "TK B3", jenisKelamin: "P", tanggalLahir: "2017-04-22" },
  { id: 8,  namaAnak: "Hafiz Pratama",    orangTua: "Yusuf Hakim",     pekerjaanOrangTua: "Polisi",      email: "yusuf@email.com",  alamat: "Jl. Bougenville No. 6", kelas: "TK B1", jenisKelamin: "L", tanggalLahir: "2018-12-01" },
  { id: 9,  namaAnak: "Indira Putri",     orangTua: "Nita Sari",       pekerjaanOrangTua: "Ibu Rumah Tangga", email: "nita@email.com", alamat: "Jl. Cempaka No. 8", kelas: "TK A2", jenisKelamin: "P", tanggalLahir: "2019-06-14" },
  { id: 10, namaAnak: "Jaka Tarub",       orangTua: "Agus Priyono",    pekerjaanOrangTua: "Petani",      email: "agus@email.com",   alamat: "Jl. Seroja No. 10",     kelas: "TK B2", jenisKelamin: "L", tanggalLahir: "2017-09-03" },
];

const kelasList = ["TK A1","TK A2","TK A3","TK B1","TK B2","TK B3","Playgroup A","Playgroup B"];

const avatarColors = [
  "bg-blue-100 text-blue-600","bg-green-100 text-green-600",
  "bg-purple-100 text-purple-600","bg-pink-100 text-pink-600",
  "bg-orange-100 text-orange-600","bg-teal-100 text-teal-600",
  "bg-yellow-100 text-yellow-600","bg-red-100 text-red-600",
];

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const emptyForm = { namaAnak: "", orangTua: "", pekerjaanOrangTua: "", email: "", alamat: "", kelas: "TK A1", jenisKelamin: "L", tanggalLahir: "" };

export default function DataAnakAdminPage() {
  const [search, setSearch]           = useState("");
  const [kelasFilter, setKelasFilter] = useState("Semua");
  const [data, setData]               = useState<Anak[]>(dataAwal);
  const [showModal, setShowModal]     = useState(false);
  const [showHapus, setShowHapus]     = useState(false);
  const [hapusId, setHapusId]         = useState<number | null>(null);
  const [editData, setEditData]       = useState<Anak | null>(null);
  const [form, setForm]               = useState(emptyForm);

  const filtered = data.filter((a) => {
    const matchSearch =
      a.namaAnak.toLowerCase().includes(search.toLowerCase()) ||
      a.orangTua.toLowerCase().includes(search.toLowerCase());
    const matchKelas = kelasFilter === "Semua" || a.kelas === kelasFilter;
    return matchSearch && matchKelas;
  });

  const handleTambah = () => { setEditData(null); setForm(emptyForm); setShowModal(true); };
  const handleEdit   = (anak: Anak) => {
    setEditData(anak);
    setForm({ namaAnak: anak.namaAnak, orangTua: anak.orangTua, pekerjaanOrangTua: anak.pekerjaanOrangTua, email: anak.email, alamat: anak.alamat, kelas: anak.kelas, jenisKelamin: anak.jenisKelamin, tanggalLahir: anak.tanggalLahir });
    setShowModal(true);
  };
  const handleHapusKonfirm = (id: number) => { setHapusId(id); setShowHapus(true); };
  const handleHapus = () => {
    if (hapusId !== null) setData(data.filter((a) => a.id !== hapusId));
    setShowHapus(false); setHapusId(null);
  };
  const handleSimpan = () => {
    if (!form.namaAnak.trim() || !form.orangTua.trim()) return;
    if (editData) {
      setData(data.map((a) => a.id === editData.id ? { ...a, ...form } : a));
    } else {
      const newId = data.length > 0 ? Math.max(...data.map((a) => a.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }
    setShowModal(false);
  };

  const inputCls = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-300";
  const labelCls = "block text-xs font-medium text-gray-600 mb-1.5";

  return (
    <div className="max-w-full">

      {/* Modal Tambah / Edit */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 overflow-hidden">

            {/* Header Modal */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-sm font-semibold text-gray-900">
                  {editData ? "Edit Data Anak" : "Tambah Data Anak"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editData ? "Perbarui informasi anak" : "Isi data anak baru"}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
                <X size={15} />
              </button>
            </div>

            {/* Body Modal */}
            <div className="px-6 py-5 space-y-3 max-h-[70vh] overflow-y-auto">

              <div>
                <label className={labelCls}>Nama Anak</label>
                <input type="text" placeholder="Masukkan nama anak" value={form.namaAnak}
                  onChange={(e) => setForm({ ...form, namaAnak: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Nama Orang Tua</label>
                <input type="text" placeholder="Masukkan nama orang tua" value={form.orangTua}
                  onChange={(e) => setForm({ ...form, orangTua: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Pekerjaan Orang Tua</label>
                <input type="text" placeholder="Contoh: Wiraswasta, Guru, PNS" value={form.pekerjaanOrangTua}
                  onChange={(e) => setForm({ ...form, pekerjaanOrangTua: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Email Orang Tua</label>
                <input type="email" placeholder="email@contoh.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputCls} />
              </div>

              <div>
                <label className={labelCls}>Alamat</label>
                <input type="text" placeholder="Masukkan alamat lengkap" value={form.alamat}
                  onChange={(e) => setForm({ ...form, alamat: e.target.value })} className={inputCls} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Kelas</label>
                  <select value={form.kelas} onChange={(e) => setForm({ ...form, kelas: e.target.value })} className={inputCls}>
                    {kelasList.map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelCls}>Jenis Kelamin</label>
                  <select value={form.jenisKelamin} onChange={(e) => setForm({ ...form, jenisKelamin: e.target.value })} className={inputCls}>
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className={labelCls}>Tanggal Lahir</label>
                <input type="date" value={form.tanggalLahir}
                  onChange={(e) => setForm({ ...form, tanggalLahir: e.target.value })} className={inputCls} />
              </div>

            </div>

            {/* Footer Modal */}
            <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button onClick={() => setShowModal(false)}
                className="border border-gray-200 text-gray-600 hover:bg-gray-100 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                Batal
              </button>
              <button onClick={handleSimpan}
                className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                {editData ? "Simpan Perubahan" : "Tambah Data"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Modal Konfirmasi Hapus */}
      {showHapus && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-80 text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">Hapus Data Anak?</h3>
            <p className="text-sm text-gray-500 mb-5">Data yang dihapus tidak dapat dikembalikan.</p>
            <div className="flex gap-2">
              <button onClick={() => setShowHapus(false)} className="flex-1 border border-gray-300 text-gray-600 text-sm py-2 rounded-lg hover:bg-gray-50">Batal</button>
              <button onClick={handleHapus} className="flex-1 bg-red-500 hover:bg-red-600 text-white text-sm py-2 rounded-lg">Hapus</button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mt-0.5">
            <Users size={20} className="text-blue-600" />
          </div>
          <div>
            <p className="text-lg font-bold text-gray-800 leading-tight">Data Anak</p>
            <p className="text-sm text-gray-500">{data.length} anak terdaftar</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleTambah}
            className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm font-medium px-4 py-2 rounded-full transition-colors">
            <Plus size={15} /> Tambah Anak
          </button>
          <select value={kelasFilter} onChange={(e) => setKelasFilter(e.target.value)}
            className="bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none text-gray-700">
            <option value="Semua">Semua Kelas</option>
            {kelasList.map((k) => <option key={k} value={k}>{k}</option>)}
          </select>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Cari anak..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-gray-100 rounded-full pl-8 pr-4 py-2 text-sm focus:outline-none w-44" />
          </div>
        </div>
      </div>

      {/* Tabel */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm" style={{ minWidth: "1000px", borderCollapse: "collapse" }}>
            <thead>
              <tr className="bg-gray-200">
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-10 border-r border-b border-gray-300">No</th>
                <th className="px-3 py-3 text-left   font-bold text-black whitespace-nowrap min-w-[150px] border-r border-b border-gray-300">Nama Anak</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap min-w-[110px] border-r border-b border-gray-300">Jenis Kelamin</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-28 border-r border-b border-gray-300">Tanggal Lahir</th>
                <th className="px-3 py-3 text-left   font-bold text-black whitespace-nowrap min-w-[130px] border-r border-b border-gray-300">Nama Orang Tua</th>
                <th className="px-3 py-3 text-left   font-bold text-black whitespace-nowrap min-w-[120px] border-r border-b border-gray-300">Pekerjaan Orang Tua</th>
                <th className="px-3 py-3 text-left   font-bold text-black whitespace-nowrap min-w-[140px] border-r border-b border-gray-300">Email</th>
                <th className="px-3 py-3 text-left   font-bold text-black whitespace-nowrap min-w-[140px] border-r border-b border-gray-300">Alamat</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-16 border-r border-b border-gray-300">Kelas</th>
                <th className="px-3 py-3 text-center font-bold text-black whitespace-nowrap w-28 border-b border-gray-300">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-12 text-gray-400 text-sm">Belum ada data anak</td>
                </tr>
              ) : (
                filtered.map((anak, index) => (
                  <tr key={anak.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0">
                    <td className="px-3 py-3 text-center text-gray-700 border-r border-gray-200">{index + 1}</td>
                    <td className="px-3 py-3 border-r border-gray-200">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}>
                          {getInitials(anak.namaAnak)}
                        </div>
                        <span className="font-medium text-gray-800 whitespace-nowrap">{anak.namaAnak}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center border-r border-gray-200">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${anak.jenisKelamin === "P" ? "bg-pink-100 text-pink-600" : "bg-blue-100 text-blue-600"}`}>
                        {anak.jenisKelamin === "P" ? "Perempuan" : "Laki-laki"}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-center text-gray-700 text-xs whitespace-nowrap border-r border-gray-200">{anak.tanggalLahir}</td>
                    <td className="px-3 py-3 text-gray-700 text-xs whitespace-nowrap border-r border-gray-200">{anak.orangTua}</td>
                    <td className="px-3 py-3 text-gray-700 text-xs whitespace-nowrap border-r border-gray-200">{anak.pekerjaanOrangTua}</td>
                    <td className="px-3 py-3 text-gray-700 text-xs border-r border-gray-200">{anak.email}</td>
                    <td className="px-3 py-3 text-gray-700 text-xs border-r border-gray-200">{anak.alamat}</td>
                    <td className="px-3 py-3 text-center text-gray-700 text-xs whitespace-nowrap border-r border-gray-200">{anak.kelas}</td>
                    <td className="px-3 py-3">
                      <div className="flex justify-center gap-1.5 whitespace-nowrap">
                        <button onClick={() => handleEdit(anak)}
                          className="flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded-md transition-colors">
                          <Pencil size={11} /> Edit
                        </button>
                        <button onClick={() => handleHapusKonfirm(anak.id)}
                          className="flex items-center gap-1 bg-red-500 hover:bg-red-600 text-white text-xs px-2 py-1 rounded-md transition-colors">
                          <Trash2 size={11} /> Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
