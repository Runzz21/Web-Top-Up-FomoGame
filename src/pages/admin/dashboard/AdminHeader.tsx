// fomogame/src/pages/admin/dashboard/AdminHeader.tsx
import { Search, Bell, ChevronDown, LogOut, Settings } from 'lucide-react';
import { useUser } from '../../../hooks/useUser';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react'; // Added for search and pending count logic

interface AdminHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const AdminHeader = ({ searchQuery, setSearchQuery }: AdminHeaderProps) => { // Accept searchQuery and setSearchQuery
  const { user, loading } = useUser();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchQuery); // Local state for debouncing
  const [pendingCount, setPendingCount] = useState(0); // State for pending count
  const [loadingPending, setLoadingPending] = useState(true); // Loading state for pending count

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchQuery(localSearchTerm);
    }, 500); // 500ms debounce

    return () => clearTimeout(handler);
  }, [localSearchTerm, setSearchQuery]);

  // Fetch jumlah pesanan pending + real-time
  useEffect(() => {
    const fetchPendingCount = async () => {
      const { data, error } = await supabase
        .from('pending_orders_count') // Assumes this view/table exists
        .select('jumlah_pending')
        .single();

      if (error) {
        console.error('Error fetch pending count:', error);
      } else {
        setPendingCount(data.jumlah_pending || 0);
      }
      setLoadingPending(false);
    };

    fetchPendingCount();

    // Real-time: setiap ada transaksi status pending/processing → update bell
    const subscription = supabase
      .channel('pending-orders-bell')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'transactions',
        filter: "status=in.(pending,processing,Pending,Processing)"
      }, () => {
        fetchPendingCount();
      })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Logout error:', error);
      toast.error('Gagal logout: ' + error.message);
    } else {
      toast.success('Berhasil logout!', { id: 'logout' });
      window.location.href = '/'; // Redirect to the general home page with a full reload
    }
  };

  const avatarUrl = user?.user_metadata?.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${user?.id || 'admin'}`;
  const userName = user?.user_metadata?.name || 'Admin';
  const userEmail = user?.email || '';

  return (
    <header className="bg-black/80 backdrop-blur-lg fixed top-0 left-64 right-0 z-30 border-b border-gray-800/50 shadow-lg shadow-purple-500/5">
      <div className="flex items-center justify-end h-20 px-8">

        {/* Search, Notifications, Profile */}
        <div className="flex items-center space-x-6">

          {/* Notification Bell dengan jumlah pending */}
          <div className="relative group">
            <Bell className="text-gray-300 hover:text-white transition-colors cursor-pointer" size={26} />
            {loadingPending ? (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gray-600 animate-pulse" />
            ) : pendingCount > 0 ? (
              <>
                <span className="absolute -top-1 -right-1 flex h-6 w-6">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500 justify-center items-center text-xs font-bold text-white">
                    {pendingCount > 99 ? '99+' : pendingCount}
                  </span>
                </span>
                <div className="absolute top-full mt-3 right-0 w-64 bg-gray-900/95 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none group-hover:pointer-events-auto">
                  <div className="p-4">
                    <p className="font-bold text-white">Pesanan Menunggu Konfirmasi</p>
                    <p className="text-sm text-gray-400 mt-1">{pendingCount} transaksi pending</p>
                  </div>
                </div>
              </>
            ) : null}
          </div>

          {/* Admin Profile */}
          <div className="relative group">
            <div className="flex items-center space-x-3 cursor-pointer">
              {loading ? (
                <div className="h-10 w-10 rounded-full bg-gray-700 animate-pulse" />
              ) : (
                <img
                  src={avatarUrl}
                  alt="Admin Avatar"
                  className="h-10 w-10 rounded-full border-2 border-purple-500/50"
                />
              )}
              <div className="hidden lg:block">
                <p className="font-semibold text-white">{userName}</p>
                <p className="text-xs text-gray-400">{userEmail}</p>
              </div>
              <ChevronDown size={20} className="text-gray-500 group-hover:text-white transition-transform duration-300 group-hover:rotate-180" />
            </div>
            {/* Dropdown Menu */}
            <div className="absolute right-0 top-full mt-3 w-48 bg-gray-900/90 backdrop-blur-xl border border-gray-800 rounded-lg shadow-2xl shadow-black/50 opacity-0 group-hover:opacity-100 transform scale-95 group-hover:scale-100 transition-all duration-300 origin-top-right">
              <a href="/admin/settings" className="flex items-center gap-3 px-4 py-2 text-sm text-gray-300 hover:bg-gray-800/50 hover:text-white">
                <Settings size={16}/>
                Pengaturan
              </a>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-gray-800/50 hover:text-red-500"
              >
                <LogOut size={16}/>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;