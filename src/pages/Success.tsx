// src/pages/Success.tsx → VERSI FINAL CUAN!
import { Link, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { CheckCircle2, Sparkles } from 'lucide-react'

export default function Success() {
  const location = useLocation()
  const { method, amount } = (location.state as { method?: string; amount?: number }) || {}

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/30 flex items-center justify-center px-6 py-20">
        <div className="max-w-2xl w-full text-center">
          {/* Icon Check Besar + Efek Glow */}
          <div className="relative inline-block mb-12">
            <CheckCircle2 className="w-48 h-48 text-green-400 drop-shadow-2xl animate-pulse" />
            <Sparkles className="absolute -top-4 -right-4 w-16 h-16 text-yellow-400 animate-ping" />
            <Sparkles className="absolute -bottom-6 -left-6 w-12 h-12 text-rose-400 animate-ping delay-300" />
          </div>

          {/* Judul */}
          <h1 className="text-6xl md:text-8xl font-black mb-6 gradient-text drop-shadow-2xl animate-bounce-slow">
            BERHASIL!
          </h1>

          <p className="text-2xl md:text-4xl font-bold text-white mb-4">
            Pembayaran via <span className="text-rose-400">{method || 'QRIS'}</span> sukses!
          </p>

          {amount && (
            <p className="text-3xl md:text-5xl font-black text-green-400 mb-8">
              {new Intl.NumberFormat('id-ID', {
                style: 'currency',
                currency: 'IDR',
                minimumFractionDigits: 0,
              }).format(amount)}
            </p>
          )}

          <p className="text-xl md:text-2xl text-gray-300 mb-12">
            Diamond akan masuk otomatis dalam <span className="text-rose-400 font-bold">1-5 menit</span>
          </p>

          {/* Tombol */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/dashboard"
              className="btn-gradient px-12 py-6 rounded-2xl text-2xl font-black hover:scale-110 transition shadow-2xl hover:shadow-rose-500/70"
            >
              Lihat Riwayat
            </Link>
            <Link
              to="/"
              className="border-2 border-rose-500/50 text-rose-400 px-12 py-6 rounded-2xl text-2xl font-bold hover:bg-rose-500/10 transition"
            >
              Kembali ke Home
            </Link>
          </div>

          {/* Bonus Pesan */}
          <p className="mt-16 text-lg text-gray-500">
            Terima kasih telah top up di <span className="text-rose-400 font-bold">FomoGame</span> — Termurah & Tercepat!
          </p>
        </div>
      </div>
      <Footer />
    </>
  )
}