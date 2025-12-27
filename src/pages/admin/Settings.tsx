// fomogame/src/pages/admin/Settings.tsx
import { useState } from 'react';
import { Settings as SettingsIcon, Shield, Bell, HardDrive, Code, ChevronDown } from 'lucide-react'; // Added ChevronDown
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion'; // Added framer-motion

const tabs = [
    { name: 'Umum', icon: SettingsIcon },
    { name: 'Keamanan', icon: Shield },
    { name: 'Notifikasi', icon: Bell },
    { name: 'Backup & Maintenance', icon: HardDrive },
    { name: 'API & Integration', icon: Code },
];

const Toggle = ({ label, description, defaultChecked = false }: { label: string, description: string, defaultChecked?: boolean }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800/50 rounded-lg">
        <div>
            <p className="font-semibold text-white">{label}</p>
            <p className="text-sm text-gray-400">{description}</p>
        </div>
        <div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
            <input type="checkbox" defaultChecked={defaultChecked} id={label} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" />
            <label htmlFor={label} className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-600 cursor-pointer"></label>
        </div>
    </div>
);

const InputField = ({ label, value, type = 'text' }: { label: string, value: string, type?: string }) => (
    <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
        <input type={type} defaultValue={value} className="w-full bg-gray-800/60 border-gray-700 rounded-lg text-white" />
    </div>
);

const Settings = () => {
    const [activeTab, setActiveTab] = useState('Umum');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for custom dropdown visibility

    const renderContent = () => {
        switch (activeTab) {
            case 'Umum': return (
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Pengaturan Umum</h2>
                    <InputField label="Nama Situs" value="FomoGame" />
                    <InputField label="Tagline" value="Top Up Diamond Termurah & Tercepat 24 Jam" />
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Logo & Favicon</label>
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                            <button className="p-2 sm:p-3 bg-gray-800/60 rounded-lg text-gray-300 text-sm">Upload Logo</button>
                            <button className="p-2 sm:p-3 bg-gray-800/60 rounded-lg text-gray-300 text-sm">Upload Favicon</button>
                        </div>
                    </div>
                    <Toggle label="Maintenance Mode" description="Aktifkan untuk menonaktifkan akses publik ke situs." />
                    <InputField label="Nomor Kontak (WhatsApp)" value="+6281234567890" />
                    <InputField label="Email Kontak" value="support@fomogame.com" />
                </div>
            );
            case 'Keamanan': return (
                <div className="space-y-4 sm:space-y-6">
                     <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Pengaturan Keamanan</h2>
                     <Toggle label="2FA untuk Admin" description="Wajibkan Two-Factor Authentication untuk semua akun admin." defaultChecked={true}/>
                     <InputField label="Rate Limit Login (per menit)" value="5" type="number" />
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">IP Whitelist Admin</label>
                        <textarea rows={4} className="w-full bg-gray-800/60 border-gray-700 rounded-lg text-white p-2 text-sm" defaultValue={"127.0.0.1\n192.168.1.1"}></textarea>
                        <p className="text-xs text-gray-500 mt-1">Satu alamat IP per baris.</p>
                     </div>
                     <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                         <div><p className="font-semibold text-white text-sm">SSL Status</p><p className="text-xs text-gray-400">Let's Encrypt - Valid until 20 Mar 2026</p></div>
                         <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400 border border-green-500/30">Aktif & Valid</span>
                     </div>
                </div>
            );
            case 'Notifikasi': return (
                <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Pengaturan Notifikasi</h2>
                    <Toggle label="Notifikasi Email" description="Kirim notifikasi ke user via email untuk status pesanan." defaultChecked={true} />
                    <Toggle label="Notifikasi WhatsApp" description="Gunakan WhatsApp API untuk mengirim notifikasi pesanan." />
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Template Pesan Sukses</label>
                        <textarea rows={3} className="w-full bg-gray-800/60 border-gray-700 rounded-lg text-white p-2 text-sm" defaultValue={"Hai {user}, pesanan {item} kamu telah berhasil! Terima kasih telah top up di FomoGame." }></textarea>
                     </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Template Pesan Gagal</label>
                        <textarea rows={3} className="w-full bg-gray-800/60 border-gray-700 rounded-lg text-white p-2 text-sm" defaultValue={"Hai {user}, mohon maaf pesanan {item} kamu gagal. Silakan hubungi support jika ada kendala." }></textarea>
                     </div>
                </div>
            );
            case 'Backup & Maintenance': return (
                 <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">Backup & Maintenance</h2>
                    <Toggle label="Auto-backup Database Harian" description="Backup database secara otomatis setiap pukul 02:00." defaultChecked={true} />
                    <div className="flex items-center justify-between p-3 sm:p-4 bg-gray-800/50 rounded-lg">
                        <div><p className="font-semibold text-white text-sm">Hapus Cache Aplikasi</p><p className="text-xs text-gray-400">Bersihkan semua cache untuk memperbarui data.</p></div>
                        <button className="p-2 px-4 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-white font-semibold text-sm">Hapus Cache</button>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Log Sistem Terbaru</label>
                        <div className="h-48 sm:h-64 p-3 sm:p-4 font-mono text-xs text-gray-300 bg-black rounded-lg overflow-y-scroll">
                            <p>[2025-12-21 14:10:05] [INFO] Admin login: admin@fomogame.com</p>
                            <p>[2025-12-21 14:02:15] [SUCCESS] Payment GW: QRIS, Order: ORD-241225-001</p>
                            <p>[2025-12-21 13:59:05] [ERROR] Payment GW: OVO, Order: ORD-241225-004, Reason: Insufficient Balance</p>
                        </div>
                     </div>
                </div>
            );
            case 'API & Integration': return (
                 <div className="space-y-4 sm:space-y-6">
                    <h2 className="text-xl sm:text-2xl font-bold text-white mb-4">API & Integrasi</h2>
                    <Toggle label="Integrasi Digiflazz" description="Gunakan Digiflazz sebagai salah satu provider produk digital." defaultChecked={true} />
                    <InputField label="Digiflazz API Key" value="********" type="password" />
                    <Toggle label="Integrasi Unipin" description="Gunakan Unipin as provider alternatif." />
                    <InputField label="Unipin API Key" value="********" type="password" />
                    <hr className="border-gray-700"/>
                    <InputField label="URL Webhook Payment Gateway" value="https://fomogame.com/api/webhook/payment" />
                </div>
            );
            default: return null;
        }
    };

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-white bg-gradient-to-r from-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
                    Pengaturan Sistem
                </h1>
                <p className="text-gray-400 mt-1">Kelola konfigurasi global untuk platform FomoGame.</p>
            </div>

            {/* Tab Navigation */}
            {/* Desktop Tabs */}
            <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-xl p-2 hidden md:flex items-center gap-2">
                {tabs.map(tab => {
                    const isActive = activeTab === tab.name;
                    return (
                        <button 
                            key={tab.name}
                            onClick={() => setActiveTab(tab.name)}
                            className={clsx(
                                'flex-1 p-3 flex items-center justify-center gap-3 rounded-lg font-semibold transition-all duration-300',
                                isActive ? 'bg-purple-600/30 text-white shadow-lg shadow-purple-600/20' : 'text-gray-400 hover:bg-gray-800/50'
                            )}
                        >
                            <tab.icon size={18}/>
                            {tab.name}
                        </button>
                    )
                })}
            </div>
            
            {/* Mobile Dropdown */}
            <div className="md:hidden relative">
                <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center justify-between w-full px-4 py-3 bg-gray-800/60 border border-gray-700 rounded-lg text-white text-left text-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                >
                    <span>{tabs.find(tab => tab.name === activeTab)?.name}</span>
                    <ChevronDown size={20} className={clsx("text-gray-400 transition-transform", isDropdownOpen && "rotate-180")} />
                </button>
                
                <AnimatePresence>
                    {isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full mt-2 w-full rounded-lg shadow-lg bg-gray-800 ring-1 ring-black ring-opacity-5 z-10"
                        >
                            {tabs.map(tab => (
                                <button
                                    key={tab.name}
                                    type="button"
                                    onClick={() => {
                                        setActiveTab(tab.name);
                                        setIsDropdownOpen(false);
                                    }}
                                    className={clsx("block w-full text-left px-4 py-3 text-sm transition", activeTab === tab.name ? "bg-purple-600/30 text-white" : "text-gray-300 hover:bg-gray-700/80")}
                                >
                                    {tab.name}
                                </button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            
            {/* Tab Content */}
            <div className="bg-gray-900/50 backdrop-blur-lg border border-gray-800/70 rounded-2xl p-4 sm:p-8">
                {renderContent()}
                <div className="border-t border-gray-800/70 mt-6 pt-4 sm:mt-8 sm:pt-6 text-right">
                    <button className="p-2 px-6 bg-gradient-to-r from-rose-600 to-purple-600 rounded-lg text-white font-bold text-base hover:scale-105 transition-transform">
                        Simpan Perubahan
                    </button>
                </div>
            </div>
            <style>{`.toggle-checkbox:checked { right: 0; border-color: #a855f7; } .toggle-checkbox:checked + .toggle-label { background-color: #a855f7; }`}</style>
        </div>
    );
};

export default Settings;
