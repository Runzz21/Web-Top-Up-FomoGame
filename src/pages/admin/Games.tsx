// src/pages/admin/Games.tsx → VERSI DEWA ABADI 2025
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

  // Auto generate slug dari nama game
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
      setGames(data || [])
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
    <div className="min-h-screen p-8 space-y-12">
      {/* JUDUL GILA */}
      <div className="text-center">
        <h1 className="text-9xl font-black bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 bg-clip-text text-transparent animate-pulse">
          KELOLA GAMES
        </h1>
        <p className="text-4xl text-gray-300 mt-6">
          Total: <span className="text-rose-400 font-black">{games.length}</span> game aktif
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 max-w-7xl mx-auto">
        {/* FORM TAMBAH GAME */}
        <div className="bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-10 border border-rose-500/30 shadow-2xl shadow-rose-500/20">
          <h2 className="text-5xl font-black text-rose-400 mb-10">Tambah Game Baru</h2>
          <div className="space-y-8">
            <input
              type="text"
              placeholder="Nama Game (contoh: Mobile Legends)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-8 py-6 bg-gray-800/80 border border-gray-700 rounded-2xl text-2xl text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/30 transition"
            />

            <div className="flex items-center gap-4">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                placeholder="slug-otomatis"
                className="flex-1 px-8 py-6 bg-gray-800/80 border border-gray-700 rounded-2xl text-2xl font-mono text-rose-300"
              />
              <span className="text-gray-400 text-xl">.fomogame.com</span>
            </div>

            <input
              type="text"
              placeholder="URL Gambar (kosongkan = otomatis pakai /game-icons/[slug].png)"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full px-8 py-6 bg-gray-800/80 border border-gray-700 rounded-2xl text-xl text-gray-400"
            />

            <button
              onClick={addGame}
              disabled={loading || !name || !slug}
              className="w-full bg-gradient-to-r from-rose-600 to-purple-700 hover:from-rose-700 hover:to-purple-800 disabled:opacity-50 py-8 rounded-2xl font-black text-3xl text-white shadow-xl hover:shadow-rose-500/50 hover:scale-105 transition-all duration-300"
            >
              {loading ? 'Sedang Menambah...' : 'TAMBAH GAME BARU'}
            </button>
          </div>
        </div>

        {/* DAFTAR GAME — LOGO PASTI KELUAR */}
        <div className="bg-gray-900/95 backdrop-blur-2xl rounded-3xl p-10 border border-rose-500/30 shadow-2xl shadow-rose-500/20">
          <h2 className="text-5xl font-black text-rose-400 mb-10">Daftar Game Aktif</h2>

          {games.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-40 h-40 mx-auto bg-gray-800 rounded-3xl border-4 border-dashed border-gray-600 mb-8" />
              <p className="text-4xl text-gray-500">Belum ada game</p>
            </div>
          ) : (
            <div className="space-y-6">
              {games.map((game) => (
                <div
                  key={game.id}
                  className="bg-gray-800/70 rounded-2xl p-6 flex items-center gap-8 hover:bg-gray-800/90 transition-all hover:scale-[1.02] border border-gray-700 hover:border-rose-500"
                >
                  <div className="relative">
                    <img
                      src={game.image || `/game-icons/${game.slug}.png`}
                      alt={game.name}
                      className="w-32 h-32 rounded-2xl object-cover border-4 border-rose-500/40 shadow-2xl"
                      onError={(e) => {
                        const img = e.currentTarget
                        const tries = [
                          `/game-icons/${game.slug}.jpg`,
                          `/game-icons/${game.slug}.jpeg`,
                          `/game-icons/${game.slug}.webp`,
                          `/game-icons/${game.name.toLowerCase().replace(/\s+/g, '-')}.png`,
                          '/game-icons/default.png'
                        ]
                        let index = 0
                        img.onerror = () => {
                          if (index < tries.length) {
                            img.src = tries[index++]
                          }
                        }
                        img.src = tries[0]
                      }}
                    />
                    <div className="absolute -bottom-3 -right-3 bg-green-500 text-black px-4 py-2 rounded-full text-sm font-black shadow-lg">
                      AKTIF
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-4xl font-black text-white">{game.name}</h3>
                    <p className="text-2xl text-rose-300 font-mono">/{game.slug}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}