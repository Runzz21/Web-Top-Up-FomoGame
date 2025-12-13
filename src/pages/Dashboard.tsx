import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useUser } from '../hooks/useUser'
import toast from 'react-hot-toast'
import { ArrowLeft, Home } from 'lucide-react'

// IMPORT SEMUA LOGO DARI src/assets/game-icons (INI YANG LU MAU!)
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
// buat fallback kalau game belum ada

// Mapping nama game → logo (PAKAI IMPORT DI ATAS)
const gameLogos: { [key: string]: string } = {
  'Mobile Legends': mlbb,
  'Free Fire': ff,
  'PUBG Mobile': pubg,
  'Valorant': valorant,
  'Genshin Impact': genshin,
  'Roblox': roblox,
  'Call of Duty Mobile': codm,
  'Honkai: Star Rail': honkai,
  'Magic Chess': magicchess,
  '8 Ball Pool':ballpool,
  'Arena of Valor': arenaofvalor,
  'Dragon Nest': dragonnest,
  'eFootball': efootball,
  'Racing Master': racingmaster,
  'Sausage Man': sausageman,
  'Stumble Guys': stumbleguys,
  // Tambah game baru? Tinggal import + tambah di sini aja!
}

interface Transaction {
  id: string
  game_name: string
  user_game_id: string
  zone?: string
  product_name: string
  amount: number
  status: 'pending' | 'success' | 'failed'
  created_at: string
}

export default function Dashboard() {
  const { user } = useUser()
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [fullName, setFullName] = useState('User')

  useEffect(() => {
    if (user) {
      // Ambil nama lengkap dari register (pastikan lu simpan di user_metadata.full_name)
      const name = user?.user_metadata?.full_name || 
                   user?.user_metadata?.name || 
                   user?.email?.split('@')[0] || 
                   'User'
      setFullName(name)

      fetchTransactions()
    }
  }, [user])

  const fetchTransactions = async () => {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal memuat riwayat')
    } else {
      setTransactions(data || [])
    }
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(num)
  }

  const getStatusBadge = (status: string) => {
    if (status === 'success') return 'bg-green-500/20 text-green-400 border border-green-500/50'
    if (status === 'pending') return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/50'
    return 'bg-red-500/20 text-red-400 border border-red-500/50'
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0a0a0a] to-purple-900/60 p-6">
      <div className="max-w-6xl mx-auto">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
          <div className="flex items-center gap-5">
            <a href="/" className="group">
              <div className="bg-gray-800/80 p-3 rounded-full hover:bg-rose-600/50 transition-all hover:scale-110 border border-gray-700">
                <ArrowLeft size={32} className="text-white" />
              </div>
            </a>
            <div>
              <h1 className="text-6xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
                Riwayat Transaksi
              </h1>
              <p className="text-xl text-gray-400">Semua pesanan diamond kamu ada di sini</p>
            </div>
          </div>

          <div className="flex gap-4">
            <a href="/" className="bg-gradient-to-r from-rose-600 to-purple-600 px-8 py-4 rounded-full font-bold text-white hover:scale-105 transition shadow-xl flex items-center gap-3">
              <Home size={24} />
              Kembali ke Home
            </a>
            <button onClick={() => supabase.auth.signOut()} className="bg-gray-800 hover:bg-red-600/50 px-8 py-4 rounded-full font-bold border border-gray-700 hover:border-red-500 transition">
              Logout
            </button>
          </div>
        </div>

        {/* WELCOME CARD - PAKE NAMA LENGKAP */}
        <div className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-10 text-center border border-rose-500/30 mb-12 shadow-2xl">
          <p className="text-3xl text-gray-300 mb-3">Selamat datang kembali,</p>
          <p className="text-6xl font-black bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
            {fullName}!
          </p>
        </div>

        {/* RIWAYAT DENGAN LOGO GAME */}
        {loading ? (
          <div className="text-center py-32">
            <p className="text-4xl text-rose-500 animate-pulse">Memuat riwayat...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-32 bg-gray-900/80 rounded-3xl border border-dashed border-gray-600">
            <p className="text-5xl text-gray-500 mb-6">Belum ada transaksi</p>
            <a href="/" className="inline-block bg-gradient-to-r from-rose-600 to-purple-600 px-16 py-6 rounded-full text-3xl font-black hover:scale-110 transition shadow-2xl">
              Top Up Sekarang
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {transactions.map((tx) => (
              <div key={tx.id} className="bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 border border-gray-700 hover:border-rose-500/70 transition-all hover:shadow-2xl hover:shadow-rose-500/30 group">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8">
                  {/* KIRI - LOGO + INFO */}
                  <div className="flex items-start gap-6 flex-1">
                    <div className="relative">
                      <img 
                        src={gameLogos[tx.game_name]} 
                        alt={tx.game_name}
                        className="w-24 h-24 rounded-2xl object-cover border-4 border-rose-500/40 shadow-xl"
                      />
                      <span className={`absolute -top-2 -right-2 px-4 py-1 rounded-full text-sm font-bold ${getStatusBadge(tx.status)}`}>
                        {tx.status === 'success' ? 'Sukses' : tx.status === 'pending' ? 'Menunggu' : 'Gagal'}
                      </span>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-4xl font-black text-rose-400 mb-3">{tx.game_name}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
                        <p><span className="text-gray-500">ID Game:</span> <strong className="text-white">{tx.user_game_id} {tx.zone && <span className="text-gray-400">({tx.zone})</span>}</strong></p>
                        <p><span className="text-gray-500">Produk:</span> <strong className="text-rose-300">{tx.product_name}</strong></p>
                        <p><span className="text-gray-500">Tanggal:</span> <span className="text-gray-300">{formatDate(tx.created_at)}</span></p>
                      </div>
                      <p className="text-5xl font-black text-rose-400 mt-6">
                        {formatRupiah(tx.amount)}
                      </p>
                    </div>
                  </div>

                  {/* KANAN */}
                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(tx.user_game_id)
                        toast.success('ID berhasil dicopy!')
                      }}
                      className="bg-gray-800 hover:bg-rose-600/50 px-8 py-4 rounded-xl font-bold transition"
                    >
                      Copy ID
                    </button>
                    <a href="/" className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-700 hover:to-purple-700 px-10 py-4 rounded-xl font-bold text-white transition">
                      Top Up Lagi
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}