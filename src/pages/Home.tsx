// src/pages/Home.tsx → FINAL 100% JALAN — SEARCH + VALIDASI CANTIK, GAK ADA ERROR LAGI!
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import toast from 'react-hot-toast' // INI YANG LU LUPA IMPORT!!!
import logo from '../assets/logo.png'

// IMPORT SEMUA LOGO GAME
import mlbb from '../assets/game-icons/mobile-legends.jpg'
import ff from '../assets/game-icons/free-fire.jpg'
import pubg from '../assets/game-icons/pubg-mobile.png'
import valorant from '../assets/game-icons/valorant.jpg'
import genshin from '../assets/game-icons/genshin-impact.jpg'
import roblox from '../assets/game-icons/roblox.png'
import codm from '../assets/game-icons/cod-mobile.jpg'
import honkai from '../assets/game-icons/honkai-star-rail.jpg'
import magicchess from '../assets/game-icons/magic-chess-gogo.jpeg'
import ballpool from '../assets/game-icons/ballpool.jpg'
import arenaofvalor from '../assets/game-icons/arena-of-valor.jpg'
import dragonnest from '../assets/game-icons/dragon-nest.png'
import efootball from '../assets/game-icons/efootball.png'
import racingmaster from '../assets/game-icons/racing-master.jpg'
import sausageman from '../assets/game-icons/sausage-man.png'
import stumbleguys from '../assets/game-icons/stumble-guys.png'

const allGames = [
  { name: 'Mobile Legends', slug: 'mobile-legends', icon: mlbb },
  { name: 'Free Fire', slug: 'free-fire', icon: ff },
  { name: 'PUBG Mobile', slug: 'pubg-mobile', icon: pubg },
  { name: 'Valorant', slug: 'valorant', icon: valorant },
  { name: 'Genshin Impact', slug: 'genshin-impact', icon: genshin },
  { name: 'Roblox', slug: 'roblox', icon: roblox },
  { name: 'Call of Duty Mobile', slug: 'cod-mobile', icon: codm },
  { name: 'Honkai: Star Rail', slug: 'honkai-star-rail', icon: honkai },
  { name: 'Magic Chess', slug: 'magic-chess', icon: magicchess },
  { name: '8 Ball Pool', slug: 'ballpool', icon: ballpool },
  { name: 'Arena of Valor', slug: 'arena-of-valor', icon: arenaofvalor },
  { name: 'Dragon Nest', slug: 'dragon-nest', icon: dragonnest },
  { name: 'eFootball', slug: 'efootball', icon: efootball },
  { name: 'Racing Master', slug: 'racing-master', icon: racingmaster },
  { name: 'Sausage Man', slug: 'sausageman', icon: sausageman },
  { name: 'Stumble Guys', slug: 'stumble-guys', icon: stumbleguys },
]

export default function Home() {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const query = searchQuery.trim().toLowerCase()

    if (!query) {
      toast.error('Ketik nama game dulu!', {
        icon: '🚫',
        style: {
          background: '#1a1a1a',
          color: '#ff6b6b',
          borderRadius: '16px',
          fontSize: '18px',
          fontWeight: 'bold',
          padding: '16px 24px',
          border: '2px solid #ff3333',
          boxShadow: '0 0 20px rgba(255, 51, 51, 0.3)'
        }
      })
      return
    }

    const found = allGames.find(game => 
      game.name.toLowerCase().includes(query) || 
      game.slug.includes(query)
    )

    if (found) {
      navigate(`/game/${found.slug}`)
    } else {
      toast.error(`Game "${searchQuery}" tidak ditemukan`, {
        icon: '🚫',
        duration: 5000,
        style: {
          background: 'linear-gradient(135deg, #1a0000, #330000)',
          color: '#ff4d4d',
          border: '3px solid #ff1a1a',
          borderRadius: '16px',
          fontSize: '18px',
          fontWeight: '900',
          padding: '16px 24px',
          textAlign: 'center',
          boxShadow: '0 0 40px rgba(255, 26, 26, 0.6)',
          textShadow: '0 0 10px #ff0000'
        }
      })
    }
  }

  return (
    <>
      <Navbar />

      {/* HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center bg-black">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-black to-rose-900/20" />
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-rose-600/20 rounded-full blur-3xl" />

        <div className="relative z-10 text-center px-6 max-w-4xl">
          <img 
            src={logo} 
            alt="FomoGame" 
            className="w-48 h-48 mx-auto mb-8 rounded-3xl shadow-2xl border-4 border-rose-500/40"
          />

          <h1 className="text-5xl md:text-7xl font-black mb-4 bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
            Top Up Game Termurah
          </h1>
          <p className="text-xl md:text-3xl font-bold text-gray-300 mb-12">
            Proses Instan • 24 Jam • 100% Aman
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik nama game..."
                className="w-full px-8 py-6 text-lg rounded-full bg-gray-900/90 border-2 border-gray-700 focus:border-rose-500 focus:outline-none transition-all placeholder-gray-500"
              />
              <button 
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 px-10 py-4 rounded-full font-bold text-white transition-all hover:scale-105"
              >
                CARI GAME
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* GAME POPULER */}
      <section className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl md:text-6xl font-black text-center mb-16 bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
            Game Populer
          </h2>

          <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-8 gap-8">
            {allGames.map((game) => (
              <button
                key={game.name}
                onClick={() => navigate(`/game/${game.slug}`)}
                className="group relative"
              >
                <div className="bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800 hover:border-rose-500 transition-all duration-300 hover:scale-110 hover:shadow-2xl hover:shadow-rose-500/50">
                  <img 
                    src={game.icon}
                    alt={game.name}
                    className="w-full h-32 md:h-40 object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold text-center text-sm">
                      {game.name.split(' ')[0]}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}