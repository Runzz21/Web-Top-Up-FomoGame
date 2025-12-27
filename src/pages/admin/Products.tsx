import { useState, useRef, useEffect } from 'react';
import { Search, Edit, Trash2, PackageOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import gamesData from '../../data/games.json';
import productsData from '../../data/products.json';

const productsByGameId = productsData.reduce((acc, product) => {
  acc[product.gameId] = product.items;
  return acc;
}, {} as { [key: number]: any[] });

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(price);
};

const Products = () => {
  const [selectedGameId, setSelectedGameId] = useState<number | null>(gamesData.length > 0 ? gamesData[0].id : null);
  const [searchTerm, setSearchTerm] = useState('');
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const selectedGame = gamesData.find(game => game.id === selectedGameId);
  
  const currentProducts = (selectedGame ? productsByGameId[selectedGame.id] || [] : []).filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (container) {
      setCanScrollLeft(container.scrollLeft > 0);
      setCanScrollRight(container.scrollLeft < container.scrollWidth - container.clientWidth);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (container) {
      const scrollAmount = direction === 'left' ? -container.clientWidth / 2 : container.clientWidth / 2;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-white">Produk & Harga</h1>
            <p className="text-gray-400 mt-1">Pilih game untuk melihat, mengedit, atau menghapus produk yang tersedia.</p>
        </div>
      </div>

      {/* Game Selector */}
      <div className="relative group">
        {canScrollLeft && (
            <button 
                onClick={() => scroll('left')}
                className="absolute -left-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 text-white text-2xl"
            >
                <ChevronLeft size={28} className="text-white"/>
            </button>
        )}
        <div 
          ref={scrollContainerRef}
          className="flex space-x-3 md:space-x-4 overflow-x-auto pb-4 scrollbar-hide"
        >
            {gamesData.map(game => (
                <button
                    key={game.id}
                    onClick={() => setSelectedGameId(game.id)}
                    className={`flex-shrink-0 flex items-center space-x-2 md:space-x-3 p-2 md:p-3 rounded-lg transition-all duration-300 border-2 ${selectedGameId === game.id ? 'bg-indigo-600 border-indigo-500 shadow-lg shadow-indigo-600/30' : 'bg-gray-800/60 border-gray-700 hover:bg-gray-700/80 hover:border-gray-500'}`}
                >
                    <img src={game.icon} alt={game.name} className="w-8 h-8 md:w-10 md:h-10 rounded-md object-cover"/>
                    <span className={`font-semibold text-sm md:text-lg ${selectedGameId === game.id ? 'text-white' : 'text-gray-300'}`}>{game.name}</span>
                </button>
            ))}
        </div>
        {canScrollRight && (
            <button 
                onClick={() => scroll('right')}
                className="absolute -right-2 top-1/2 -translate-y-1/2 z-10 p-2 bg-black/50 rounded-full hover:bg-black/80 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 text-white text-2xl"
            >
                <ChevronRight size={28} className="text-white"/>
            </button>
        )}
      </div>


      {/* Table Container */}
      <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl">
        {/* Table Header with Search */}
        <div className="p-6 border-b border-gray-800/70">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
            <input
              type="text"
              placeholder={`Cari produk di ${selectedGame?.name || 'game'}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800/60 border border-gray-700 rounded-lg w-full md:w-1/3 h-11 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-300"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-800/70 text-sm text-gray-400">
                <th className="px-3 py-2 md:px-6 md:py-4 font-normal">Nama Item</th>
                <th className="px-3 py-2 md:px-6 md:py-4 font-normal">Harga</th>
                <th className="px-3 py-2 md:px-6 md:py-4 font-normal text-center">Diskon</th>
                <th className="px-3 py-2 md:px-6 md:py-4 font-normal text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                    <td className="px-3 py-2 md:px-6 md:py-4 font-semibold text-white text-sm md:text-base">{product.name}</td>
                    <td className="px-3 py-2 md:px-6 md:py-4 text-gray-300 font-semibold text-sm md:text-base">{formatPrice(product.price)}</td>
                    <td className={`px-3 py-2 md:px-6 md:py-4 text-center font-bold text-sm md:text-base ${product.discount ? 'text-green-400' : 'text-gray-500'}`}>
                      {product.discount ? `${product.discount}%` : '-'}
                    </td>
                    <td className="px-3 py-2 md:px-6 md:py-4 text-center">
                      <div className="flex justify-center space-x-2 md:space-x-4">
                        <button className="text-gray-400 hover:text-blue-400 transition-colors p-1"><Edit size={16} /></button>
                        <button className="text-gray-400 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="text-center py-8 md:py-16">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                        <PackageOpen size={32} className="mb-2 md:mb-4"/>
                        <h3 className="text-lg md:text-xl font-semibold">Tidak Ada Produk</h3>
                        <p className="text-sm mt-1">{searchTerm ? `Tidak ada produk yang cocok dengan pencarian "${searchTerm}".` : `Belum ada produk untuk game ${selectedGame?.name || ''}.`}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Products;