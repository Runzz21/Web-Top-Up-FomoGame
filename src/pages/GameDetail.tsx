import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import games from '../data/games.json'
import products from '../data/products.json'
import toast from 'react-hot-toast'

const formatRupiah = (num: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(num)
}

export default function GameDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user, loading } = useUser()

  const [userId, setUserId] = useState('')
  const [zone, setZone] = useState('')
  const [selectedProduct, setSelectedProduct] = useState('')

  const game = games.find((g: any) => g.slug === slug)
  const gameProducts = products.find((p: any) => p.gameId === game?.id)?.items || []

  // Loading & 404
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/20 flex items-center justify-center">
        <p className="text-4xl text-rose-500 animate-pulse">Loading...</p>
      </div>
    )
  }

  if (!game) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/20 flex items-center justify-center text-6xl text-rose-500">
        Game Tidak Ditemukan
      </div>
    )
  }

  const handleCheckout = () => {
    if (!user) {
      toast.error('Login dulu bro!')
      navigate('/login')
      return
    }
    if (!userId || !selectedProduct) {
      toast.error('Isi User ID & pilih nominal!')
      return
    }

    const product = gameProducts.find((p: any) => p.id === selectedProduct)!
    const finalPrice = product.discount
      ? product.price - (product.price * product.discount) / 100
      : product.price

    navigate('/checkout', {
      state: {
        gameName: game.name,
        gameIcon: game.icon,
        userId,
        zone: zone || null,
        productName: product.name,
        price: finalPrice,
      },
    })
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/20 py-12">
        <div className="max-w-5xl mx-auto px-4">
          <div className="bg-gray-900/95 backdrop-blur-2xl rounded-3xl border border-gray-800 overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="bg-gradient-to-r from-rose-600 to-purple-700 p-10 text-center">
              <img
                src={game.icon}
                alt={game.name}
                className="w-28 h-28 mx-auto rounded-full border-8 border-white/30 shadow-2xl"
              />
              <h1 className="text-5xl font-black mt-6 gradient-text">{game.name}</h1>
            </div>

            <div className="p-10 space-y-10">
              {/* Input ID & Zone */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-lg font-bold mb-3 text-rose-400">User ID</label>
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    placeholder="Masukkan User ID"
                    className="w-full px-6 py-4 bg-gray-800/70 border-2 border-gray-700 rounded-2xl focus:border-rose-500 focus:outline-none text-lg"
                  />
                </div>
                {(game.id === 1 || game.id === 2) && (
                  <div>
                    <label className="block text-lg font-bold mb-3 text-rose-400">Zone / Server</label>
                    <input
                      type="text"
                      value={zone}
                      onChange={(e) => setZone(e.target.value)}
                      placeholder="Contoh: 1234"
                      className="w-full px-6 py-4 bg-gray-800/70 border-2 border-gray-700 rounded-2xl focus:border-rose-500 focus:outline-none text-lg"
                    />
                  </div>
                )}
              </div>

              {/* Produk */}
              <div>
                <h3 className="text-3xl font-bold text-center mb-8 gradient-text">
                  Pilih Nominal
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {gameProducts.map((prod: any) => {
                    const finalPrice = prod.discount
                      ? prod.price - (prod.price * prod.discount) / 100
                      : prod.price

                    return (
                      <button
                        key={prod.id}
                        onClick={() => setSelectedProduct(prod.id)}
                        className={`p-6 rounded-2xl border-4 transition-all hover:scale-105 ${
                          selectedProduct === prod.id
                            ? 'border-rose-500 bg-rose-500/20 shadow-2xl shadow-rose-500/50'
                            : 'border-gray-700 bg-gray-800/70 hover:border-rose-500/50'
                        }`}
                      >
                        <p className="text-xl font-bold">{prod.name}</p>
                        {prod.discount && (
                          <p className="text-sm text-gray-400 line-through">
                            {formatRupiah(prod.price)}
                          </p>
                        )}
                        <p className="text-2xl font-black text-rose-400 mt-2">
                          {formatRupiah(finalPrice)}
                        </p>
                        {prod.discount && (
                          <span className="inline-block mt-2 px-3 py-1 bg-rose-600 text-xs rounded-full font-bold">
                            -{prod.discount}%
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tombol Checkout */}
              <button
                onClick={handleCheckout}
                className="w-full btn-gradient py-6 rounded-2xl text-3xl font-black hover:scale-105 transition shadow-2xl"
              >
                LANJUT KE PEMBAYARAN
              </button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}