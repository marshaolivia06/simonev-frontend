'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showPopup, setShowPopup] = useState(false)
  const [roleText, setRoleText] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    setError('')
    setLoading(true)

    try {
      // 1. Login
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      })

      const data = await res.json()

      if (!data.success) {
        setError(data.message || 'Username atau password salah.')
        setLoading(false)
        return
      }

      // 2. Bersihkan sesi lama, lalu simpan token & user ke localStorage
      localStorage.clear() // ← TAMBAHAN: hapus data sesi lama
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('role', data.user.role)

      // 3. Ambil data profil
      const profileRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/profil`,
        {
          headers: {
            Authorization: `Bearer ${data.token}`,
            Accept: 'application/json',
          },
        }
      )

      const profileData = await profileRes.json()

      if (profileData.success) {
        if (profileData.data.guru) {
          localStorage.setItem(
            'nama_guru',
            profileData.data.guru.nama_guru
          )
        }

        if (profileData.data.orang_tua) {
          localStorage.setItem(
            'nama_ortu',
            profileData.data.orang_tua.nama_orangtua
          )
        }
      }

      setRoleText(data.user.role)
      setShowPopup(true)

      setTimeout(() => {
        setShowPopup(false)

        console.log('ROLE:', data.user.role)

        if (data.user.role === 'admin') {
          router.push('/admin/dashboard')
        } else if (data.user.role === 'guru') {
          router.push('/guru/dashboard')
        } else {
          router.push('/OrangTua/dashboard')
        }
      }, 2000)
    } catch (error) {
      console.error(error)
      setError('Gagal terhubung ke server.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1565C0] via-[#1976D2] to-[#64B5F6] flex items-center justify-center p-4">
      
      <div className="fixed w-80 h-80 bg-white/10 rounded-full blur-3xl -top-16 -left-16 pointer-events-none" />
      <div className="fixed w-80 h-80 bg-white/10 rounded-full blur-3xl -bottom-16 -right-16 pointer-events-none" />

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white w-80 rounded-2xl shadow-2xl p-8 text-center animate-popIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-lg font-semibold text-gray-800">
              Login Berhasil!
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Mengarahkan ke dashboard{' '}
              <span className="font-medium text-blue-600">
                {roleText}
              </span>
              ...
            </p>
          </div>
        </div>
      )}

      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl w-full max-w-md p-10 z-10">
        
        <div className="flex flex-col items-center mb-6 text-center">
          <Image
            src="/logo.png"
            alt="Logo SIMONEV"
            width={72}
            height={72}
            className="drop-shadow mb-2"
          />

          <h1 className="text-xl font-bold text-gray-800 leading-tight">
            SIMONEV PAUD
          </h1>

          <p className="text-xs text-gray-500 mt-0.5">
            Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-3">
          {error && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <input
            required
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          <div className="relative">
            <input
              required
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2.5 pr-11 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
            >
              {showPassword ? (
                <EyeOff size={16} />
              ) : (
                <Eye size={16} />
              )}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 text-white font-semibold text-sm rounded-xl mt-1 paud-btn disabled:opacity-60"
          >
            {loading ? 'Memproses...' : 'LOGIN'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-500 mt-4">
          Belum punya akun?{' '}
          <Link
            href="/register"
            className="text-blue-600 font-medium hover:underline"
          >
            Daftar di sini
          </Link>
        </p>

        <p className="text-xs text-center text-gray-400 mt-4">
          © 2026 SIMONEV PAUD
        </p>
      </div>

      <style jsx>{`
        .paud-btn {
          background: linear-gradient(135deg, #42a5f5, #1565c0);
          box-shadow: 0 4px 14px rgba(25, 118, 210, 0.3);
          transition: all 0.2s ease;
        }

        .paud-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(25, 118, 210, 0.4);
        }

        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.7);
          }

          70% {
            transform: scale(1.04);
          }

          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-popIn {
          animation: popIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}