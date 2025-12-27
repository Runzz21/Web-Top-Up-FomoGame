// fomogame/src/pages/admin/Users.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search, MoreVertical, Eye, UserX } from 'lucide-react';
import toast from 'react-hot-toast'; // Ensure react-hot-toast is installed and imported

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  raw_user_meta_data: {
    full_name?: string
    name?: string
    avatar_url?: string
  }
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState(''); // State for search term

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .rpc('get_all_users') // Assumes you have this RPC function deployed in Supabase

    if (error) {
      toast.error('Gagal ambil user: ' + error.message)
      console.error(error)
      setUsers([]) // Ensure users array is empty on error
    } else {
      setUsers(data || [])
      toast.success(`Berhasil load ${data?.length} user!`)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('id-ID');
  }

  const getFullName = (user: User) => {
    return user.raw_user_meta_data?.full_name || 
           user.raw_user_meta_data?.name || 
           'User Tanpa Nama'
  }

  const filteredUsers = users.filter(user => {
    const searchLower = searchTerm.toLowerCase();
    const fullName = getFullName(user).toLowerCase();
    const email = user.email.toLowerCase();
    const id = user.id.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      email.includes(searchLower) ||
      id.includes(searchLower)
    );
  });


  if (loading) return <div className="text-center py-32 text-6xl text-rose-500 animate-pulse">Loading User...</div>

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Manajemen Pengguna</h1>
        <p className="text-gray-400 mt-1">Lihat, kelola, dan pantau semua pengguna terdaftar.</p>
      </div>

      {/* Table Container */}
      <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl">
        {/* Table Header with Search */}
        <div className="p-6 border-b border-gray-800/70">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder="Cari user (ID, Nama, Email)..."
              value={searchTerm} // Controlled input
              onChange={(e) => setSearchTerm(e.target.value)} // Update search term
              className="bg-gray-800/60 border border-gray-700 rounded-lg w-full h-11 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800/70 text-sm text-gray-400">
                <th className="px-6 py-4 font-normal">Pengguna</th>
                <th className="px-6 py-4 font-normal">ID User</th>
                <th className="px-6 py-4 font-normal">Terakhir Login</th>
                <th className="px-6 py-4 font-normal">Tanggal Registrasi</th>
                <th className="px-6 py-4 font-normal text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                 <tr><td colSpan={5} className="text-center py-8 text-gray-400">Tidak ada data pengguna.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                    <tr key={user.id} className={`border-b border-gray-800 hover:bg-gray-800/50 transition-colors`}>
                    <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                        <img 
                            src={user.raw_user_meta_data.avatar_url || `https://api.dicebear.com/8.x/bottts/svg?seed=${user.id}`} // Using Google avatar or fallback
                            alt={getFullName(user)} 
                            className="w-11 h-11 rounded-full p-1 bg-gray-700"
                        />
                        <div>
                            <div className="font-semibold text-white">{getFullName(user)}</div>
                            <div className="text-sm text-gray-400">{user.email}</div>
                        </div>
                        </div>
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-gray-300">{user.id}</td>
                    <td className="px-6 py-4 text-gray-300">{formatDate(user.last_sign_in_at)}</td>
                    <td className="px-6 py-4 text-gray-300">{formatDate(user.created_at)}</td>
                    <td className="px-6 py-4 text-center">
                        <div className="flex justify-center">
                            <button className="flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-400 hover:bg-gray-800/50 hover:text-white">
                                <Eye size={16}/> Lihat Detail
                            </button>
                        </div>
                    </td>
                    </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Table Footer with Pagination */}
        <div className="p-6 flex items-center justify-between text-sm text-gray-400">
            <div>Menampilkan {filteredUsers.length} hasil</div>
            <div className="flex items-center space-x-2">
                <button className="px-3 py-1 rounded-lg hover:bg-gray-800/50" disabled>Previous</button>
                <button className="px-3 py-1 rounded-lg bg-gray-800 text-white">1</button>
                <button className="px-3 py-1 rounded-lg hover:bg-gray-800/50">Next</button>
            </div>
        </div>
      </div>
    </div>
  );
}