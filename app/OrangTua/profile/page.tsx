"use client";

import { useState } from "react";
import { User, CheckCircle } from "lucide-react";

export default function ProfilePage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [telepon, setTelepon] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowSuccess(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">

      {/* ── SUCCESS POPUP ── */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-80 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-800 mb-1">
              Profil Berhasil Diperbarui
            </h3>
            <p className="text-sm text-gray-500 mb-5">
              Perubahan data profil kamu telah tersimpan.
            </p>
            <button
              onClick={() => setShowSuccess(false)}
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              Oke
            </button>
          </div>
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h2 className="text-base font-semibold text-gray-800 mb-5">My Profile</h2>

        {/* Avatar + Upload */}
        <div className="flex items-center gap-6 mb-6">
          <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center border">
            {image ? (
              <img src={image} alt="profile" className="w-full h-full object-cover" />
            ) : (
              <User size={42} className="text-gray-500" />
            )}
          </div>
          <input
            type="file"
            onChange={handleImageChange}
            className="text-sm text-gray-600
              file:mr-3 file:py-1.5 file:px-3
              file:rounded-md file:border-0
              file:bg-gray-200 file:text-gray-700
              hover:file:bg-gray-300 cursor-pointer"
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} noValidate={false}>
          <div className="space-y-4">

            <div>
              <label className="text-sm text-gray-600">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Nomor Telepon</label>
              <input
                type="text"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
                required
                className="w-full mt-1 border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>

          </div>

          <div className="flex justify-end mt-6">
            <button
              type="submit"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg text-sm font-medium transition active:scale-95"
            >
              Simpan
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}