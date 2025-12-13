// src/pages/Checkout.tsx → FINAL + TOMBOL KEMBALI KE HOME!
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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


const payments = ['QRIS', 'OVO', 'GoPay', 'ShopeePay', 'DANA', 'Alfamart', 'Indomaret']

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
      navigate('/success')
    }
  }

  const formatRupiah = (num: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num)

  const gameLogo = gameLogoMap[orderData.gameName] || 'https://via.placeholder.com/160x160/1a1a1a/rose-500?text=FOMO'

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-purple-900/50 py-20 px-6">
        <div className="max-w-6xl mx-auto">

          <h1 className="text-8xl font-black text-center mb-16 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            CHECKOUT PESANAN
          </h1>

          <div className="grid lg:grid-cols-2 gap-12">

            {/* DETAIL PESANAN + TOMBOL KEMBALI */}
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-12 border-2 border-rose-500/40 shadow-2xl">
              <h2 className="text-5xl font-black text-rose-400 mb-10">Detail Pesanan</h2>
              
              <div className="flex items-center gap-10 mb-10">
                <img 
                  src={gameLogo}
                  alt={orderData.gameName}
                  className="w-40 h-40 rounded-3xl object-cover border-4 border-rose-500/60 shadow-2xl"
                  onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/160x160/1a1a1a/rose-500?text=FOMO'}
                />
                <div>
                  <h3 className="text-5xl font-black text-white">{orderData.gameName}</h3>
                  <p className="text-2xl text-gray-300 mt-2">
                    ID: <span className="text-rose-300 font-mono">{orderData.userId}</span>
                    {orderData.zone && <span className="text-gray-500"> ({orderData.zone})</span>}
                  </p>
                </div>
              </div>

              <div className="border-t-2 border-gray-700 pt-8">
                <p className="text-3xl text-gray-400 mb-4">{orderData.productName}</p>
                <p className="text-7xl font-black text-rose-400">
                  {formatRupiah(orderData.price)}
                </p>
              </div>

              {/* TOMBOL KEMBALI KE HOME — GANTENG BANGET! */}
              <div className="mt-12">
                <button
                  onClick={() => navigate('/')}
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-900 hover:from-rose-700 hover:to-purple-800 
                             border-2 border-gray-700 hover:border-rose-500 
                             py-6 rounded-2xl font-black text-2xl text-white 
                             transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/50
                             flex items-center justify-center gap-4 group"
                >
                  <svg className="w-8 h-8 group-hover:-translate-x-2 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                  KEMBALI KE HOME
                </button>
              </div>
            </div>

            {/* PEMBAYARAN */}
            <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-12 border-2 border-rose-500/40 shadow-2xl">
              <h2 className="text-5xl font-black text-rose-400 mb-12 text-center">
                Pilih Pembayaran
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
                {payments.map((method) => (
                  <button
                    key={method}
                    onClick={() => handlePay(method)}
                    className="bg-gradient-to-br from-gray-800 to-gray-900 hover:from-rose-600/80 hover:to-purple-700 
                               border-2 border-gray-700 hover:border-rose-500 
                               p-6 rounded-3xl font-black text-xl text-white 
                               transition-all duration-300 hover:scale-110 hover:shadow-2xl
                               flex items-center justify-center h-32"
                  >
                    <span className="text-center leading-tight whitespace-pre-line">
                      {method === 'ShopeePay' ? 'Shopee\nPay' : 
                       method === 'Alfamart' ? 'Alfa\nmart' : 
                       method === 'Indomaret' ? 'Indo\nmaret' : method}
                    </span>
                  </button>
                ))}
              </div>

              <p className="text-center text-gray-400 mt-10 text-lg">
                Klik → Order langsung masuk!
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}