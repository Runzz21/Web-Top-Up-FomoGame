// src/pages/admin/AdminDashboard.tsx → FINAL TERBAIK — CANTIK, RAPIH, ANTI-ERROR, PERSIS FOTO LU!
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../../hooks/useUser'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface Transaction {
  id: string
  game_name: string
  product_name: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

export default function AdminDashboard() {
  const { user, loading } = useUser()
  const navigate = useNavigate()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [refreshing, setRefreshing] = useState(false)

  // Proteksi admin
  useEffect(() => {
    if (!loading && (!user || user.email !== 'admin@fomogame.com')) {
      toast.error('Akses ditolak! Admin only.')
      navigate('/')
    }
  }, [user, loading, navigate])

  // Fetch order — ANTI-ERROR 100%
  const fetchOrders = async () => {
    setRefreshing(true)
    try {
      const { data, error } = await supabase
        .from('transactions')
        .select('id, game_name, product_name, amount, status, created_at')
        .order('created_at', { ascending: false })

      if (error) throw error

      // PASTI ARRAY KOSONG KALO NULL/UNDEFINED
      setTransactions(data ?? [])
    } catch (err) {
      toast.error('Gagal ambil order!')
      console.error(err)
      setTransactions([])
    } finally {
      setRefreshing(false)
    }
  }

  // Fetch pertama + auto refresh
  useEffect(() => {
    if (user?.email === 'admin@fomogame.com') {
      fetchOrders()
      const interval = setInterval(fetchOrders, 8000)
      return () => clearInterval(interval)
    }
  }, [user])

  // Format rupiah
  const formatRupiah = (num: number) => `Rp${num.toLocaleString('id-ID')}`

  // Loading & akses ditolak
  if (loading || !user || user.email !== 'admin@fomogame.com') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-5xl font-black text-rose-500 animate-pulse">Loading Admin Panel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* MULAI DARI SAMPING SIDEBAR — RAPET KE KIRI! */}
      <div className="ml-1">

        {/* CARD STATISTIK — PERSIS FOTO LU */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-8">
          <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 rounded-3xl shadow-2xl border border-pink-500/50">
            <p className="text-gray-200 text-sm font-bold">Pendapatan Hari Ini</p>
            <p className="text-2xl font-black text-white mt-2">Rp86M</p>
            <p className="text-green-400 text-xs mt-2">+20% dari kemarin</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-6 rounded-3xl shadow-2xl border border-green-500/50">
            <p className="text-gray-200 text-sm font-bold">Order Sukses Hari Ini</p>
            <p className="text-4xl font-black text-white mt-2">2</p>
            <p className="text-green-400 text-xs mt-2">Terproses otomatis</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-yellow-600 p-6 rounded-3xl shadow-2xl border border-orange-500/50">
            <p className="text-gray-200 text-sm font-bold">Order Pending</p>
            <p className="text-4xl font-black text-white mt-2">0</p>
            <p className="text-yellow-300 text-xs mt-2">Butuh proses manual</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-6 rounded-3xl shadow-2xl border border-cyan-500/50">
            <p className="text-gray-200 text-sm font-bold">Total User Aktif</p>
            <p className="text-4xl font-black text-white mt-2">3</p>
            <p className="text-cyan-300 text-xs mt-2">Terdaftar & top-up</p>
          </div>
        </div>

        {/* JUDUL + TOMBOL REFRESH */}
        <div className="text-center px-8 mb-10">
          <h1 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent">
            ALL ORDERS LIVE
          </h1>
          <button
            onClick={fetchOrders}
            disabled={refreshing}
            className="mt-6 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 px-16 py-5 rounded-full font-black text-3xl text-white shadow-2xl hover:scale-110 transition-all disabled:opacity-70"
          >
            {refreshing ? 'Refreshing...' : 'REFRESH ORDERS'}
          </button>
        </div>

        {/* TABEL ORDER — PERSIS FOTO LU */}
        <div className="px-8 pb-20">
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl overflow-hidden border border-pink-500/30 shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-800/90 border-b-2 border-pink-500">
                  <tr>
                    <th className="px-8 py-5 text-pink-400 font-black text-left text-sm">Game</th>
                    <th className="px-8 py-5 text-pink-400 font-black text-left text-sm">Produk</th>
                    <th className="px-8 py-5 text-pink-400 font-black text-left text-sm">Harga</th>
                    <th className="px-8 py-5 text-pink-400 font-black text-left text-sm">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-24 text-4xl text-gray-500 font-bold">
                        Belum ada order masuk
                      </td>
                    </tr>
                  ) : (
                    transactions.map((tx) => (
                      <tr key={tx.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition">
                        <td className="px-8 py-6 text-pink-300 font-bold">{tx.game_name}</td>
                        <td className="px-8 py-6 text-white">{tx.product_name}</td>
                        <td className="px-8 py-6 text-pink-400 font-black text-lg">
                          {formatRupiah(tx.amount)}
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-6 py-2 rounded-full font-bold text-sm
                            ${tx.status === 'success' ? 'bg-green-500/30 text-green-400 border border-green-500' :
                              tx.status === 'pending' ? 'bg-yellow-500/30 text-yellow-400 border border-yellow-500' :
                              'bg-red-500/30 text-red-400 border border-red-500'}`}>
                            {tx.status.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}