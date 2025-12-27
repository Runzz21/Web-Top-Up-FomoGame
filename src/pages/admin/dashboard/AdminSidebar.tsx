// fomogame/src/pages/admin/dashboard/AdminSidebar.tsx
import {
  LayoutDashboard, Gamepad2, Diamond, Receipt, Users, Gift, CreditCard, Settings, LogOut, X
} from 'lucide-react';
import logo from '../../../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../../../lib/supabase';
import toast from 'react-hot-toast';

interface MenuItem {
  name: string;
  icon: React.ElementType;
  path: string;
  action?: never; // Ensures 'action' is not present for MenuItem
}

interface ActionItem {
  name: string;
  icon: React.ElementType;
  action: 'logout';
  path?: never; // Ensures 'path' is not present for ActionItem
}

const menuItems: MenuItem[] = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/admin' },
  { name: 'Kelola Game', icon: Gamepad2, path: '/admin/games' },
  { name: 'Produk & Harga', icon: Diamond, path: '/admin/products' },
  { name: 'Pesanan', icon: Receipt, path: '/admin/orders' },
  { name: 'Pengguna', icon: Users, path: '/admin/users' },
  { name: 'Promo & Bonus', icon: Gift, path: '/admin/promos' },
  { name: 'Metode Pembayaran', icon: CreditCard, path: '/admin/payments' },
];

const bottomMenuItems: (MenuItem | ActionItem)[] = [
    { name: 'Pengaturan', icon: Settings, path: '/admin/settings' },
    { name: 'Logout', icon: LogOut, action: 'logout' },
]

interface AdminSidebarProps {
    isSidebarOpen: boolean;
    setSidebarOpen: (isOpen: boolean) => void;
}

const AdminSidebar = ({ isSidebarOpen, setSidebarOpen }: AdminSidebarProps) => {
  const location = useLocation();
  const pathname = location.pathname;

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

  return (
    <>
      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      <aside className={`fixed top-0 h-full w-64 bg-black/50 backdrop-blur-2xl border-r border-gray-800/50 z-40 flex flex-col shadow-2xl shadow-purple-500/10 transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:fixed md:left-0 md:w-64 md:flex md:flex-col`}>
        {/* Header */}
        <div className="flex items-center justify-center h-20 border-b border-gray-800/50 relative">
          <div className="relative">
              <img src={logo} alt="FomoGame Logo" className="h-14 w-14 rounded-full" />
              <div className="absolute inset-0 rounded-full ring-2 ring-pink-500/70 animate-pulse duration-slow"/>
          </div>
          <h1 className="text-2xl font-bold text-white ml-3">
            <span className="bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
              FomoGame
            </span>
          </h1>
          {/* Close button for mobile */}
          <button 
            className="md:hidden absolute top-4 right-4 text-gray-400 hover:text-white"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={24} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setSidebarOpen(false)} // Close sidebar on item click
                className={`flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800/50 hover:text-white transition-all duration-200 group relative ${isActive ? 'text-white bg-gray-800/70' : ''}`}
              >
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-rose-500 rounded-r-full shadow-lg shadow-rose-500/50 animate-[pulse_2s_ease-in-out_infinite]"></span>
                )}
                <item.icon size={22} className="mr-4" />
                <span className="font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom Menu */}
        <div className="px-4 py-6 border-t border-gray-800/50 space-y-2">
        {bottomMenuItems.map((item) => {
          if (item.action === 'logout') {
            return (
              <button
                key={item.name}
                onClick={() => { handleLogout(); setSidebarOpen(false); }} // Close sidebar on logout
                className="flex items-center px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800/50 hover:text-red-500 transition-all duration-200 group w-full md:hidden" // Hidden on desktop
              >
                <item.icon size={22} className="mr-4" />
                <span className="font-semibold">{item.name}</span>
              </button>
            )
          } else {
            // If it's not a logout action, it must be a MenuItem (with a path)
            const menuItem = item as MenuItem; // Cast to MenuItem
            const isActive = pathname === menuItem.path;
            return(
              <Link
                key={menuItem.name}
                to={menuItem.path}
                onClick={() => setSidebarOpen(false)} // Close sidebar on item click
                className={`flex items-center px-4 py-3 rounded-lg text-gray-400 hover:bg-gray-800/50 transition-all duration-200 group ${isActive ? 'text-white bg-gray-800/70' : ''} md:hidden`} // Hidden on desktop
              >
                {isActive && menuItem.name === 'Pengaturan' && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-rose-500 rounded-r-full shadow-lg shadow-rose-500/50 animate-[pulse_2s_ease-in-out_infinite]"></span>
                )}
                <menuItem.icon size={22} className="mr-4" />
                <span className="font-semibold">{menuItem.name}</span>
              </Link>
            )
          }
        })}
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;