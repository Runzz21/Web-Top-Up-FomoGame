import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromoSlider from '../components/PromoSlider';
import gamesData from '../data/games.json'; // Single source of truth for games

export default function Home() {
  const navigate = useNavigate();

  // The allGames data now comes directly from the imported JSON
  const allGames = gamesData;

  return (
    <>
      <Navbar />

      {/* NEW HERO SLIDER SECTION */}
      <section id="promo" className="bg-black py-12 px-4">
        <PromoSlider />
        <div className="text-center mt-8">
            <button
              onClick={() => navigate('/promo')}
              className="bg-transparent border-2 border-purple-500 text-purple-400 font-bold px-8 py-3 rounded-lg shadow-lg hover:bg-purple-500 hover:text-white hover:scale-105 active:scale-100 transition-all"
            >
              Lihat Semua Promo
            </button>
          </div>
      </section>

      {/* GAME POPULER */}
      <section id="game-populer" className="py-20 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black bg-gradient-to-r from-rose-500 to-purple-600 bg-clip-text text-transparent">
              Game Populer
            </h2>
            <p className="text-lg text-gray-400 mt-4">Top up game paling hits minggu ini.</p>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-6 md:gap-8">
            {allGames.slice(0, 8).map((game) => (
              <button
                key={game.id}
                onClick={() => navigate(`/game/${game.slug}`)}
                className="group relative"
                title={game.name}
              >
                <div className="bg-gray-900 rounded-3xl overflow-hidden border-2 border-gray-800 transition-all duration-300 group-hover:border-rose-500 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-rose-500/50 group-active:scale-105 group-active:shadow-lg">
                  <img 
                    src={game.icon} // The icon path is now directly from the JSON
                    alt={game.name}
                    className="w-full h-32 md:h-40 object-cover"
                    // Add a fallback for broken image links
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.onerror = null; // prevents looping
                      target.src = 'https://via.placeholder.com/150/1a1a1a/FFFFFF?text=Error';
                    }}
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <p className="text-white font-bold text-center text-sm">
                      {game.name}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <div className="text-center mt-16">
            <button
              onClick={() => navigate('/popular-games')}
              className="bg-gradient-to-r from-purple-600 to-rose-600 text-white font-bold px-8 py-4 rounded-lg shadow-lg hover:scale-105 active:scale-100 transition-transform text-lg"
            >
              Lihat Semua Game
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
