// src/pages/admin/Games.tsx → FINAL — CARD KECIL, RAPIH, CANTIK, PERSIS FOTO LU!
import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface Game {
  id: string
  name: string
  slug: string
  image?: string
  created_at: string
}

export default function Games() {
  const [games, setGames] = useState<Game[]>([])
  const [name, setName] = useState('')
  const [slug, setSlug] = useState('')
  const [image, setImage] = useState('')
  const [loading, setLoading] = useState(false)

  // Auto generate slug
  useEffect(() => {
    if (name.trim()) {
      const generated = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
      setSlug(generated)
    } else {
      setSlug('')
    }
  }, [name])

  const fetchGames = async () => {
    const { data, error } = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Gagal load games')
    } else {
      setGames(data ?? [])
    }
  }

  useEffect(() => {
    fetchGames()
  }, [])

  const addGame = async () => {
    if (!name.trim()) return toast.error('Nama game wajib diisi!')
    if (!slug.trim()) return toast.error('Slug wajib diisi!')

    setLoading(true)
    const finalImage = image.trim() || `/game-icons/${slug}.png`

    const { error } = await supabase
      .from('games')
      .insert({ name: name.trim(), slug: slug.trim(), image: finalImage })

    if (error) {
      if (error.message.includes('duplicate')) {
        toast.error('Slug sudah dipakai! Ganti yang lain.')
      } else {
        toast.error(error.message)
      }
    } else {
      toast.success(`${name} berhasil ditambah!`)
      setName('')
      setSlug('')
      setImage('')
      fetchGames()
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="ml-8">

        {/* TOTAL GAME */}
        <div className="text-center mb-12">
          <p className="text-5xl font-black text-white">
            Total: <span className="text-rose-400 text-6xl">{games.length}</span> game aktif
          </p>
        </div>

        {/* GRID CARD — CARD DIKECILIN, RAPIH, PERSIS FOTO LU */}
        <div className="grid lg:grid-cols-2 gap-10 max-w-6xl mx-auto">

          {/* CARD TAMBAH GAME — DIKECILIN */}
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-rose-500/30 shadow-2xl">
            <h2 className="text-5xl font-black text-rose-400 mb-8 text-center">Tambah Game Baru</h2>
            <div className="space-y-6">
              <input
                type="text"
                placeholder="Nama Game (contoh: Mobile Legends)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/80 border border-gray-700 rounded-2xl text-xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 transition"
              />

              <div className="flex items-center gap-3">
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="slug-otomatis"
                  className="flex-1 px-6 py-4 bg-gray-800/80 border border-gray-700 rounded-2xl text-xl font-mono text-rose-300"
                />
                <span className="text-gray-400 text-lg">.fomo</span>
              </div>

              <input
                type="text"
                placeholder="URL Gambar (kosongkan = otomatis)"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                className="w-full px-6 py-4 bg-gray-800/80 border border-gray-700 rounded-2xl text-lg text-gray-400"
              />

              <button
                onClick={addGame}
                disabled={loading || !name || !slug}
                className="w-full bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-700 hover:to-purple-800 disabled:opacity-50 py-6 rounded-2xl font-black text-2xl text-white shadow-xl hover:scale-105 transition-all"
              >
                {loading ? 'Sedang Menambah...' : 'TAMBAH GAME BARU'}
              </button>
            </div>
          </div>

          {/* CARD DAFTAR GAME — DIKECILIN */}
          <div className="bg-gray-900/95 backdrop-blur-xl rounded-3xl p-8 border border-rose-500/30 shadow-2xl">
            <h2 className="text-5xl font-black text-rose-400 mb-8 text-center">Daftar Game Aktif</h2>

            {games.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-32 h-32 mx-auto bg-gray-800 rounded-2xl border-4 border-dashed border-gray-600 mb-6" />
                <p className="text-3xl text-gray-500 font-bold">Belum ada game</p>
              </div>
            ) : (
              <div className="space-y-5 max-h-96 overflow-y-auto pr-2">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className="bg-gray-800/70 rounded-2xl p-5 flex items-center gap-6 hover:bg-gray-800/90 transition-all border border-gray-700 hover:border-rose-500"
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={game.image || `/game-icons/${game.slug}.png`}
                        alt={game.name}
                        className="w-20 h-20 rounded-xl object-cover border-4 border-rose-500/40 shadow-xl"
                        onError={(e) => {
                          const img = e.currentTarget
                          const tries = [
                            `/game-icons/${game.slug}.jpg`,
                            `/game-icons/${game.slug}.jpeg`,
                            `/game-icons/${game.slug}.webp`,
                            '/game-icons/default.png'
                          ]
                          let i = 0
                          img.onerror = () => i < tries.length && (img.src = tries[i++])
                          img.src = tries[0]
                        }}
                      />
                      <div className="absolute -bottom-2 -right-2 bg-green-500 text-black px-3 py-1 rounded-full text-xs font-black shadow-lg">
                        AKTIF
                      </div>
                    </div>

                    <div className="flex-1">
                      <h3 className="text-2xl font-black text-white">{game.name}</h3>
                      <p className="text-lg text-rose-300 font-mono">/{game.slug}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}