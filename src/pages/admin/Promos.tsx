// fomogame/src/pages/admin/Promos.tsx
import { Plus, Tag, TrendingUp, Sparkles, Zap, Search, Edit, Trash2, Eye } from 'lucide-react';
import { useState } from 'react';

const promoData = [
  { id: 'PRO-XMAS25', name: 'Bonus Natal 20%', type: 'Bonus Diamond', game: 'All Games', value: '+20%', validity: '20 Des - 31 Des 2025', status: 'Aktif' },
  { id: 'PRO-MLBB50', name: 'Diskon Starlight', type: 'Diskon', game: 'Mobile Legends', value: 'Rp50.000', validity: '15 Des - 25 Des 2025', status: 'Aktif' },
  { id: 'PRO-VALNY', name: 'New Year Cashback', type: 'Cashback', game: 'Valorant', value: '15%', validity: '28 Des 2025 - 05 Jan 2026', status: 'Aktif' },
  { id: 'PRO-FF100', name: 'Bonus Topup Perdana', type: 'Bonus Diamond', game: 'Free Fire', value: '+100 Diamond', validity: '01 Des - 31 Des 2025', status: 'Nonaktif' },
  { id: 'PRO-GENS11', name: 'Welkin Moon Diskon', type: 'Diskon', game: 'Genshin Impact', value: '10%', validity: '1 Nov - 30 Nov 2025', status: 'Kadaluarsa' },
  { id: 'PRO-WEEKLY', name: 'Bonus Mingguan', type: 'Bonus Diamond', game: 'All Games', value: '+5%', validity: 'Setiap Senin', status: 'Aktif' },
  { id: 'PRO-PUBGWIN', name: 'Winner Chicken Dinner', type: 'Cashback', game: 'PUBG Mobile', value: '10%', validity: '10 Des - 17 Des 2025', status: 'Kadaluarsa' },
];

const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Aktif': return 'bg-green-500/20 text-green-400 border border-green-500/30';
        case 'Nonaktif': return 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30';
        case 'Kadaluarsa': return 'bg-gray-500/20 text-gray-400 border border-gray-500/30';
        default: return 'bg-gray-500/20 text-gray-400';
    }
};

const activityFeed = [
    { text: "Promo 'BONUS20ML' baru saja dibuat oleh AdminFomoGame.", time: "2 menit lalu" },
    { text: "User 'usr-4812' mengklaim promo 'WEEKLYPASS'.", time: "5 menit lalu" },
    { text: "Promo 'Diskon Starlight' telah diupdate.", time: "1 jam lalu" },
    { text: "User 'usr-1120' mengklaim promo 'BONUS20ML'.", time: "2 jam lalu" },
    { text: "Promo 'Winner Chicken Dinner' telah berakhir.", time: "8 jam lalu" },
]

const Promos = () => {
    const [quickCreateOpen, setQuickCreateOpen] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredPromos = promoData.filter(promo =>
        promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        promo.game.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">Kelola Promo & Bonus</h1>
                    <p className="text-gray-400 mt-1">Buat, kelola, dan lacak performa semua kampanye promosi.</p>
                </div>
                
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-gray-400">Total Promo Aktif</p><p className="text-3xl font-bold text-white">4</p></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-sky-500/20 text-sky-400"><Tag size={24}/></div></div></div>
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-gray-400">Total Klaim Hari Ini</p><p className="text-3xl font-bold text-white">1,204</p></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-emerald-500/20 text-emerald-400"><TrendingUp size={24}/></div></div></div>
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-gray-400">Total Bonus Diberikan</p><p className="text-3xl font-bold text-white">Rp 12.5M</p></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-amber-500/20 text-amber-400"><Sparkles size={24}/></div></div></div>
                <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6"><div className="flex items-center justify-between"><div className="space-y-1"><p className="text-gray-400">Estimasi Penghematan User</p><p className="text-3xl font-bold text-white">Rp 35.2M</p></div><div className="w-12 h-12 rounded-full flex items-center justify-center bg-rose-500/20 text-rose-400"><Zap size={24}/></div></div></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Table */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl">
                        <div className="p-6 border-b border-gray-800/70 flex justify-between items-center">
                            <h2 className="text-xl font-semibold text-white">Daftar Promo Aktif</h2>
                            <div className="relative w-full md:w-1/3">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                                <input type="text" placeholder="Cari promo..." className="bg-gray-800/60 border border-gray-700 rounded-lg w-full h-10 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"/>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead><tr className="border-b border-gray-800/70 text-sm text-gray-400"><th className="px-6 py-4 font-normal">Nama Promo</th><th className="px-6 py-4 font-normal">Tipe/Game</th><th className="px-6 py-4 font-normal">Nilai</th><th className="px-6 py-4 font-normal">Masa Berlaku</th><th className="px-6 py-4 font-normal text-center">Status</th><th className="px-6 py-4 font-normal text-center">Aksi</th></tr></thead>
                                <tbody>
                                    {promoData.map((promo) => (
                                        <tr key={promo.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors"><td className="px-6 py-4"><div className="font-semibold text-white">{promo.name}</div><div className="font-mono text-xs text-gray-500">{promo.id}</div></td><td className="px-6 py-4"><div className="font-semibold text-white">{promo.type}</div><div className="text-sm text-gray-400">{promo.game}</div></td><td className="px-6 py-4 font-semibold text-fuchsia-400">{promo.value}</td><td className="px-6 py-4 text-gray-300">{promo.validity}</td><td className="px-6 py-4 text-center"><span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusBadge(promo.status)}`}>{promo.status}</span></td><td className="px-6 py-4 text-center"><div className="flex justify-center space-x-2"><button className="p-2 text-gray-400 hover:text-blue-400"><Eye size={18} /></button><button className="p-2 text-gray-400 hover:text-yellow-400"><Edit size={18} /></button><button className="p-2 text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></div></td></tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-8">
                     {/* Quick Create Form */}
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl">
                        <button className="p-6 w-full text-left" onClick={() => setQuickCreateOpen(!quickCreateOpen)}>
                            <h2 className="text-xl font-semibold text-white">Buat Promo Cepat</h2>
                        </button>
                        {quickCreateOpen && (
                            <div className="p-6 border-t border-gray-800/70 space-y-4">
                                <input type="text" placeholder="Nama Promo" className="w-full bg-gray-800/60 border-gray-700 rounded-lg" />
                                <select className="w-full bg-gray-800/60 border-gray-700 rounded-lg text-gray-300"><option>Tipe (Diskon)</option><option>Tipe (Bonus)</option><option>Tipe (Cashback)</option></select>
                                <input type="text" placeholder="Game Target (cth: ml, val)" className="w-full bg-gray-800/60 border-gray-700 rounded-lg" />
                                <input type="text" placeholder="Nilai (cth: 20% atau +100)" className="w-full bg-gray-800/60 border-gray-700 rounded-lg" />
                                <input type="text" placeholder="Kode Promo (opsional)" className="w-full bg-gray-800/60 border-gray-700 rounded-lg" />
                                <div className="flex gap-4"><input type="text" placeholder="Tgl Mulai" className="w-1/2 bg-gray-800/60 border-gray-700 rounded-lg" onFocus={(e) => e.target.type = 'date'}/><input type="text" placeholder="Tgl Selesai" className="w-1/2 bg-gray-800/60 border-gray-700 rounded-lg" onFocus={(e) => e.target.type = 'date'}/></div>
                                <div className="flex justify-between items-center p-2 bg-gray-800/60 rounded-lg"><label className="text-gray-300">Status Aktif</label><div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in"><input type="checkbox" name="toggle" id="toggle" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/><label htmlFor="toggle" className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label></div></div>
                                <button className="w-full p-3 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg text-white font-semibold hover:scale-105 transition-transform">Simpan Cepat</button>
                            </div>
                        )}
                    </div>
                     {/* Recent Activity */}
                    <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold text-white mb-4">Aktivitas Terbaru</h2>
                        <div className="space-y-4">
                            {activityFeed.map((item, index) => (
                                <div key={index} className="flex items-start gap-3 text-sm">
                                    <div className="w-2 h-2 rounded-full bg-purple-500 mt-1.5 flex-shrink-0"></div>
                                    <div>
                                        <p className="text-gray-300">{item.text}</p>
                                        <p className="text-gray-500 text-xs">{item.time}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <style>{`.toggle-checkbox:checked { right: 0; border-color: #4c51bf; } .toggle-checkbox:checked + .toggle-label { background-color: #4c51bf; }`}</style>
        </div>
    );
};

export default Promos;