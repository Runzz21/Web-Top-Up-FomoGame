import { Link } from 'react-router-dom'

interface Game {
  id: number
  name: string
  slug: string
  icon: string
}

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link to={`/game/${game.slug}`} className="group block">
      <div className="bg-gray-900/80 backdrop-blur-sm rounded-2xl overflow-hidden border border-gray-800 hover:border-rose-500/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-rose-500/20">
        <div className="aspect-square p-8 flex items-center justify-center">
          <img 
            src={game.icon} 
            alt={game.name}
            className="w-full h-full object-contain drop-shadow-2xl group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              e.currentTarget.src = "https://via.placeholder.com/150?text=No+Image"
            }}
          />
        </div>
        <div className="p-4 text-center">
          <h3 className="font-bold text-lg text-white group-hover:text-rose-400 transition">
            {game.name}
          </h3>
        </div>
      </div>
    </Link>
  )
}