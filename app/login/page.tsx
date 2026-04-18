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

    let role: string | null = null

    if (username === 'admin') role = 'admin'
    else if (username === 'guru') role = 'guru'
    else if (username === 'orangtua') role = 'orangtua'

    if (!role) {
      setError('Username or password is wrong')
      return
    }

    setRoleText(role)
    setShowPopup(true)

    setTimeout(() => {
      setShowPopup(false)

      if (role === 'admin') router.push('/admin/dashboard')
      else if (role === 'guru') router.push('/guru/dashboard')
      else router.push('/orangtua/dashboard')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#1976D2] flex items-center justify-center p-4">

      {/* POPUP */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white w-[360px] rounded-3xl shadow-2xl p-10 text-center animate-popIn">

            <div className="w-24 h-24 mx-auto mb-5 rounded-full bg-green-100 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>

            <h2 className="text-xl font-semibold text-gray-800">
              Login Berhasil
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Mengarahkan ke dashboard <b>{roleText}</b>...
            </p>

          </div>
        </div>
      )}

      {/* LOGIN BOX */}
      <div className="bg-[#d9d9d9] rounded-[20px] flex overflow-hidden max-w-3xl w-full">
        {/* LEFT */}
        <div className="flex-1 p-10 flex flex-col items-center justify-center text-center border-r border-[#bbb] space-y-2">
          <Image
            src="/logo simonev.png"
            alt="Logo SIMONEV"
            width={200}
            height={200}
          />
          <div className="text-xs text-gray-700 leading-tight">
            Sistem Monitoring dan Evaluasi<br />
            Perkembangan Anak Usia Dini
          </div>
        </div>

        {/* RIGHT */}
        <form
          onSubmit={handleLogin}
          className="flex-1 p-10 flex flex-col justify-center"
        >

          <p className="text-lg font-semibold text-gray-800 mb-5">
            Silahkan Login ke sistem<br />untuk melanjutkan !
          </p>

         {/* ERROR FIXED SPACE */}
<div className="min-h-[2px] mb-2">
  {error && (
    <p className="text-xs text-red-500">
      {error}
    </p>
  )}
</div>

          {/* USERNAME */}
          <input
            required
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm mb-3 outline-none focus:border-[#1a7bbf]"
          />

          {/* PASSWORD */}
          <input
            required
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-sm mb-5 outline-none focus:border-[#1a7bbf]"
          />

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full py-2.5 bg-[#1a7bbf] text-white font-bold text-sm rounded-lg hover:bg-[#155f99] transition"
          >
            LOGIN
          </button>

        </form>

      </div>

      {/* ANIMASI POPUP */}
      <style jsx>{`
        @keyframes popIn {
          0% {
            opacity: 0;
            transform: scale(0.6);
          }
          60% {
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-popIn {
          animation: popIn 0.35s ease-out;
        }
      `}</style>

    </div>
  )
}