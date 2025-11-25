// src/pages/admin/Users.tsx → VERSI FIX SUPABASE 2025
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface User {
  id: string
  email: string
  created_at: string
  last_sign_in_at: string | null
  raw_user_meta_data: {
    full_name?: string
    name?: string
  }
}

export default function Users() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .rpc('get_all_users')

    if (error) {
      toast.error('Gagal ambil user: ' + error.message)
      console.error(error)
    } else {
      setUsers(data || [])
      toast.success(`Berhasil load ${data?.length} user!`)
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const formatDate = (date: string) => new Date(date).toLocaleString('id-ID')

  const getFullName = (user: User) => {
    return user.raw_user_meta_data?.full_name || 
           user.raw_user_meta_data?.name || 
           'User Tanpa Nama'
  }

  if (loading) return <div className="text-center py-32 text-6xl text-rose-500 animate-pulse">Loading User...</div>

  return (
    <div className="space-y-10">
      <div className="text-center">
        <h1 className="text-8xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
          SEMUA USER FOMOGAME
        </h1>
        <p className="text-3xl text-gray-400 mt-6">Total: <strong className="text-rose-400">{users.length}</strong> akun</p>
      </div>

      <div className="grid gap-8">
        {users.length === 0 ? (
          <div className="text-center py-32 bg-gray-900/80 rounded-3xl border-2 border-dashed border-gray-700">
            <p className="text-6xl text-gray-500">Belum ada user terdaftar</p>
          </div>
        ) : (
          users.map((user) => (
            <div key={user.id} className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-gray-800 hover:border-rose-500/70 transition-all hover:shadow-2xl hover:shadow-rose-500/30">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-gradient-to-br from-rose-500 to-purple-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl">
                  {user.email[0].toUpperCase()}
                </div>
                <div className="flex-1">
                  <h3 className="text-4xl font-black text-white">
                    {getFullName(user)}
                  </h3>
                  <p className="text-2xl text-rose-400">{user.email}</p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 text-lg">
                    <p><span className="text-gray-500">Bergabung:</span> <span className="text-gray-300">{formatDate(user.created_at)}</span></p>
                    <p><span className="text-gray-500">Login Terakhir:</span> <span className="text-green-400">{user.last_sign_in_at ? formatDate(user.last_sign_in_at) : 'Belum login'}</span></p>
                    <p><span className="text-gray-500">Status:</span> <span className="text-green-400 font-bold">AKTIF</span></p>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="text-center mt-12">
        <button onClick={fetchUsers} className="bg-gradient-to-r from-rose-600 to-purple-600 hover:scale-110 transition-all px-16 py-6 rounded-full font-black text-3xl text-white shadow-2xl">
          Refresh User
        </button>
      </div>
    </div>
  )
}