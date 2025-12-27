// fomogame/src/pages/admin/AdminDashboard.tsx
import { ShoppingCart, Users, Loader2, PackageOpen } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast';

interface Order {
    amount: string;
    created_at: string;
    status: string;
}

interface RevenueData {
    total_pendapatan: number;
    total_transaksi_sukses: number;
}
// Definisi tipe baru untuk data user dari RPC
interface User {
  id: string
  email?: string
  raw_user_meta_data?: {
    name?: string
  }
}
// NOTE: Charts are temporarily commented out to prevent crashes.
// import { RevenueChart, TopGamesChart } from './dashboard/Chart';

interface AdminDashboardProps {
  searchQuery?: string;
}

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Success': return 'bg-green-500/20 text-green-400 border border-green-500/30';
        case 'Processing': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        case 'Failed': return 'bg-red-500/20 text-red-400 border border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const AdminDashboard = ({ searchQuery = '' }: AdminDashboardProps) => { // Accept searchQuery prop
    const [loading, setLoading] = useState(true);
    const [userStats, setUserStats] = useState({
      total_pengguna_terdaftar: 0,
      pengguna_bulan_ini: 0,
      pengguna_minggu_ini: 0,
      pengguna_hari_ini: 0
    })
    const [usersMap, setUsersMap] = useState<Map<string, User>>(new Map()) // State untuk mapping user


    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // This useEffect only sets loading to true initially, actual data fetching and setting loading to false is handled by other specific useEffects
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
                // Optionally set error state to display to user
            } finally {
                // Loading state will be set to false by the last data fetching useEffect (orderStats)
            }
        };

        fetchData();
    }, []); // Run once on component mount

    useEffect(() => {
      const fetchUserStats = async () => {
        const { data, error } = await supabase
          .from('user_stats')
          .select('*')
          .single()

        if (error) {
          console.error('Error fetch user stats:', error)
          toast.error('Gagal memuat statistik pengguna')
        } else {
          setUserStats(data as any) // Assuming data structure matches userStats
        }
      }

      fetchUserStats()

      // Real-time update kalau ada user baru daftar
      const subscription = supabase
        .channel('user-stats-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'profiles' }, () => {
          fetchUserStats()
        })
        .subscribe()

      return () => supabase.removeChannel(subscription)
    }, [])

    const [orderStats, setOrderStats] = useState({
      total_pesanan_hari_ini: 0,
      pesanan_sukses_hari_ini: 0,
      pesanan_pending_hari_ini: 0, // New field for pending orders today
      pesanan_gagal_hari_ini: 0,   // New field for failed orders today
      pendapatan_hari_ini: 0,
      total_pesanan_minggu_ini: 0,
      pendapatan_minggu_ini: 0,
      total_pesanan_bulan_ini: 0,
      pendapatan_bulan_ini: 0,
      total_pesanan_semua: 0,
      pendapatan_total: 0
    })

    useEffect(() => {
      const fetchOrderStats = async () => {
        const { data, error } = await supabase
          .from('order_stats')
          .select(`*, pesanan_pending_hari_ini, pesanan_gagal_hari_ini`) // Update select query to include new fields
          .single()

        if (error) {
          console.error('Error fetch order stats:', error)
          toast.error('Gagal memuat statistik pesanan')
        } else {
          setOrderStats(data as any) // Assuming data structure matches orderStats
        }
        setLoading(false); // Set loading to false once order stats are fetched
      }

      fetchOrderStats()

      // Real-time update setiap ada transaksi baru
      const subscription = supabase
        .channel('order-stats-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
          fetchOrderStats()
        })
        .subscribe()

      return () => supabase.removeChannel(subscription)
    }, [])

    const [revenue, setRevenue] = useState<RevenueData>({ total_pendapatan: 0, total_transaksi_sukses: 0 })

    useEffect(() => {
      const fetchRevenue = async () => {
        const { data, error } = await supabase
          .from('total_revenue')
          .select('*')
          .single()

        if (error) {
          console.error('Error fetch revenue:', error)
          toast.error('Gagal memuat pendapatan')
        } else {
          setRevenue(data as any)
        }
        setLoading(false); // Set loading to false once revenue data is fetched (last one)
      }

      fetchRevenue()

      // Real-time update kalau ada transaksi baru
      const subscription = supabase
        .channel('revenue-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
          fetchRevenue()
        })
        .subscribe()

      return () => {
        supabase.removeChannel(subscription)
      }
    }, [])

    const [recentOrders, setRecentOrders] = useState<any[]>([])
    const [loadingRecent, setLoadingRecent] = useState(true)


    const fetchRecentOrders = async () => {
      try {
        setLoadingRecent(true)

        // 1. Fetch transactions and users in parallel
        const [transactionsResponse, usersResponse] = await Promise.all([
          supabase
            .from('transactions')
            .select(`
              id,
              created_at,
              user_id,
              game_name,
              product_name,
              amount,
              payment_method,
              status,
              user_game_id,
              zone
            `)
            .order('created_at', { ascending: false })
            .limit(10),
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

        let filteredTransactions = transactionsResponse.data || [];

        // Apply search filter if searchQuery is present
        if (searchQuery) {
          const searchLower = searchQuery.toLowerCase();
          filteredTransactions = filteredTransactions.filter((tx: any) => {
            const user = newUsersMap.get(tx.user_id);
            const userName = user?.raw_user_meta_data?.name?.toLowerCase() || '';
            const userEmail = user?.email?.toLowerCase() || '';

            return (
              tx.id.toLowerCase().includes(searchLower) ||
              tx.game_name.toLowerCase().includes(searchLower) ||
              tx.product_name.toLowerCase().includes(searchLower) ||
              tx.user_game_id.toLowerCase().includes(searchLower) ||
              tx.zone?.toLowerCase().includes(searchLower) ||
              tx.payment_method.toLowerCase().includes(searchLower) ||
              tx.status.toLowerCase().includes(searchLower) ||
              userName.includes(searchLower) ||
              userEmail.includes(searchLower)
            );
          });
        }

        setRecentOrders(filteredTransactions)
      } catch (err: any) {
        console.error('Error fetch recent orders:', err)
        toast.error('Gagal memuat pesanan terbaru')
      } finally {
        setLoadingRecent(false)
      }
    }

    useEffect(() => {
      fetchRecentOrders()

      // Real-time subscription — otomatis update kalau ada pesanan baru
      const subscription = supabase
        .channel('recent-orders-changes')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'transactions' }, (payload) => {
          setRecentOrders(current => [payload.new, ...current.slice(0, 9)]) // Tambah yang baru di atas
        })
        .subscribe()

      return () => supabase.removeChannel(subscription)
    }, [searchQuery]) // Add searchQuery to dependency array
    return (
        <div className="space-y-10 py-8 px-4 md:px-6 lg:px-8">
            {/* Welcome Section */}
            <div className="mb-12">
                <h1 className="text-5xl font-extrabold text-white mb-2 bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                    Dashboard Admin
                </h1>
                <p className="text-xl text-gray-400 font-light">
                    Kelola FomoGame dengan mudah & cepat. Selamat Datang Kembali!
                </p>
            </div>

            {/* Total Pendapatan Section */}
            {loading ? (
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl h-40 sm:h-48 md:h-auto animate-pulse mb-12"></div>
            ) : (
                <div className="bg-gradient-to-br from-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 md:p-10 shadow-2xl transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-indigo-500/40 mb-12">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white mb-2 sm:mb-3 md:mb-4">Total Pendapatan</h2>
                    <div className="text-4xl sm:text-5xl md:text-7xl font-black text-white drop-shadow-lg">
                        Rp{revenue.total_pendapatan.toLocaleString('id-ID')}
                    </div>
                    <p className="text-base sm:text-lg md:text-xl text-indigo-200 mt-4 sm:mt-5 md:mt-6 font-medium">
                        Dari {revenue.total_transaksi_sukses} transaksi sukses
                    </p>
                </div>
            )}

            {/* Order Statistics Section */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-3xl p-8 shadow-2xl h-48 animate-pulse"></div>
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-3xl p-8 shadow-2xl h-48 animate-pulse"></div>
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-3xl p-8 shadow-2xl h-48 animate-pulse"></div>
                </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                {/* Pesanan Hari Ini */}
                <div className="bg-gradient-to-br from-blue-700 to-cyan-700 rounded-3xl p-6 sm:p-8 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-blue-500/40 shadow-xl">
                  <p className="text-blue-100 mb-2 sm:mb-3 text-lg sm:text-xl font-semibold">Pesanan Hari Ini</p>
                  <p className="text-4xl sm:text-6xl font-black text-white">{orderStats.total_pesanan_hari_ini.toLocaleString()}</p>
                  <p className="text-cyan-200 mt-1 sm:mt-2 text-base sm:text-lg">Sukses: {orderStats.pesanan_sukses_hari_ini}</p>
                  <p className="text-yellow-200 text-base sm:text-lg">Pending: {orderStats.pesanan_pending_hari_ini}</p>
                  <p className="text-red-300 text-base sm:text-lg">Gagal: {orderStats.pesanan_gagal_hari_ini}</p>
                </div>

                {/* Pesanan Minggu Ini */}
                <div className="bg-gradient-to-br from-fuchsia-700 to-rose-700 rounded-3xl p-6 sm:p-8 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-fuchsia-500/40 shadow-xl">
                  <p className="text-fuchsia-100 mb-2 sm:mb-3 text-lg sm:text-xl font-semibold">Pesanan Minggu Ini</p>
                  <p className="text-4xl sm:text-6xl font-black text-white">{orderStats.total_pesanan_minggu_ini.toLocaleString()}</p>
                  <p className="text-rose-200 mt-1 sm:mt-2 text-base sm:text-lg">Pendapatan: Rp{orderStats.pendapatan_minggu_ini.toLocaleString('id-ID')}</p>
                </div>

                {/* Pesanan Bulan Ini */}
                <div className="bg-gradient-to-br from-purple-700 to-indigo-700 rounded-3xl p-6 sm:p-8 shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-purple-500/40">
                  <p className="text-purple-100 mb-3 sm:mb-4 text-lg sm:text-xl font-semibold">Pesanan Bulan Ini</p>
                  <p className="text-5xl sm:text-7xl font-black text-white">{orderStats.total_pesanan_bulan_ini.toLocaleString()}</p>
                  <p className="text-indigo-200 mt-2 sm:mt-4 text-xl sm:text-3xl font-bold">
                    Pendapatan: Rp{orderStats.pendapatan_bulan_ini.toLocaleString('id-ID')}
                  </p>
                </div>
              </div>
            )}

            {/* User Statistics Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6 h-36 animate-pulse"></div>
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6 h-36 animate-pulse"></div>
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6 h-36 animate-pulse"></div>
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6 h-36 animate-pulse"></div>
                </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {/* Total Pengguna Terdaftar */}
                <div className="bg-gradient-to-br from-teal-700 to-green-700 rounded-3xl p-8 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-teal-500/40 shadow-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Users className="text-teal-200" size={36} />
                    <span className="text-teal-100 text-xl font-semibold">Total Pengguna</span>
                  </div>
                  <div className="text-6xl font-black text-white">{userStats.total_pengguna_terdaftar.toLocaleString()}</div>
                </div>

                {/* Pengguna Baru Bulan Ini */}
                <div className="bg-gradient-to-br from-red-700 to-amber-700 rounded-3xl p-8 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-red-500/40 shadow-xl">
                  <p className="text-red-100 mb-3 text-xl font-semibold">Pengguna Bulan Ini</p>
                  <p className="text-5xl font-black text-white">+{userStats.pengguna_bulan_ini.toLocaleString()}</p>
                </div>

                {/* Pengguna Baru Minggu Ini */}
                <div className="bg-gradient-to-br from-orange-700 to-yellow-700 rounded-3xl p-8 transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-orange-500/40 shadow-xl">
                  <p className="text-orange-100 mb-3 text-xl font-semibold">Pengguna Minggu Ini</p>
                  <p className="text-5xl font-black text-white">+{userStats.pengguna_minggu_ini.toLocaleString()}</p>
                </div>

                {/* Pengguna Baru Hari Ini */}
                <div className="bg-gradient-to-br from-lime-700 to-emerald-700 rounded-3xl p-8 shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-2 hover:shadow-lime-500/40">
                  <p className="text-lime-100 mb-3 text-xl font-semibold">Pengguna Hari Ini</p>
                  <p className="text-6xl font-black text-white">+{userStats.pengguna_hari_ini}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-8 mt-12">
              {/* Recent Orders Table */}
              <div className="col-span-3 xl:col-span-3 bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6">
                <h2 className="text-xl font-semibold text-white mb-4">Pesanan Terbaru</h2>
                {loadingRecent ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, index) => (
                      <div key={index} className="h-16 bg-gray-800/50 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                      <table className="w-full text-left">
                          <thead>
                              <tr className="border-b border-gray-700/50 text-base font-medium text-gray-300">
                                  <th className="px-3 py-4">ID Pesanan</th>
                                  <th className="px-3 py-4">Game</th>
                                  <th className="px-3 py-4">User</th>
                                  <th className="px-3 py-4 hidden md:table-cell">Produk</th>
                                  <th className="px-3 py-4">Jumlah</th>
                                  <th className="px-3 py-4 hidden md:table-cell">Pembayaran</th>
                                  <th className="px-3 py-4 text-center">Status</th>
                              </tr>
                          </thead>
                          <tbody>
                              {recentOrders.map((order) => (
                                  <tr key={order.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                                      <td className="px-3 py-4">
                                        <span className="font-mono text-xs text-gray-300">{order.id}</span>
                                        <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleString()}</p>
                                      </td>
                                      <td className="px-3 py-4 font-semibold text-white">{order.game_name}</td>
                                      <td className="px-3 py-4">
                                        {(() => {
                                          const user = usersMap.get(order.user_id);
                                          const userName = user?.raw_user_meta_data?.name || 'User Tidak Diketahui';
                                          const userEmail = user?.email || 'Email Tidak Tersedia';
                                          return (
                                            <>
                                              <p className="text-white text-sm font-medium">{userName}</p>
                                              <p className="text-xs text-gray-500">{userEmail}</p>
                                            </>
                                          );
                                        })()}
                                      </td>
                                      <td className="px-3 py-4 text-gray-400 hidden md:table-cell">{order.product_name}</td>
                                      <td className="px-3 py-4 text-gray-300">Rp{order.amount.toLocaleString('id-ID')}</td>
                                      <td className="px-3 py-4 text-gray-400 hidden md:table-cell">{order.payment_method}</td>
                                      <td className="px-3 py-4 text-center">
                                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(order.status)}`}>
                                              {order.status}
                                          </span>
                                      </td>
                                  </tr>
                              ))}
                          </tbody>
                      </table>
                  </div>
                )}
              </div>

            </div>

            {/* Charts Section - Temporarily Hidden */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 hidden">
                <div className="lg:col-span-3 bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Pendapatan 30 Hari Terakhir</h2>
                    {/* <RevenueChart /> */}
                </div>
                <div className="lg:col-span-2 bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6">
                    <h2 className="text-xl font-semibold text-white mb-4">Top 5 Game (Revenue)</h2>
                    {/* <TopGamesChart /> */}
                </div>
            </div>
            
        </div>
    );
};

export default AdminDashboard;