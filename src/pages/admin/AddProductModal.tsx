import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface Game {
  id: number;
  name: string;
  slug: string;
  icon: string;
}

interface ProductItem {
  id: string;
  name: string;
  price: number;
  discount?: number;
  stock: number | 'Unlimited';
  status: 'Tersedia' | 'Habis';
  gameId: number;
  gameName: string;
}

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  gamesData: Game[];
  allProcessedProducts: ProductItem[];
}

const formSchema = z.object({
  gameId: z.number().min(1, { message: "Pilih game." }),
  name: z.string().min(1, { message: "Nama item tidak boleh kosong." }),
  id: z.string().min(1, { message: "ID Produk tidak boleh kosong." }),
  price: z.number().min(0, { message: "Harga normal harus lebih dari atau sama dengan 0." }),
  discount: z.number().min(0).max(100).optional(),
  stock: z.union([z.number().min(0), z.literal("Unlimited")]),
});

const AddProductModal = ({ isOpen, onClose, gamesData, allProcessedProducts }: AddProductModalProps) => {
  const [isGameDropdownOpen, setIsGameDropdownOpen] = useState(false);
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gameId: gamesData[0]?.id,
      name: '',
      id: '',
      price: 0,
      discount: undefined,
      stock: 'Unlimited',
    },
  });

  const watchStock = watch('stock');
  const watchGameId = watch('gameId');
  const watchProductId = watch('id');

  const selectedGameName = gamesData.find(game => game.id === watchGameId)?.name || 'Pilih Game';

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Add validation for unique product ID across all games
    const isIdUnique = !allProcessedProducts.some(p => p.id === values.id);
    if (!isIdUnique) {
      // Manually set error for product ID
      alert('ID Produk harus unik!'); // For now, simple alert
      return;
    }
    console.log('Form submitted:', values);
    // Here you would typically send data to a backend or update global state
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl border border-gray-800 shadow-2xl relative w-full max-w-2xl transform transition-all duration-300 scale-100 opacity-100">
        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
              Tambah Produk Baru
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition">
              <X size={28} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Pilih Game */}
            <div className="relative">
              <label htmlFor="gameId" className="block text-sm font-medium text-gray-300 mb-2">Pilih Game</label>
              <button
                type="button"
                onClick={() => setIsGameDropdownOpen(!isGameDropdownOpen)}
                className="flex items-center justify-between w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-left focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              >
                <span>{selectedGameName}</span>
                <ChevronDown size={20} className="text-gray-400" />
              </button>
              {isGameDropdownOpen && (
                <div className="absolute top-full mt-2 w-full rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10">
                  {gamesData.map(game => (
                    <button
                      key={game.id}
                      type="button"
                      onClick={() => {
                        setValue('gameId', game.id);
                        setIsGameDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-3 text-sm text-gray-300 hover:bg-gray-700/80 transition"
                    >
                      {game.name}
                    </button>
                  ))}
                </div>
              )}
              {errors.gameId && <p className="text-red-500 text-sm mt-1">{errors.gameId.message}</p>}
            </div>

            {/* Nama Item */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nama Item</label>
              <input
                type="text"
                id="name"
                {...register('name')}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            {/* ID Produk */}
            <div>
              <label htmlFor="id" className="block text-sm font-medium text-gray-300 mb-2">ID Produk</label>
              <input
                type="text"
                id="id"
                {...register('id')}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
              {errors.id && <p className="text-red-500 text-sm mt-1">{errors.id.message}</p>}
            </div>

            {/* Harga Normal */}
            <div>
              <label htmlFor="price" className="block text-sm font-medium text-gray-300 mb-2">Harga Normal</label>
              <input
                type="number"
                id="price"
                step="1000"
                {...register('price', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
              {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
            </div>

            {/* Diskon % */}
            <div>
              <label htmlFor="discount" className="block text-sm font-medium text-gray-300 mb-2">Diskon % (Opsional)</label>
              <input
                type="number"
                id="discount"
                min="0"
                max="100"
                {...register('discount', { valueAsNumber: true })}
                className="w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
              />
              {errors.discount && <p className="text-red-500 text-sm mt-1">{errors.discount.message}</p>}
            </div>

            {/* Stok */}
            <div>
              <label htmlFor="stock" className="block text-sm font-medium text-gray-300 mb-2">Stok</label>
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setValue('stock', 'Unlimited')}
                  className={`px-4 py-3 rounded-lg border transition ${watchStock === 'Unlimited' ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-gray-800/60 border-gray-700 text-gray-300 hover:bg-gray-700/80'}`}
                >
                  Unlimited
                </button>
                <input
                  type="number"
                  placeholder="Jumlah Stok"
                  {...register('stock', { valueAsNumber: true })}
                  onChange={(e) => setValue('stock', parseInt(e.target.value) || 0)}
                  className={`w-full px-4 py-3 bg-gray-800/60 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500 transition ${watchStock === 'Unlimited' ? 'border-gray-700' : 'border-indigo-500'}`}
                  disabled={watchStock === 'Unlimited'}
                />
              </div>
              {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
            </div>

            {/* Status (Derived) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
              <div className={`px-4 py-3 rounded-lg text-white font-bold ${watchStock === 0 ? 'bg-red-500/30 text-red-400 border border-red-500' : 'bg-green-500/30 text-green-400 border border-green-500'}`}>
                {watchStock === 0 ? 'Habis' : 'Tersedia'}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 rounded-lg bg-gray-700/60 text-white font-semibold hover:bg-gray-600/80 transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-rose-600 to-purple-700 text-white font-semibold hover:from-rose-500 hover:to-purple-600 transition"
              >
                Simpan Produk
              </button>
            </div>
          </form>
        </div>
      </div>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
