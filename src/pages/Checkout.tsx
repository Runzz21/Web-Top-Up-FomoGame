// src/pages/Checkout.tsx
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { ArrowLeft, User, Package, Lock, Copy } from 'lucide-react'

// IMPORT GAMBAR DARI src/assets/game-icons/
import mlbb from '../assets/game-icons/mobile-legends.jpg'
import ff from '../assets/game-icons/free-fire.jpg'
import pubg from '../assets/game-icons/pubg-mobile.png'
import valorant from '../assets/game-icons/valorant.jpg'
import genshin from '../assets/game-icons/genshin-impact.jpg'
import roblox from '../assets/game-icons/roblox.png'
import codm from '../assets/game-icons/cod-mobile.jpg'
import honkai from '../assets/game-icons/honkai-star-rail.jpg'
import magicchess from '../assets/game-icons/magic-chess-gogo.jpeg'
import ballpool from '../assets/game-icons/ballpool.jpg'
import arenaofvalor from '../assets/game-icons/arena-of-valor.jpg'
import dragonnest from '../assets/game-icons/dragon-nest.png'
import efootball from '../assets/game-icons/efootball.png'
import racingmaster from '../assets/game-icons/racing-master.jpg'
import sausageman from '../assets/game-icons/sausage-man.png'
import stumbleguys from '../assets/game-icons/stumble-guys.png'

// IMPORT GAMBAR DARI src/assets/payment-logos/
import alfamart from '../assets/payment-logos/alfamart.webp'
import banktransfer from '../assets/payment-logos/bank-transfer.webp'
import dana from '../assets/payment-logos/dana.webp'
import gopay from '../assets/payment-logos/gopay.webp'
import indomaret from '../assets/payment-logos/indomaret.webp'
import kartukredit from '../assets/payment-logos/kartu-kredit.webp'
import ovo from '../assets/payment-logos/ovo.webp'
import qris from '../assets/payment-logos/qris.webp'
import shoopepay from '../assets/payment-logos/shoopepay.webp'

const payments = ['QRIS', 'OVO', 'GoPay', 'ShopeePay', 'DANA', 'Alfamart', 'Indomaret', 'Bank Transfer', 'Kartu Kredit']

const gameLogoMap: Record<string, string> = {
  'Mobile Legends': mlbb,
  'Free Fire': ff,
  'PUBG Mobile': pubg,
  'Valorant': valorant,
  'Genshin Impact': genshin,
  'Roblox': roblox,
  'Call of Duty Mobile': codm,
  'Honkai: Star Rail': honkai,
  'Magic Chess': magicchess,
  '8 Ball Pool': ballpool,
  'Arena of Valor': arenaofvalor,
  'Dragon Nest': dragonnest,
  'eFootball': efootball,
  'Racing Master': racingmaster,
  'Sausage Man': sausageman,
  'Stumble Guys': stumbleguys,
}

const paymentLogoMap: Record<string, string> = {
  'QRIS': qris,
  'OVO': ovo,
  'GoPay': gopay,
  'ShopeePay': shoopepay,
  'DANA': dana,
  'Alfamart': alfamart,
  'Indomaret': indomaret,
  'Bank Transfer': banktransfer,
  'Kartu Kredit': kartukredit,
}


export default function Checkout() {
  const navigate = useNavigate()
  const location = useLocation()
  const orderData = location.state as any

  if (!orderData) {
    toast.error('Pesanan hilang!')
    navigate('/')
    return null
  }

  const handlePay = async (method: string) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Login dulu bro!')
      navigate('/login')
      return
    }

    const { error } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        game_name: orderData.gameName,
        user_game_id: orderData.userId,
        zone: orderData.zone || null,
        product_name: orderData.productName,
        amount: orderData.price,
        payment_method: method,
        status: 'pending'
      })

    if (error) {
      toast.error('Gagal proses order!')
    } else {
      toast.success('Order berhasil! Tunggu proses ya bro!')
      navigate('/success', { state: { method, amount: orderData.price } })
    }
  }

  const formatRupiah = (num: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  const gameLogo = gameLogoMap[orderData.gameName] || 'https://via.placeholder.com/160x160/1a1a1a/rose-500?text=FOMO'

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-purple-900/50 py-12 px-4">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-black text-center mb-10 md:mb-16 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent drop-shadow-[0_0_10px_rgba(255,0,255,0.5)]">
            CHECKOUT PESANAN
          </h1>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">

            {/* DETAIL PESANAN */}
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-12 border-2 border-rose-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-10">
                  <div className="absolute top-0 -left-1/4 w-60 h-60 bg-rose-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                  <div className="absolute bottom-0 -right-1/4 w-60 h-60 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
              </div>
              <h2 className="text-3xl md:text-4xl font-black text-rose-400 mb-6 md:mb-8 relative z-10">Ringkasan Pesanan Anda</h2>
              
              <div className="flex items-center gap-4 md:gap-6 mb-6 md:mb-8 relative z-10">
                <img 
                  src={gameLogo}
                  alt={orderData.gameName}
                  className="w-20 h-20 md:w-28 md:h-28 rounded-xl md:rounded-2xl object-cover border-4 border-rose-500/60 shadow-xl"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/160x160/1a1a1a/rose-500?text=FOMO'}
                />
                <div>
                  <h3 className="text-xl md:text-3xl font-black text-white">{orderData.gameName}</h3>
                  <div className="flex items-center gap-2 text-base md:text-xl text-gray-300 mt-2">
                    <User size={18} className="text-rose-400" />
                    ID: <span className="text-rose-300 font-mono">{orderData.userId}</span>
                    {orderData.zone && <span className="text-gray-500"> ({orderData.zone})</span>}
                  </div>
                  <button
                      onClick={() => { navigator.clipboard.writeText(orderData.userId); toast.success('ID Pengguna disalin!'); }}
                      className="flex items-center gap-2 text-xs px-2 py-1 bg-gray-800 rounded-md hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition-colors mt-2"
                  >
                      <Copy size={12} /> Salin ID
                  </button>
                </div>
              </div>

              <div className="bg-gray-800 p-4 md:p-6 rounded-xl border border-gray-700 mb-6 md:mb-8 relative z-10">
                <p className="text-base md:text-lg text-gray-400 flex items-center gap-2 mb-2"><Package size={18}/> Item Dipilih:</p>
                <p className="text-xl md:text-2xl font-bold text-white">{orderData.productName}</p>
              </div>

              <div className="flex justify-between items-center border-t-2 border-gray-700 pt-6 relative z-10">
                <p className="text-xl md:text-3xl font-bold text-white">Total Pembayaran:</p>
                <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                  {formatRupiah(orderData.price)}
                </p>
              </div>

              {/* TOMBOL KEMBALI */}
              <div className="mt-8 relative z-10">
                <button
                  onClick={() => navigate(-1)}
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-800 hover:to-gray-900 
                             border-2 border-gray-700 hover:border-purple-500 
                             py-4 md:py-5 rounded-2xl font-bold text-lg md:text-xl text-white 
                             transition-all duration-300 hover:scale-105 active:scale-100 hover:shadow-2xl hover:shadow-purple-500/40
                             flex items-center justify-center gap-3 group"
                >
                  <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={24} />
                  KEMBALI
                </button>
              </div>
            </div>

            {/* PEMBAYARAN */}
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-6 md:p-12 border-2 border-rose-500/40 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 z-0 opacity-10">
                  <div className="absolute top-0 -left-1/4 w-60 h-60 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-700"></div>
                  <div className="absolute bottom-0 -right-1/4 w-60 h-60 bg-rose-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1200"></div>
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-rose-400 mb-8 md:mb-12 text-center relative z-10">
                Pilih Metode Pembayaran
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-8 relative z-10">
                {payments.map((method) => (
                  <button
                    key={method}
                    onClick={() => handlePay(method)}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-rose-600/80 hover:to-purple-700 
                               border-2 border-gray-700 hover:border-rose-500 
                               p-4 md:p-6 rounded-2xl md:rounded-3xl font-black text-base md:text-xl text-white 
                               transition-all duration-300 hover:scale-110 active:scale-105 hover:shadow-2xl hover:shadow-rose-500/50
                               flex flex-col items-center justify-center h-28 md:h-40 gap-2 md:gap-4 relative overflow-hidden group"
                  >
                    <img src={paymentLogoMap[method]} alt={method} className="h-8 md:h-12 object-contain group-hover:scale-110 transition-transform" />
                    <span className="text-center text-sm md:text-base leading-tight whitespace-pre-line group-hover:text-white transition-colors">
                      {method === 'ShopeePay' ? 'Shopee\nPay' : 
                       method === 'Alfamart' ? 'Alfa\nmart' : 
                       method === 'Indomaret' ? 'Indo\nmaret' :
                       method === 'Bank Transfer' ? 'Bank\nTransfer' :
                       method === 'Kartu Kredit' ? 'Kartu\nKredit' : method}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-400 mt-8 md:mt-10 text-sm md:text-lg relative z-10 flex items-center justify-center gap-2">
                <Lock size={16} className="text-green-400" />
                Transaksi Aman & Terjamin dengan Enkripsi SSL
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
