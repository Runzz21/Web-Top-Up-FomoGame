// src/pages/GameDetail.tsx
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import games from '../data/games.json'
import products from '../data/products.json'
import toast from 'react-hot-toast'
import { User, DollarSign, CheckCircle, ShoppingCart, ArrowLeft, CreditCard } from 'lucide-react'


export default function GameDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useUser()

  const [userId, setUserId] = useState('')
  const [zone, setZone] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  const game = games.find((g: any) => g.slug === slug)
  if (!game) return <div className="text-6xl text-rose-500 text-center pt-40 font-bold">Game tidak ditemukan</div>

  const gameProducts = products.find((p: any) => p.gameId === game.id)?.items || []

  const onlyNumbers = (val: string) => val.replace(/[^0-9]/g, '')

  const handleSelectProduct = (product: any) => {
    setSelectedProduct(product) // Simpan seluruh object, bukan cuma ID!
  }

  const goToCheckout = () => {
    if (!user) return toast.error('Login dulu!') && navigate('/login')
    if (!userId) return toast.error('Isi User ID!')
    if (userId.length < 5) return toast.error('User ID minimal 5 angka!')
    if ((game.id === 1 || game.id === 2) && !zone) return toast.error('Isi Zone ID!')
    if (!selectedProduct) return toast.error('Pilih nominal dulu!')

    const finalPrice = selectedProduct.discount
      ? selectedProduct.price * (1 - selectedProduct.discount / 100)
      : selectedProduct.price

    navigate('/checkout', {
      state: {
        gameName: game.name,
        gameIcon: game.icon,
        userId,
        zone: zone || null,
        productName: selectedProduct.name,
        price: Math.round(finalPrice),
      },
    })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-8 md:py-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER GAME */}
          <div className="bg-gradient-to-r from-rose-900/80 to-purple-900/80 rounded-3xl p-6 md:p-10 mb-10 md:mb-12 text-center border border-rose-500/50 shadow-2xl relative overflow-hidden">
            <div className="absolute inset-0 z-0 opacity-20">
              <div className="absolute top-1/4 left-1/4 w-40 h-40 bg-rose-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-40 h-40 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-xl animate-pulse-slow delay-500"></div>
            </div>
            
            <div className="relative z-10">
              <img src={game.icon} alt={game.name} className="w-24 h-24 md:w-36 md:h-36 mx-auto rounded-3xl object-cover border-4 border-rose-500 shadow-2xl transform hover:scale-105 transition-transform duration-300" />
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-white mt-6 bg-gradient-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                {game.name}
              </h1>
              <p className="text-base md:text-xl text-gray-300 mt-4 max-w-2xl mx-auto">
                {"Top up diamond, coin, atau item favoritmu dengan proses instan, harga termurah, dan jaminan keamanan 24 jam!"}
              </p>
              <div className="mt-6 flex flex-wrap justify-center items-center gap-4 md:gap-6 text-sm md:text-xl text-gray-400">
                <span className="flex items-center gap-2"><CheckCircle className="text-green-400" size={20}/> Instan</span>
                <span className="flex items-center gap-2"><DollarSign className="text-yellow-400" size={20}/> Termurah</span>
                <span className="flex items-center gap-2"><User className="text-blue-400" size={20}/> Aman</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 md:gap-10">

            {/* KIRI — INPUT + NOMINAL */}
            <div className="lg:col-span-2 space-y-8 md:space-y-10">

              {/* INPUT ID */}
              <div className="bg-gray-800/90 rounded-3xl p-6 md:p-10 border border-rose-500/50 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                  <div className="absolute top-0 -left-1/4 w-80 h-80 bg-rose-500/20 rounded-full mix-blend-multiply filter blur-xl animate-slow-spin"></div>
                  <div className="absolute bottom-0 -right-1/4 w-80 h-80 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-slow-spin delay-1000"></div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-rose-400 mb-6 md:mb-8 flex items-center gap-4 relative z-10">
                  <span className="bg-rose-600 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg">1</span>
                  Masukkan ID Pengguna
                </h2>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6 relative z-10">
                  <div className="relative group">
                    <input
                      type="text"
                      value={userId}
                      onChange={(e) => setUserId(onlyNumbers(e.target.value))}
                      className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-2xl text-lg md:text-xl text-white focus:border-rose-500 focus:outline-none transition-colors peer"
                      required
                    />
                    <label htmlFor="userId" className={`absolute left-5 text-gray-500 transition-all duration-200 pointer-events-none
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-400
                        ${userId ? 'top-2 text-xs text-rose-400' : 'top-1/2 -translate-y-1/2 text-lg'}`
                    }>ID Pengguna</label>
                  </div>

                  {(game.id === 1 || game.id === 2) && (
                    <div className="relative group">
                      <input
                        type="text"
                        value={zone}
                        onChange={(e) => setZone(onlyNumbers(e.target.value))}
                        className="w-full px-5 py-4 bg-gray-900 border-2 border-gray-700 rounded-2xl text-lg md:text-xl text-white focus:border-rose-500 focus:outline-none transition-colors peer"
                        required
                      />
                      <label htmlFor="zoneId" className={`absolute left-5 text-gray-500 transition-all duration-200 pointer-events-none
                        peer-focus:top-2 peer-focus:text-xs peer-focus:text-rose-400
                        ${zone ? 'top-2 text-xs text-rose-400' : 'top-1/2 -translate-y-1/2 text-lg'}`
                    }>ID Server / Zone</label>
                    </div>
                  )}
                </div>
              </div>

              {/* NOMINAL */}
              <div className="bg-gray-800/90 rounded-3xl p-6 md:p-10 border border-rose-500/50 relative overflow-hidden">
                <h2 className="text-3xl md:text-4xl font-black text-rose-400 mb-8 md:mb-10 flex items-center gap-4 relative z-10">
                  <span className="bg-rose-600 w-10 h-10 md:w-14 md:h-14 rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold text-white shadow-lg">2</span>
                  Pilih Nominal
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 relative z-10">
                  {gameProducts.map((prod: any) => {
                    const finalPrice = prod.discount ? prod.price * (1 - prod.discount / 100) : prod.price
                    const isSelected = selectedProduct?.id === prod.id

                    return (
                      <button
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className={`relative p-4 md:p-6 rounded-2xl md:rounded-3xl border-4 transition-all hover:scale-105 active:scale-100 group
                          ${isSelected
                            ? 'border-rose-500 bg-rose-500/20 shadow-2xl shadow-rose-500/60'
                            : 'border-gray-700 bg-gray-900 hover:border-rose-500/60'
                          }`}
                      >
                        {prod.discount && (
                          <div className="absolute -top-3 -right-3 bg-gradient-to-br from-red-600 to-red-800 text-white px-3 py-0.5 md:px-4 md:py-1 rounded-full text-xs md:text-sm font-black transform -rotate-6 shadow-md group-hover:scale-110 transition-transform">
                            -{prod.discount}%
                          </div>
                        )}
                        <p className="text-base md:text-xl font-black text-white text-wrap">{prod.name}</p>
                        {prod.discount && (
                          <p className="text-xs md:text-sm text-gray-400 line-through mt-1">Rp{prod.price.toLocaleString('id-ID')}</p>
                        )}
                        <p className="text-base md:text-lg font-black text-rose-400 mt-2">
                          Rp{Math.round(finalPrice).toLocaleString('id-ID')}
                        </p>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* KANAN — CHECKOUT CARD */}
            <div className="lg:col-span-1">
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-6 md:p-8 border-2 border-rose-500/50 shadow-2xl sticky top-24 relative overflow-hidden">
                <div className="absolute inset-0 z-0 opacity-10">
                  <div className="absolute top-0 -left-1/4 w-60 h-60 bg-purple-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
                  <div className="absolute bottom-0 -right-1/4 w-60 h-60 bg-rose-500/20 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-500"></div>
                </div>

                <h2 className="text-3xl md:text-4xl font-black text-rose-400 text-center mb-6 md:mb-8 relative z-10">Ringkasan Pesanan</h2>

                <div className="space-y-4 md:space-y-6 relative z-10">
                  <div className="bg-gray-900 p-4 md:p-6 rounded-2xl border border-gray-700">
                    <p className="text-base md:text-xl text-gray-300 mb-2">Item Dipilih:</p>
                    <p className="text-xl md:text-3xl font-bold text-white">
                      {selectedProduct ? selectedProduct.name : 'Pilih nominal dulu'}
                    </p>
                  </div>

                  <div className="border-t-2 border-gray-700 pt-4 md:pt-6">
                    <div className="flex justify-between items-center mb-6 md:mb-8">
                      <p className="text-xl md:text-2xl font-bold text-white">Total:</p>
                      <p className="text-2xl md:text-3xl font-black bg-gradient-to-r from-rose-400 to-purple-400 bg-clip-text text-transparent">
                        {selectedProduct
                          ? `Rp${Math.round(
                              selectedProduct.discount
                                ? selectedProduct.price * (1 - selectedProduct.discount / 100)
                                : selectedProduct.price
                            ).toLocaleString('id-ID')}`
                          : 'Rp0'}
                      </p>
                    </div>

                    <button
                      onClick={goToCheckout}
                      disabled={!selectedProduct || !userId || ((game.id === 1 || game.id === 2) && !zone)}
                      className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 py-4 md:py-5 rounded-2xl font-bold md:font-black text-xl md:text-2xl text-white shadow-2xl hover:scale-105 active:scale-100 transition-all relative overflow-hidden group"
                    >
                      <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      <span className="relative z-10 flex items-center justify-center gap-3">
                        <ShoppingCart size={24} />
                        Beli Sekarang
                      </span>
                    </button>

                    <p className="text-center text-gray-500 text-sm mt-4 flex items-center justify-center gap-2">
                      <CreditCard size={16} /> Transaksi aman & terjamin
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tombol Kembali ke Home, now outside the grid */}
          <div className="mt-12 text-center">
            <button
              onClick={() => navigate('/')}
              className="inline-flex items-center justify-center gap-3 group
                         bg-gradient-to-r from-gray-800 to-gray-900 hover:from-purple-800 hover:to-gray-900 
                         border-2 border-gray-700 hover:border-purple-500 
                         py-4 px-8 md:py-5 md:px-10 rounded-2xl font-bold text-lg md:text-xl text-white 
                         transition-all duration-300 hover:scale-105 active:scale-100 hover:shadow-2xl hover:shadow-purple-500/40"
            >
              <ArrowLeft className="group-hover:-translate-x-1 transition-transform" size={24} />
              KEMBALI
            </button>
          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}
