// fomogame/src/pages/admin/Payments.tsx
import { Banknote, Wallet, Store, Star, Plus, Edit } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';

// Import payment logos
import dana from '../../assets/payment-logos/dana.webp';
import gopay from '../../assets/payment-logos/gopay.webp';
import ovo from '../../assets/payment-logos/ovo.webp';
import shoopepay from '../../assets/payment-logos/shoopepay.webp';
import qris from '../../assets/payment-logos/qris.webp';
import alfamart from '../../assets/payment-logos/alfamart.webp';
import indomaret from '../../assets/payment-logos/indomaret.webp';
import bank from '../../assets/payment-logos/bank-transfer.webp';
import card from '../../assets/payment-logos/kartu-kredit.webp';


const paymentMethods = [
  { name: 'GoPay', logo: gopay, fee: 1.5, active: true },
  { name: 'DANA', logo: dana, fee: 1.2, active: true },
  { name: 'OVO', logo: ovo, fee: 1.8, active: true },
  { name: 'ShopeePay', logo: shoopepay, fee: 1.5, active: true },
  { name: 'QRIS', logo: qris, fee: 0.7, active: true },
  { name: 'Alfamart', logo: alfamart, fee: 2.0, active: true },
  { name: 'Indomaret', logo: indomaret, fee: 2.0, active: false },
  { name: 'Bank Transfer', logo: bank, fee: 0.5, active: true },
  { name: 'Kartu Kredit', logo: card, fee: 2.5, active: true },
];

const feeSettings = [
    { method: 'GoPay', admin_fee: '1.5%', user_fee: 'Rp1.000', status: 'Aktif' },
    { method: 'DANA', admin_fee: '1.2%', user_fee: 'Rp1.000', status: 'Aktif' },
    { method: 'OVO', admin_fee: '1.8%', user_fee: 'Rp1.500', status: 'Aktif' },
    { method: 'Alfamart', admin_fee: '2.0%', user_fee: 'Rp2.500', status: 'Aktif' },
    { method: 'Indomaret', admin_fee: '2.0%', user_fee: 'Rp2.500', status: 'Nonaktif' },
];

const gatewayLogs = [
    { time: '14:02:15', method: 'QRIS', amount: 'Rp150.000', status: 'SUCCESS', orderId: 'ORD-241225-001' },
    { time: '14:01:50', method: 'Gopay', amount: 'Rp250.000', status: 'SUCCESS', orderId: 'ORD-241225-002' },
    { time: '14:01:10', method: 'Dana', amount: 'Rp79.000', status: 'PENDING', orderId: 'ORD-241225-003' },
    { time: '13:59:05', method: 'OVO', amount: 'Rp95.000', status: 'FAILED', orderId: 'ORD-241225-004' },
]

const Payments = () => {
  const [groupStats, setGroupStats] = useState<any[]>([])
  const [popularMethods, setPopularMethods] = useState<any[]>([])
  const [loadingStats, setLoadingStats] = useState(true)

  useEffect(() => {
    const fetchPaymentStats = async () => {
      try {
        setLoadingStats(true)

        // Fetch kelompok (E-Wallet, Minimarket, dll)
        const { data: groupData, error: groupError } = await supabase
          .from('payment_stats_grouped')
          .select('kategori, total_transaksi, transaksi_sukses, pendapatan_kelompok, success_rate')

        // Fetch top metode
        const { data: popularData, error: popularError } = await supabase
          .from('payment_methods_popular')
          .select('payment_method, total_transaksi, transaksi_sukses, pendapatan, success_rate')

        if (groupError || popularError) throw groupError || popularError

        setGroupStats(groupData || [])
        setPopularMethods(popularData || [])
      } catch (err: any) {
        console.error('Error fetch payment stats:', err)
        toast.error('Gagal memuat statistik pembayaran')
      } finally {
        setLoadingStats(false)
      }
    }

    fetchPaymentStats()

    // Real-time update setiap ada transaksi baru
    const subscription = supabase
      .channel('payment-stats-all')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'transactions' }, () => {
        fetchPaymentStats()
      })
      .subscribe()

    return () => supabase.removeChannel(subscription)
  }, [])
    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-sky-400 to-blue-500 bg-clip-text text-transparent">Kelola Metode Pembayaran</h1>
                    <p className="text-gray-400 mt-1">Atur gateway pembayaran, fee, dan status operasional.</p>
                </div>
                 
            </div>

            {/* KELOMPOK METODE PEMBAYARAN */}
            {loadingStats ? (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="rounded-3xl p-8 shadow-2xl bg-gray-900/50 backdrop-blur-lg h-48 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                {groupStats.map((group) => (
                  <div key={group.kategori} className={`rounded-3xl p-8 shadow-2xl border ${
                    group.kategori === 'Semua Metode' ? 'bg-gradient-to-r from-rose-600 to-purple-700 border-rose-500/50' :
                    group.kategori === 'E-Wallet' ? 'bg-gradient-to-r from-emerald-600 to-teal-600 border-emerald-500/50' :
                    group.kategori === 'Minimarket' ? 'bg-gradient-to-r from-orange-600 to-amber-600 border-orange-500/50' :
                    group.kategori === 'Bank/Kartu' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-500/50' :
                    'bg-gradient-to-r from-gray-600 to-gray-700 border-gray-500/50'
                  }`}>
                    <p className="text-white/80 text-lg mb-3">{group.kategori}</p>
                    <p className="text-4xl font-black text-white mb-2">
                      Rp{group.pendapatan_kelompok.toLocaleString('id-ID')}
                    </p>
                    <div className="text-white/70 text-sm space-y-1">
                      <p>{group.transaksi_sukses.toLocaleString()} sukses dari {group.total_transaksi.toLocaleString()} transaksi</p>
                      <p>{group.success_rate}% success rate</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* METODE TERPOPULER */}
            <div className="bg-gray-900/80 backdrop-blur-2xl rounded-3xl border border-gray-800 shadow-2xl p-8 mb-12">
              <h2 className="text-3xl font-black text-rose-400 mb-6">Metode Terpopuler</h2>
              {loadingStats ? (
                <div className="space-y-4">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-800/50 rounded-2xl animate-pulse" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {popularMethods.map((method, index) => (
                    <div key={method.payment_method} className="bg-gray-800/60 rounded-2xl p-5 hover:bg-gray-800/80 transition flex items-center justify-between">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-gradient-to-br from-rose-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl font-black text-white">
                          {index + 1}
                        </div>
                        <div>
                          <p className="text-xl font-bold text-white capitalize">
                            {method.payment_method.replace('_', ' ')}
                          </p>
                          <p className="text-sm text-gray-400">
                            {method.transaksi_sukses} sukses • {method.success_rate}% rate
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-black text-rose-400">
                          Rp{method.pendapatan.toLocaleString('id-ID')}
                        </p>
                        <p className="text-sm text-gray-400">{method.total_transaksi} transaksi</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Payment Methods Grid */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">Konfigurasi Gateway</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
                {paymentMethods.map(method => (
                    <div key={method.name} className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-4 transition-all duration-300 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10">
                        <img src={method.logo} alt={method.name} className="h-16 w-full object-contain rounded-lg mb-4" />
                        <div className="flex justify-between items-center mb-3">
                             <div className="relative inline-block w-10 mr-2 align-middle select-none"><input type="checkbox" defaultChecked={method.active} name={method.name} id={method.name} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/><label htmlFor={method.name} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label></div>
                            <span className={`text-xs font-bold ${method.active ? 'text-green-400' : 'text-gray-500'}`}>{method.active ? 'Aktif' : 'Nonaktif'}</span>
                        </div>
                        <div className="relative mb-3">
                            <input type="number" defaultValue={method.fee} className="w-full bg-gray-800/60 border-gray-700 rounded-lg text-sm p-2 text-white pr-6"/>
                            <span className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                        </div>
                        <button className="w-full p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold text-gray-300 flex items-center justify-center gap-2"><Edit size={14}/> Atur</button>
                    </div>
                ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 {/* Transaction Fee Settings */}
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6">
                     <h2 className="text-xl font-semibold text-white mb-4">Pengaturan Fee Transaksi</h2>
                     <table className="w-full text-left">
                        <thead><tr className="border-b border-gray-800/70 text-sm text-gray-400"><th className="py-3 font-normal">Metode</th><th className="py-3 font-normal">Fee Admin</th><th className="py-3 font-normal">Fee User</th><th className="py-3 font-normal">Status</th><th className="py-3 font-normal">Aksi</th></tr></thead>
                        <tbody>
                            {feeSettings.map(f => (
                                <tr key={f.method} className="border-b border-gray-800 text-sm">
                                    <td className="py-3 font-semibold text-white">{f.method}</td>
                                    <td className="py-3 text-gray-300">{f.admin_fee}</td>
                                    <td className="py-3 text-gray-300">{f.user_fee}</td>
                                    <td><span className={`text-xs font-bold ${f.status === 'Aktif' ? 'text-green-400' : 'text-gray-500'}`}>{f.status}</span></td>
                                    <td><button className="text-gray-400 hover:text-blue-400"><Edit size={16}/></button></td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>

                {/* Recent Gateway Logs */}
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6">
                     <h2 className="text-xl font-semibold text-white mb-4">Log Gateway Terbaru</h2>
                     <table className="w-full text-left">
                        <thead><tr className="border-b border-gray-800/70 text-sm text-gray-400"><th className="py-3 font-normal">Waktu</th><th className="py-3 font-normal">Metode</th><th className="py-3 font-normal">Status</th><th className="py-3 font-normal">Order ID</th></tr></thead>
                        <tbody>
                            {gatewayLogs.map((log, i) => (
                                <tr key={i} className="border-b border-gray-800 text-sm">
                                    <td className="py-2 font-mono text-xs text-gray-500">{log.time}</td>
                                    <td className="py-2 font-semibold text-white">{log.method}</td>
                                    <td className="py-2"><span className={`font-bold text-xs ${log.status === 'SUCCESS' ? 'text-green-400' : log.status === 'PENDING' ? 'text-yellow-400' : 'text-red-500'}`}>{log.status}</span></td>
                                    <td className="py-2 font-mono text-xs text-gray-500">{log.orderId}</td>
                                </tr>
                            ))}
                        </tbody>
                     </table>
                </div>
            </div>
             <style>{`.toggle-checkbox:checked { right: 0; border-color: #4c51bf; } .toggle-checkbox:checked + .toggle-label { background-color: #4c51bf; }`}</style>
        </div>
    );
};

export default Payments;