// fomogame/src/pages/admin/Games.tsx
import { Search, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';
import gamesData from '../../data/games.json';

const Games = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGames = gamesData.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Kelola Game</h1>
            <p className="text-gray-400 mt-1">Edit atau hapus game yang tersedia di platform.</p>
          </div>
        </div>

        {/* Table Container */}
        <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl">
          {/* Table Header with Search */}
          <div className="p-6 border-b border-gray-800/70">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
              <input
                type="text"
                placeholder="Cari game..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gray-800/60 border border-gray-700 rounded-lg w-full md:w-1/3 h-11 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-800/70 text-sm text-gray-400">
                  <th className="px-3 py-2 md:px-6 md:py-4 font-normal">Game</th>
                  <th className="px-3 py-2 md:px-6 md:py-4 font-normal text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.map((game) => ( // Use filteredGames here
                  <tr key={game.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-3 py-2 md:px-6 md:py-4">
                      <div className="flex items-center space-x-2 md:space-x-4">
                        <img src={game.icon} alt={game.name} className="w-8 h-8 md:w-12 md:h-12 rounded-lg object-cover"/>
                        <span className="font-semibold text-white text-sm md:text-base">{game.name}</span>
                      </div>
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 text-center">
                      <div className="flex justify-center space-x-2 md:space-x-4">
                        <button className="text-gray-400 hover:text-blue-400 transition-colors p-1"><Edit size={16} /></button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Footer with Pagination */}
          <div className="p-4 md:p-6 flex flex-col md:flex-row items-center justify-between text-xs md:text-sm text-gray-400 space-y-2 md:space-y-0">
              <div>Menampilkan {filteredGames.length} dari {gamesData.length} hasil</div>
              <div className="flex items-center space-x-2">
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-800/50 disabled:opacity-50" disabled>Previous</button>
                  <button className="px-3 py-1 rounded-lg bg-gray-800 text-white">1</button>
                  <button className="px-3 py-1 rounded-lg hover:bg-gray-800/50 disabled:opacity-50" disabled>Next</button>
              </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Games;

