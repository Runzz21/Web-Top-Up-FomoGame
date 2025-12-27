// src/pages/HowToTopUp.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Gamepad, Fingerprint, DollarSign, CreditCard, CheckCircle, Diamond } from 'lucide-react';

const steps = [
  {
    icon: Gamepad,
    title: '1. Pilih Game & Produk',
    description: 'Pilih game favoritmu dari daftar di FomoGame, lalu pilih produk atau nominal diamond yang ingin kamu beli.',
  },
  {
    icon: Fingerprint,
    title: '2. Masukkan ID Pengguna',
    description: 'Masukkan ID Pengguna (User ID) game kamu dengan benar. Pastikan tidak ada kesalahan agar diamond terkirim ke akun yang tepat.',
  },
  {
    icon: DollarSign,
    title: '3. Pilih Metode Pembayaran',
    description: 'FomoGame menyediakan berbagai metode pembayaran terlengkap. Pilih yang paling nyaman untukmu!',
  },
  {
    icon: CreditCard,
    title: '4. Konfirmasi & Bayar',
    description: 'Periksa kembali detail pesananmu. Jika sudah benar, lanjutkan ke proses pembayaran. Lakukan pembayaran sesuai instruksi.',
  },
  {
    icon: CheckCircle,
    title: '5. Selesai! Diamond Langsung Masuk',
    description: 'Setelah pembayaran berhasil dikonfirmasi, diamond akan secara otomatis terkirim ke akun game kamu dalam hitungan detik. Selamat bermain!',
  },
];

export default function HowToTopUp() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-b from-black via-[#050010] to-[#0a001a] py-12 px-0 sm:px-4 lg:px-8">
        <div className="max-w-full sm:max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent mb-4">
              Cara Top Up di FomoGame
            </h1>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              Ikuti langkah-langkah mudah berikut untuk mendapatkan diamond impianmu dalam hitungan detik!
            </p>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {steps.map((step, index) => (
              <div
                key={index}
                className="bg-gray-900/70 border border-white/10 rounded-2xl p-8 backdrop-blur-sm transition-all hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 flex flex-col items-center text-center"
              >
                <div className="text-rose-500 mb-6 bg-rose-500/10 p-4 rounded-full border border-rose-500/30">
                  <step.icon size={48} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-3">{step.title}</h2>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-20">
            <h3 className="text-4xl font-bold text-white mb-6">Siap untuk Top Up Sekarang?</h3>
            <button
              onClick={() => window.location.href = '/'} // Redirect to home page
              className="bg-gradient-to-r from-rose-600 to-purple-600 text-white font-black px-12 py-5 rounded-full text-2xl hover:scale-105 transition-transform shadow-lg"
            >
              <Diamond size={24} className="inline-block mr-3" />
              TOP UP SEKARANG!
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
