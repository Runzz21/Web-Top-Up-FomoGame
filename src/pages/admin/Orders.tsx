// src/pages/admin/Orders.tsx → FINAL FIX TOTAL — JALAN MULUS, NAMA & EMAIL USER MUNCUL!
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Search, Filter, ChevronDown, Loader2, Info } from 'lucide-react' // Added Info icon
import { motion, AnimatePresence } from 'framer-motion' // Added motion and AnimatePresence

// Definisi tipe baru untuk data user dari RPC
interface User {
  id: string
  email?: string
  raw_user_meta_data?: {
    name?: string
  }
}

// Tipe transaksi yang disederhanakan, tanpa 'profiles'
type Transaction = {
  id: string
  created_at: string
  user_id: string
  game_name: string
  user_game_id: string
  zone: string | null
  product_name: string
  amount: number
  payment_method: string
  status: string
}

const getStatusBadge = (status: string) => {
  const s = status.toLowerCase()
  if (s === 'success') return 'bg-green-500/20 text-green-400 border border-green-500/50'
  if (s === 'failed') return 'bg-red-500/20 text-red-400 border border-red-500/50'
  if (s === 'pending' || s === 'processing') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
  return 'bg-gray-500/20 text-gray-400 border border-gray-500/50'
}

export default function Orders() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map()) // State untuk mapping user
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  // State untuk konfirmasi modal
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [orderToConfirmId, setOrderToConfirmId] = useState<string | null>(null)
  const [statusToSet, setStatusToSet] = useState<'success' | 'failed' | null>(null)


  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      toast.loading('Memuat data...', { id: 'loading-data' })

      // 1. Fetch transactions and users in parallel
      const [transactionsResponse, usersResponse] = await Promise.all([
        supabase
          .from('transactions')
          .select(`
            id,
            created_at,
            user_id,
            game_name,
            user_game_id,
            zone,
            product_name,
            amount,
            payment_method,
            status
          `)
          .order('created_at', { ascending: false })
          .limit(100),
        supabase.rpc('get_all_users')
      ])

      // Error handling for transactions
      if (transactionsResponse.error) {
        throw new Error(`Gagal memuat transaksi: ${transactionsResponse.error.message}`)
      }
      
      // Error handling for users
      if (usersResponse.error) {
        throw new Error(`Gagal memuat pengguna: ${usersResponse.error.message}`)
      }

      // 2. Create a map of users for quick lookup
      const usersData = usersResponse.data || []
      const newUsersMap = new Map<string, User>()
      for (const user of usersData) {
        newUsersMap.set(user.id, user)
      }
      
      setUsersMap(newUsersMap)
      setTransactions(transactionsResponse.data || [])
      
      toast.success(`Berhasil memuat ${transactionsResponse.data?.length} transaksi dan ${usersData.length} pengguna!`, { id: 'loading-data' })

    } catch (err: any) {
      console.error('Unexpected error:', err)
      toast.error(err.message || 'Terjadi kesalahan tidak terduga.', { id: 'loading-data' })
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = (id: string, newStatus: 'success' | 'failed') => {
    setOrderToConfirmId(id)
    setStatusToSet(newStatus)
    setShowConfirmModal(true)
  }

  const handleConfirmAction = async () => {
    if (!orderToConfirmId || !statusToSet) return // Should not happen if modal is shown correctly

    setShowConfirmModal(false) // Hide modal immediately

    const originalStatus = transactions.find(tx => tx.id === orderToConfirmId)?.status;

    try {
      toast.loading(`Mengubah status pesanan ${orderToConfirmId.slice(0, 5)}...`, { id: 'status-update' });

      const { error } = await supabase
        .from('transactions')
        .update({ status: statusToSet })
        .eq('id', orderToConfirmId);

      if (error) {
        throw new Error(error.message);
      }

      toast.success(`Status berhasil diubah menjadi ${statusToSet.toUpperCase()}!`, { id: 'status-update' });
      fetchData(); // Refresh data after update
    } catch (err: any) {
      console.error('Gagal update status:', err);
      toast.error(`Gagal mengubah status: ${err.message}`, { id: 'status-update' });
    } finally {
      // Clear modal state
      setOrderToConfirmId(null);
      setStatusToSet(null);
    }
  }

  const handleCancelAction = () => {
    setShowConfirmModal(false)
    setOrderToConfirmId(null)
    setStatusToSet(null)
  }

  const filteredTransactions = transactions.filter(tx => {
    const searchLower = searchTerm.toLowerCase()
    const user = usersMap.get(tx.user_id)
    const userName = user?.raw_user_meta_data?.name?.toLowerCase() || ''
    const userEmail = user?.email?.toLowerCase() || ''

    return (
      tx.id.toLowerCase().includes(searchLower) ||
      tx.game_name.toLowerCase().includes(searchLower) ||
      tx.user_game_id.toLowerCase().includes(searchLower) ||
      (tx.zone && tx.zone.toLowerCase().includes(searchLower)) ||
      userName.includes(searchLower) ||
      userEmail.includes(searchLower)
    )
  })

  return (
    <div className="space-y-8 p-4 md:p-6 lg:p-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl md:text-5xl font-black text-white mb-2 bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
          Semua Transaksi
        </h1>
        <p className="text-xl text-gray-400">Lacak dan kelola semua transaksi di FomoGame.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-lg">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
        <input
          type="text"
          placeholder="Cari ID, game, user ID, zone, nama, atau email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-4 bg-gray-800/60 border border-gray-700 rounded-2xl text-white focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/20 transition"
        />
      </div>

      {/* Table Card */}
      <div className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-800 shadow-2xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-rose-500 mb-4" size={48} />
            <p className="text-gray-400 text-lg">Memuat transaksi...</p>
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-2xl text-gray-400">Tidak ada transaksi ditemukan</p>
            {searchTerm && <p className="text-gray-500 mt-2">Coba kata kunci lain</p>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800/50">
                <tr className="text-left text-sm font-medium text-gray-300">
                  <th className="px-6 py-5">ID Transaksi</th>
                  <th className="px-6 py-5">User</th>
                  <th className="px-6 py-5">Game & Item</th>
                  <th className="px-6 py-5">User ID & Zone</th>
                  <th className="px-6 py-5">Jumlah & Pembayaran</th>
                  <th className="px-6 py-5 text-center">Status</th>
                  <th className="px-6 py-5 text-center">Aksi</th>
                  <th className="px-6 py-5">Waktu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredTransactions.map((tx) => {
                  const user = usersMap.get(tx.user_id)
                  const userName = user?.raw_user_meta_data?.name || 'User Tanpa Nama'
                  const userEmail = user?.email || 'Email tidak tersedia'

                  return (
                    <tr key={tx.id} className="hover:bg-gray-800/50 transition">
                      <td className="px-6 py-5">
                        <div className="font-mono text-sm text-rose-400">{tx.id.slice(0, 12)}...</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-white font-medium">{userName}</div>
                        <div className="text-sm text-gray-400">{userEmail}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-white font-medium">{tx.game_name}</div>
                        <div className="text-sm text-gray-400">{tx.product_name}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-white font-medium">{tx.user_game_id}</div>
                        <div className="text-sm text-gray-400">{tx.zone ? `Zone ${tx.zone}` : 'No Zone'}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-white font-bold">Rp{tx.amount.toLocaleString('id-ID')}</div>
                        <div className="text-sm text-gray-400 capitalize">{tx.payment_method}</div>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <span className={`inline-flex px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(tx.status)}`}>
                          {tx.status}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-center">
                        <div className="flex justify-center gap-2">
                          {tx.status.toLowerCase() !== 'success' && (
                            <button
                              onClick={() => updateStatus(tx.id, 'success')}
                              className="px-3 py-1 rounded-md text-xs bg-green-500/20 text-green-400 hover:bg-green-500/40 transition"
                            >
                              Success
                            </button>
                          )}
                          {tx.status.toLowerCase() !== 'failed' && (
                            <button
                              onClick={() => updateStatus(tx.id, 'failed')}
                              className="px-3 py-1 rounded-md text-xs bg-red-500/20 text-red-400 hover:bg-red-500/40 transition"
                            >
                              Failed
                            </button>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-gray-400 text-sm">
                        {new Date(tx.created_at).toLocaleString('id-ID', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="px-6 py-5 border-t border-gray-800 text-sm text-gray-400 text-center">
          Menampilkan {filteredTransactions.length} transaksi terbaru
        </div>
      </div>

      {/* Custom Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && orderToConfirmId && statusToSet && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 50, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 50, opacity: 0 }}
              className="bg-gray-900/95 border border-gray-700 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center"
            >
              <Info className="text-blue-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-bold text-white mb-2">Konfirmasi Perubahan Status</h3>
              <p className="text-gray-300 text-sm mb-6">
                Anda yakin ingin mengubah status pesanan{' '}
                <span className="font-semibold text-rose-400">{orderToConfirmId.slice(0, 8)}...</span> menjadi{' '}
                <span className={`font-bold ${statusToSet === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                  {statusToSet.toUpperCase()}
                </span>
                ?
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={handleConfirmAction}
                  className={`flex-1 px-5 py-2 rounded-xl text-white font-semibold transition ${statusToSet === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
                >
                  Ya, Ubah!
                </button>
                <button
                  onClick={handleCancelAction}
                  className="flex-1 px-5 py-2 rounded-xl bg-gray-700 text-gray-200 font-semibold hover:bg-gray-600 transition"
                >
                  Tidak, Batalkan
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}