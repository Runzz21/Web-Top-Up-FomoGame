// src/pages/GameDetail.tsx → FINAL 100% BEBAS ERROR — GAK ADA LAGI find().price ERROR!
import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useUser } from '../hooks/useUser'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import games from '../data/games.json'
import products from '../data/products.json'
import toast from 'react-hot-toast'

export default function GameDetail() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { user } = useUser()

  const [userId, setUserId] = useState('')
  const [zone, setZone] = useState('')
  const [selectedProduct, setSelectedProduct] = useState<any>(null) // SIMPAN OBJECT PRODUCT LANGSUNG!

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
      <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black py-12 px-6">
        <div className="max-w-7xl mx-auto">

          {/* HEADER GAME */}
          <div className="bg-gradient-to-r from-rose-900/80 to-purple-900/80 rounded-3xl p-10 mb-12 text-center border border-rose-500/50 shadow-2xl">
            <img src={game.icon} alt={game.name} className="w-32 h-32 mx-auto rounded-2xl border-4 border-rose-500 shadow-2xl" />
            <h1 className="text-6xl font-black text-white mt-6">{game.name}</h1>
            <p className="text-2xl text-gray-300 mt-4">Proses instan • Harga termurah • 24 jam</p>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">

            {/* KIRI — INPUT + NOMINAL */}
            <div className="lg:col-span-2 space-y-10">

              {/* INPUT ID */}
              <div className="bg-gray-800/90 rounded-3xl p-10 border border-rose-500/50">
                <h2 className="text-4xl font-black text-rose-400 mb-8 flex items-center gap-4">
                  <span className="bg-rose-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl">1</span>
                  Masukkan ID Pengguna
                </h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <input
                    type="text"
                    value={userId}
                    onChange={(e) => setUserId(onlyNumbers(e.target.value))}
                    placeholder="ID Pengguna"
                    className="px-8 py-6 bg-gray-900 border-2 border-gray-700 rounded-2xl text-2xl text-white focus:border-rose-500 focus:outline-none"
                  />
                  {(game.id === 1 || game.id === 2) && (
                    <input
                      type="text"
                      value={zone}
                      onChange={(e) => setZone(onlyNumbers(e.target.value))}
                      placeholder="ID Server / Zone"
                      className="px-8 py-6 bg-gray-900 border-2 border-gray-700 rounded-2xl text-2xl text-white focus:border-rose-500 focus:outline-none"
                    />
                  )}
                </div>
              </div>

              {/* NOMINAL */}
              <div className="bg-gray-800/90 rounded-3xl p-10 border border-rose-500/50">
                <h2 className="text-4xl font-black text-rose-400 mb-10 flex items-center gap-4">
                  <span className="bg-rose-600 w-12 h-12 rounded-full flex items-center justify-center text-2xl">2</span>
                  Pilih Nominal
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {gameProducts.map((prod: any) => {
                    const finalPrice = prod.discount ? prod.price * (1 - prod.discount / 100) : prod.price
                    const isSelected = selectedProduct?.id === prod.id

                    return (
                      <button
                        key={prod.id}
                        onClick={() => handleSelectProduct(prod)}
                        className={`relative p-6 rounded-3xl border-4 transition-all hover:scale-105
                          ${isSelected
                            ? 'border-rose-500 bg-rose-500/20 shadow-2xl shadow-rose-500/60'
                            : 'border-gray-700 bg-gray-900 hover:border-rose-500/60'
                          }`}
                      >
                        <p className="text-xl font-black text-white">{prod.name}</p>
                        {prod.discount && (
                          <div className="absolute -top-3 -right-3 bg-red-600 text-white px-4 py-1 rounded-full text-sm font-black">
                            -{prod.discount}%
                          </div>
                        )}
                        <p className="text-sm text-gray-400 line-through">Rp{prod.price.toLocaleString('id-ID')}</p>
                        <p className="text-90xl font-black text-rose-400 mt-2">
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
              <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-3xl p-8 border-2 border-orange-500/50 shadow-2xl sticky top-24">
                <h2 className="text-4xl font-black text-orange-400 text-center mb-8">Checkout</h2>

                <div className="space-y-6">
                  <div>
                    <p className="text-gray-300 mb-3">Item</p>
                    <div className="bg-gray-900 p-6 rounded-2xl border border-gray-700">
                      <p className="text-2xl font-bold text-white">
                        {selectedProduct ? selectedProduct.name : 'Pilih nominal'}
                      </p>
                    </div>
                  </div>

                  <div className="border-t-2 border-gray-700 pt-6">
                    <div className="flex justify-between mb-8">
                      <p className="text-2xl font-bold text-white">Total</p>
                      <p className="text-5xl font-black text-orange-400">
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
                      className="w-full bg-gradient-to-r from-orange-600 to-yellow-600 hover:from-orange-500 hover:to-yellow-500 disabled:opacity-50 py-10 rounded-2xl font-black text-4xl text-white shadow-2xl hover:scale-105 transition-all"
                    >
                      Beli Sekarang
                    </button>

                    <div className="mt-6 flex items-center gap-4">
                      <input type="checkbox" className="w-6 h-6 rounded" />
                      <p className="text-gray-400 text-sm">Simpan info untuk transaksi selanjutnya</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}