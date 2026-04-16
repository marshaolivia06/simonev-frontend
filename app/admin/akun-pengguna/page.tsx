"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";

interface User {
  id: number;
  username: string;
  role: string;
  password: string;
}

const dummyData: User[] = [];

export default function AkunPenggunaPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<User[]>(dummyData);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState<User | null>(null);
  const [form, setForm] = useState({
    username: "",
    role: "",
    password: "",
  });

  const filtered = data.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleTambah = () => {
    setEditData(null);
    setForm({ username: "", role: "", password: "" });
    setShowModal(true);
  };

  const handleEdit = (user: User) => {
    setEditData(user);
    setForm({
      username: user.username,
      role: user.role,
      password: user.password,
    });
    setShowModal(true);
  };

  const handleHapus = (id: number) => {
    if (confirm("Yakin ingin menghapus data ini?")) {
      setData(data.filter((u) => u.id !== id));
    }
  };

  const handleSimpan = () => {
    if (!form.username.trim() || !form.role.trim() || !form.password.trim()) {
      alert("Semua field wajib diisi!");
      return;
    }

    if (editData) {
      setData(
        data.map((u) => (u.id === editData.id ? { ...u, ...form } : u))
      );
    } else {
      const newId =
        data.length > 0 ? Math.max(...data.map((u) => u.id)) + 1 : 1;
      setData([...data, { id: newId, ...form }]);
    }

    setShowModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleTambah}
          className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-sm px-4 py-2 rounded-lg"
        >
          <Plus size={16} />
          tambah
        </button>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-full px-3 py-1 text-sm w-40"
        />
      </div>

      {/* Tabel */}
      <div className="bg-white border border-black">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-black w-16 py-1.5 text-center font-bold text-black">
                No
              </th>
              <th className="border border-black py-2 text-center font-bold text-black">
                Username
              </th>
              <th className="border border-black py-2 text-center font-bold text-black">
                Role
              </th>
              <th className="border border-black w-40 py-1.5 text-center font-bold text-black">
                Aksi
              </th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((user, index) => (
              <tr key={user.id}>
                <td className="border border-black text-center py-1.5 text-black font-medium">
                  {index + 1}.
                </td>

                <td className="border border-black px-3 py-2 text-black font-medium">
                  {user.username}
                </td>

                <td className="border border-black px-3 py-2 text-black font-medium">
                  {user.role}
                </td>

                <td className="border border-black text-center py-1.5">
                  <div className="flex items-center justify-center gap-1.5">
                    <button
                      onClick={() => handleEdit(user)}
                      className="flex items-center gap-1 text-xs bg-yellow-400 hover:bg-yellow-500 text-white px-2 py-1 rounded"
                    >
                      <Pencil size={11} /> Edit
                    </button>

                    <button
                      onClick={() => handleHapus(user.id)}
                      className="flex items-center gap-1 text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
                    >
                      <Trash2 size={11} /> Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {Array.from({ length: Math.max(0, 10 - filtered.length) }).map(
              (_, i) => (
                <tr key={i}>
                  <td className="border border-black py-2">&nbsp;</td>
                  <td className="border border-black py-2">&nbsp;</td>
                  <td className="border border-black py-2">&nbsp;</td>
                  <td className="border border-black py-2">&nbsp;</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-80">
            <h2 className="mb-4 font-semibold">
              {editData ? "Edit User" : "Tambah User"}
            </h2>

            <input
              type="text"
              placeholder="Username"
              value={form.username}
              onChange={(e) =>
                setForm({ ...form, username: e.target.value })
              }
              className="w-full border p-2 mb-3"
            />

            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              className="w-full border p-2 mb-3"
            />

            <select
              value={form.role}
              onChange={(e) =>
                setForm({ ...form, role: e.target.value })
              }
              className="w-full border p-2 mb-4"
            >
              <option value="">Pilih Role</option>
              <option value="Guru">Guru</option>
              <option value="Orang Tua">Orang Tua</option>
            </select>

            <div className="flex justify-end gap-2">
              <button onClick={() => setShowModal(false)}>Batal</button>
              <button
                onClick={handleSimpan}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}