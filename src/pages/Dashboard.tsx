// src/pages/Dashboard.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useUser } from '../hooks/useUser';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Copy, Calendar, Tag, Hash, CheckCircle, Clock, XCircle, Loader } from 'lucide-react';

import games from '../data/games.json';

const gameIconMap = games.reduce((acc, game) => {
  acc[game.name] = game.icon;
  return acc;
}, {} as Record<string, string>);

interface Transaction {
  id: string;
  game_name: string;
  user_game_id: string;
  zone?: string;
  product_name: string;
  amount: number;
  status: 'success' | 'pending' | 'failed';
  created_at: string;
}

const statusConfig = {
  success: { text: 'Sukses', icon: <CheckCircle size={16} />, className: 'bg-green-500/10 text-green-400 border-green-500/30' },
  pending: { text: 'Menunggu', icon: <Clock size={16} />, className: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30' },
  failed: { text: 'Gagal', icon: <XCircle size={16} />, className: 'bg-red-500/10 text-red-400 border-red-500/30' },
};

const filters: Array<'all' | 'success' | 'pending' | 'failed'> = ['all', 'success', 'pending', 'failed'];

export default function Dashboard() {
  const { user, loading: userLoading } = useUser(); // Renamed for clarity
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionsLoading, setTransactionsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'success' | 'pending' | 'failed'>('all');

  const fetchTransactions = async () => {
    if (!user) return;
    setTransactionsLoading(true); // Ensure loading state is true before fetching
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      toast.error('Gagal memuat riwayat transaksi.');
    } else {
      setTransactions(data || []);
    }
    setTransactionsLoading(false); // Set to false after fetch completes
  };

  useEffect(() => {
    // This effect handles user authentication state changes
    if (!userLoading) {
      if (user) {
        fetchTransactions();
      } else {
        // Redirect to login only after we've confirmed there's no user
        navigate('/login');
      }
    }
  }, [user, userLoading, navigate]);

  const filteredTransactions = transactions.filter(tx => filterStatus === 'all' || tx.status === filterStatus);

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' });
  const formatRupiah = (num: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  // Initial full-page loader while user session is being verified
  if (userLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
            <div className="flex items-center gap-4 text-2xl text-gray-400">
                <Loader className="animate-spin text-rose-500" size={40}/>
                Memuat data pengguna...
            </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-black via-[#050010] to-[#0a001a] py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-10">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent mb-2">Riwayat Transaksi</h1>
            <p className="text-xl text-gray-400">Semua pesanan diamond kamu ada di sini.</p>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-8 p-2 bg-gray-900/70 border border-white/10 rounded-xl">
            {filters.map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`capitalize px-3 py-2 rounded-lg font-bold transition-all duration-300 text-center active:scale-[0.98] ${
                  filterStatus === f ? 'bg-rose-600 text-white shadow-[0_0_10px_rgba(225,29,72,0.5)]' : 'text-gray-400 hover:bg-white/5 active:bg-white/10'
                }`}
              >
                {f === 'all' ? 'Semua' : f === 'success' ? 'Sukses' : f === 'pending' ? 'Menunggu' : 'Gagal'}
              </button>
            ))}
          </div>

          {/* Content */}
          {transactionsLoading ? (
            <div className="text-center py-20 flex flex-col items-center justify-center gap-4">
                <Loader className="animate-spin text-rose-500" size={40}/>
                <span className="text-2xl text-gray-400">Memuat riwayat...</span>
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-20 bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-700">
              <h3 className="text-4xl text-gray-500 mb-4">
                {filterStatus === 'all' ? 'Kamu belum punya transaksi' : `Tidak ada transaksi dengan status "${filterStatus}"`}
              </h3>
              <p className="text-gray-600 mb-8">Ayo mulai top up pertama kamu!</p>
              <button onClick={() => navigate('/')} className="bg-gradient-to-r from-rose-600 to-purple-600 text-white font-black px-10 py-4 rounded-full text-xl hover:scale-105 active:scale-100 transition-transform shadow-lg">
                Top Up Sekarang
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredTransactions.map(tx => (
                <div key={tx.id} className="bg-gray-900/70 border border-white/10 rounded-2xl p-4 md:p-6 backdrop-blur-sm transition-all hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 active:scale-[0.99] active:border-rose-600/50 active:shadow-lg active:shadow-rose-600/10">
                  {/* --- Mobile View --- */}
                  <div className="md:hidden">
                    <div className="flex items-center gap-4 mb-4">
                      <img src={gameIconMap[tx.game_name] || 'https://via.placeholder.com/100/1a1a1a/FFFFFF?text=?'} alt={tx.game_name} className="w-16 h-16 rounded-lg border-2 border-white/10 object-cover"/>
                      <div className="flex-1">
                        <h2 className="text-xl font-bold text-white">{tx.game_name}</h2>
                        <div className={`flex items-center gap-2 text-xs font-bold px-2 py-0.5 rounded-full border w-fit mt-1 ${statusConfig[tx.status].className}`}>
                          {statusConfig[tx.status].icon}
                          {statusConfig[tx.status].text}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-gray-300 border-t border-white/10 pt-3">
                        <div className="flex justify-between">
                           <span className="text-gray-500 flex items-center gap-2"><Tag size={14} /> Produk</span>
                           <span className="font-semibold">{tx.product_name}</span>
                        </div>
                        <div className="flex justify-between">
                           <span className="text-gray-500 flex items-center gap-2"><Calendar size={14} /> Tanggal</span>
                           <span>{formatDate(tx.created_at)}</span>
                        </div>
                         <div className="flex justify-between items-center">
                           <span className="text-gray-500 flex items-center gap-2"><Hash size={14} /> ID Transaksi</span>
                           <span className="font-mono text-xs break-all">{tx.id.split('-')[0]}...</span>
                         </div>
                    </div>
                    <div className="flex justify-between items-center border-t border-white/10 mt-4 pt-4">
                        <div>
                          <p className="text-2xl font-bold text-rose-400">{formatRupiah(tx.amount)}</p>
                        </div>
                        <button
                          onClick={() => { navigator.clipboard.writeText(tx.id); toast.success('ID Transaksi disalin!'); }}
                          className="flex items-center gap-2 text-xs px-3 py-2 bg-gray-800 rounded-md hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 active:bg-rose-500/30 active:text-rose-500 transition-colors"
                        >
                          <Copy size={12} /> Salin ID
                        </button>
                    </div>
                  </div>

                  {/* --- Desktop View --- */}
                  <div className="hidden md:flex items-center gap-6">
                    <img src={gameIconMap[tx.game_name] || 'https://via.placeholder.com/100/1a1a1a/FFFFFF?text=?'} alt={tx.game_name} className="w-24 h-24 rounded-xl border-2 border-white/10 object-cover"/>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h2 className="text-2xl font-bold text-white">{tx.game_name}</h2>
                        <div className={`flex items-center gap-2 text-sm font-bold px-3 py-1 rounded-full border ${statusConfig[tx.status].className}`}>
                          {statusConfig[tx.status].icon}
                          {statusConfig[tx.status].text}
                        </div>
                      </div>
                      <div className="space-y-2 text-gray-300">
                         <div className="flex items-center gap-3">
                           <Tag size={16} className="text-gray-500" />
                           <span>{tx.product_name}</span>
                         </div>
                         <div className="flex items-center gap-3">
                           <Calendar size={16} className="text-gray-500" />
                           <span>{formatDate(tx.created_at)}</span>
                         </div>
                         <div className="flex items-center gap-3">
                            <Hash size={16} className="text-gray-500" />
                            <span className="font-mono text-sm break-all">{tx.id}</span>
                         </div>
                      </div>
                    </div>
                     <div className="flex flex-col items-end gap-3 self-center">
                        <p className="text-3xl font-bold text-rose-400">{formatRupiah(tx.amount)}</p>
                        <button
                          onClick={() => { navigator.clipboard.writeText(tx.id); toast.success('ID Transaksi disalin!'); }}
                          className="flex items-center gap-2 text-xs px-3 py-1.5 bg-gray-800 rounded-md hover:bg-rose-500/20 text-gray-300 hover:text-rose-400 transition-colors"
                        >
                          <Copy size={12} /> Salin ID
                        </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}