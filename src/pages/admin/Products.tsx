// src/pages/admin/Products.tsx

import { useEffect, useState } from 'react'
import AdminLayout from './AdminLayout' // Komponen yang Diperlukan
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'
import { Trash2, PlusCircle } from 'lucide-react'

// Opsional: Buat Type yang lebih jelas
type Product = {
  id: number
  game_id: number
  name: string
  price: number
  discount: number | null
}

export default function Products() {
  // Gunakan type Product[]
  const [products, setProducts] = useState<Product[]>([]) 
  const [gameId, setGameId] = useState('')
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [discount, setDiscount] = useState('')

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    // Tambahkan error handling sederhana
    const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false })
    if (error) {
      toast.error('Gagal memuat produk.')
      console.error('Error fetching products:', error)
    }
    setProducts(data || [])
  }

  const addProduct = async () => {
    if (!gameId || !name || !price) {
      toast.error('Game ID, Nama, dan Harga wajib diisi.')
      return
    }

    const { error } = await supabase.from('products').insert({
      game_id: Number(gameId),
      name,
      price: Number(price),
      discount: discount ? Number(discount) : null,
      // Tambahkan kolom lain seperti is_active: true jika diperlukan
    })
    
    if (error) toast.error(error.message)
    else {
      toast.success('Produk berhasil ditambahkan!')
      fetchProducts()
      setName(''); setPrice(''); setDiscount(''); setGameId('') // Reset form
    }
  }

  // --- FUNGSI DELETE BARU ---
  const deleteProduct = async (id: number, productName: string) => {
    if (window.confirm(`Yakin ingin menghapus produk "${productName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (error) toast.error('Gagal menghapus produk.')
      else {
        toast.success(`${productName} berhasil dihapus!`)
        fetchProducts() // Refresh daftar
      }
    }
  }

  // --- KOREKSI: PENGGUNAAN ADMIN LAYOUT DI SINI ---
  return (
    <AdminLayout> 
      <div className="p-8">
        <h1 className="text-6xl font-black gradient-text mb-10">Manage Products</h1>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Form Tambah Produk */}
          <div className="bg-gray-900/90 p-8 rounded-3xl border border-gray-800 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-rose-400">Tambah Produk Baru</h2>
            <input 
              placeholder="Game ID (1=ML, 2=FF)" 
              value={gameId} 
              onChange={e => setGameId(e.target.value)} 
              type="number" // Paksa input berupa angka
              className="w-full p-4 mb-4 bg-gray-800 rounded-xl focus:ring-rose-500 focus:border-rose-500" 
            />
            <input 
              placeholder="Nama Produk (86 Diamonds)" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full p-4 mb-4 bg-gray-800 rounded-xl focus:ring-rose-500 focus:border-rose-500" 
            />
            <input 
              placeholder="Harga (20000)" 
              value={price} 
              onChange={e => setPrice(e.target.value)} 
              type="number" // Paksa input berupa angka
              className="w-full p-4 mb-4 bg-gray-800 rounded-xl focus:ring-rose-500 focus:border-rose-500" 
            />
            <input 
              placeholder="Diskon (%) - optional" 
              value={discount} 
              onChange={e => setDiscount(e.target.value)} 
              type="number" 
              className="w-full p-4 mb-6 bg-gray-800 rounded-xl focus:ring-rose-500 focus:border-rose-500" 
            />
            <button onClick={addProduct} className="w-full flex justify-center items-center btn-gradient py-4 text-xl font-bold rounded-xl transition hover:opacity-90">
              <PlusCircle className='w-6 h-6 mr-2' /> TAMBAH PRODUK
            </button>
          </div>

          {/* Daftar Produk */}
          <div className="bg-gray-900/90 p-8 rounded-3xl border border-gray-800 shadow-xl">
            <h2 className="text-3xl font-bold mb-6 text-rose-400">Daftar Produk ({products.length})</h2>
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {products.length === 0 ? (
                <p className='text-gray-500 text-center py-10'>Belum ada produk yang ditambahkan.</p>
              ) : (
                products.map(p => (
                  <div key={p.id} className="bg-gray-800 p-6 rounded-xl flex justify-between items-center transition hover:bg-gray-700/50">
                    <div>
                      <p className="text-2xl font-bold">{p.name}</p>
                      <p className="text-rose-400">
                        Rp{p.price.toLocaleString('id-ID')} 
                        {p.discount && <span className="text-green-400 font-semibold ml-2">({p.discount}% OFF)</span>}
                      </p>
                      <p className="text-gray-400 text-sm mt-1">ID: {p.id} | Game ID: {p.game_id}</p>
                    </div>
                    <button 
                      onClick={() => deleteProduct(p.id, p.name)} 
                      className="text-red-500 hover:text-red-400 p-3 rounded-full transition bg-gray-900/50"
                      title="Hapus Produk"
                    >
                      <Trash2 className='w-5 h-5' />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}