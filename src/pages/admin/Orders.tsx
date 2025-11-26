// src/pages/admin/Orders.tsx

import { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout'; // Komponen yang diimpor
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react'; // Tambahkan untuk loading state

// Pastikan Anda membuat interface/type yang lebih spesifik untuk 'Order' di proyek nyata.
type Order = {
    id: string;
    email: string;
    game_name: string;
    product_name: string;
    amount: number;
    status: 'pending' | 'success' | 'failed';
    created_at: string;
};

export default function Orders() {
    // Gunakan type Order[]
    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true); // State loading baru

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) {
            toast.error('Gagal memuat data order.');
            console.error('Error fetching orders:', error);
        }

        setOrders(data || []);
        setIsLoading(false);
    };

    const updateStatus = async (id: string, status: 'success' | 'failed') => {
        // Logika sederhana untuk mencegah tombol diklik berulang
        if (window.confirm(`Yakin ingin mengubah status menjadi ${status}?`)) {
            const { error } = await supabase
                .from('transactions')
                .update({ status })
                .eq('id', id);

            if (error) {
                toast.error('Gagal update status!');
            } else {
                toast.success(`Status berhasil diubah menjadi ${status.toUpperCase()}!`);
                fetchOrders(); // Refresh data setelah update
            }
        }
    };

    // --- KOREKSI: PENGGUNAAN ADMIN LAYOUT DI SINI ---
    return (
        
            <div className="p-8">
                <h1 className="text-6xl font-black gradient-text mb-10">All Orders</h1>

                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <Loader2 className="w-8 h-8 animate-spin gradient-text" />
                        <p className="ml-3 text-lg text-gray-400">Memuat data pesanan...</p>
                    </div>
                ) : (
                    <div className="bg-gray-900/90 rounded-3xl border border-gray-800 overflow-hidden shadow-xl">
                        <div className="overflow-x-auto">
                            <table className="min-w-full">
                                <thead className="bg-gray-800 border-b border-gray-700">
                                    <tr>
                                        <th className="p-4 text-left text-gray-300">Email</th>
                                        <th className="p-4 text-left text-gray-300">Game</th>
                                        <th className="p-4 text-left text-gray-300">Produk</th>
                                        <th className="p-4 text-left text-gray-300">Harga</th>
                                        <th className="p-4 text-left text-gray-300">Status</th>
                                        <th className="p-4 text-left text-gray-300">Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.length === 0 ? (
                                        <tr>
                                            <td colSpan={6} className="p-8 text-center text-gray-500">
                                                Tidak ada pesanan yang ditemukan.
                                            </td>
                                        </tr>
                                    ) : (
                                        orders.map(o => (
                                            <tr key={o.id} className="border-t border-gray-800 hover:bg-gray-800 transition duration-150">
                                                <td className="p-4 text-gray-300">{o.email}</td>
                                                <td className="p-4 text-gray-300">{o.game_name}</td>
                                                <td className="p-4 text-gray-300">{o.product_name}</td>
                                                <td className="p-4 text-rose-400 font-bold">Rp{o.amount.toLocaleString('id-ID')}</td>
                                                <td className="p-4">
                                                    <span className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize ${
                                                        o.status === 'success' ? 'bg-green-500/20 text-green-400' :
                                                        o.status === 'failed' ? 'bg-red-500/20 text-red-400' :
                                                        'bg-yellow-500/20 text-yellow-400'
                                                    }`}>
                                                        {o.status}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    {o.status === 'pending' && (
                                                        <div className='flex space-x-2'>
                                                            <button 
                                                                onClick={() => updateStatus(o.id, 'success')} 
                                                                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg text-white text-sm transition"
                                                            >
                                                                Success
                                                            </button>
                                                            <button 
                                                                onClick={() => updateStatus(o.id, 'failed')} 
                                                                className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg text-white text-sm transition"
                                                            >
                                                                Failed
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
    )
}