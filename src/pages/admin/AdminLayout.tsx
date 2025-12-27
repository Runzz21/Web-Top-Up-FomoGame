import React, { useEffect, useState } from 'react';
import AdminSidebar from './dashboard/AdminSidebar';
import AdminHeader from './dashboard/AdminHeader';
import ParticlesBackground from '../../components/ParticlesBackground'; // Import from shared component
import './dashboard/particles.css';
import { Menu } from 'lucide-react'; // Import Menu icon

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [searchQuery, setSearchQuery] = useState(''); // Define state locally in AdminLayout
  const [isSidebarOpen, setSidebarOpen] = useState(false); // State for mobile sidebar

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      <ParticlesBackground />
      <AdminSidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      <div className="ml-0 md:ml-64 flex-1 transition-all duration-300">
        {/* AdminHeader visible only on desktop */}
        <div className="hidden md:block">
          <AdminHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        
        {/* Mobile FAB to open sidebar */}
        <button 
          className="fixed bottom-4 right-4 z-40 md:hidden bg-rose-600 hover:bg-rose-700 text-white p-4 rounded-full shadow-lg"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu size={24} />
        </button>

        <main className="pt-8 md:pt-24 px-4 md:px-8 pb-8"> {/* Adjust padding based on header visibility */}
          {React.cloneElement(children as React.ReactElement, { })}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
