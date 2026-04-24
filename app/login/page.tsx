'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPopup, setShowPopup] = useState(false)
  const [roleText, setRoleText] = useState('')
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    const roleMap: Record<string, string> = {
      admin: 'admin',
      guru: 'guru',
      orangtua: 'orangtua',
    }

    const role = roleMap[username]
    if (!role) return setError('Username atau password salah.')

    setRoleText(role)
    setShowPopup(true)

    setTimeout(() => {
      setShowPopup(false)
      if (role === 'admin') router.push('/admin/dashboard')
      else if (role === 'guru') router.push('/guru/dashboard')
      else router.push('/OrangTua/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1565C0] via-[#1976D2] to-[#64B5F6] flex items-center justify-center p-4">

      {/* Background accents */}
      <div className="fixed w-80 h-80 bg-white/10 rounded-full blur-3xl -top-16 -left-16 pointer-events-none" />
      <div className="fixed w-80 h-80 bg-white/10 rounded-full blur-3xl -bottom-16 -right-16 pointer-events-none" />

      {/* Success Popup */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 backdrop-blur-sm">
          <div className="bg-white w-80 rounded-2xl shadow-2xl p-8 text-center animate-popIn">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Login Berhasil!</h2>
            <p className="text-sm text-gray-500 mt-1">
              Mengarahkan ke dashboard <span className="font-medium text-blue-600">{roleText}</span>...
            </p>
          </div>
        </div>
      )}

      {/* Login Card */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl shadow-2xl w-full max-w-md p-10 z-10">

        {/* Logo & Title */}
        <div className="flex flex-col items-center mb-4 text-center">
          <Image
            src="/logo.png"
            alt="Logo SIMONEV"
            width={72}
            height={72}
            className="drop-shadow mb-2"
          />
          <h1 className="text-xl font-bold text-gray-800 leading-tight">SIMONEV PAUD</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Sistem Monitoring & Evaluasi Perkembangan Anak Usia Dini
          </p>
        </div>

        {/* Form (TIDAK DIUBAH) */}
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

          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-blue-400 transition"
          />

          {/* BUTTON FIX */}
          <button
            type="submit"
            className="w-full py-2.5 text-white font-semibold text-sm rounded-xl mt-1 paud-btn"
          >
            LOGIN
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">© 2026 SIMONEV PAUD</p>
      </div>

      {/* STYLE */}
      <style jsx>{`
        .paud-btn {
          background: linear-gradient(135deg, #42A5F5, #1565C0);
          box-shadow: 0 4px 14px rgba(25,118,210,0.3);
          transition: all 0.2s ease;
        }

        .paud-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(25,118,210,0.4);
        }

        @keyframes popIn {
          0% { opacity: 0; transform: scale(0.7); }
          70% { transform: scale(1.04); }
          100% { opacity: 1; transform: scale(1); }
        }

        .animate-popIn {
          animation: popIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}