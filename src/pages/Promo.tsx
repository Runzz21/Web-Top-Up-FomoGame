// src/pages/Promo.tsx
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import PromoSlider from '../components/PromoSlider';
import { motion } from 'framer-motion';
import { Gem, Crown, Calendar, Ticket } from 'lucide-react';

const promoData = [
  {
    id: 1,
    title: "BONUS +20% DIAMOND",
    description: "Dapatkan bonus 20% Diamond setiap top up Mobile Legends & Free Fire dengan minimal pembelian Rp50.000.",
    cta: "Klaim Sekarang",
    icon: Gem,
    theme: "cyan",
  },
  {
    id: 2,
    title: "DISKON 10% TOP UP PERTAMA",
    description: "Pengguna baru? Nikmati diskon 10% untuk transaksi pertamamu di game apa saja. Berlaku selamanya!",
    cta: "Daftar & Klaim",
    icon: Crown,
    theme: "purple",
  },
  {
    id: 3,
    title: "WEEKLY PASS SUPER HEMAT",
    description: "Langganan Weekly Pass Mobile Legends dan dapatkan keuntungan diamond harian dengan hemat hingga 30%.",
    cta: "Beli Pass",
    icon: Calendar,
    theme: "pink",
  },
  {
    id: 4,
    title: "VOUCHER CASHBACK 50%",
    description: "Gunakan kode 'FOMOHEMAT' dan dapatkan cashback 50% (maks. Rp10.000) untuk top up Valorant Points.",
    cta: "Gunakan Kode",
    icon: Ticket,
    theme: "yellow",
  }
];

const cardColors: { [key: string]: string } = {
    cyan: 'hover:border-cyan-500/80 hover:shadow-cyan-500/20',
    purple: 'hover:border-purple-500/80 hover:shadow-purple-500/20',
    pink: 'hover:border-pink-500/80 hover:shadow-pink-500/20',
    yellow: 'hover:border-yellow-500/80 hover:shadow-yellow-500/20',
};

const iconColors: { [key: string]: string } = {
    cyan: 'text-cyan-400',
    purple: 'text-purple-400',
    pink: 'text-pink-400',
    yellow: 'text-yellow-400',
};

export default function PromoPage() {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  return (
    <>
      <Navbar />
      <div className="bg-black text-white">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          
          {/* Slider Section */}
          <section className="mb-20">
            <PromoSlider />
          </section>

          {/* Promo Grid Section */}
          <section>
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-rose-400 to-purple-500 bg-clip-text text-transparent">
                Semua Promo Aktif
              </h2>
              <p className="mt-4 text-lg text-gray-400">
                Jangan lewatkan kesempatan emas ini untuk mendapatkan keuntungan lebih!
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {promoData.map((promo) => (
                <motion.div
                  key={promo.id}
                  variants={itemVariants}
                  className={`bg-gray-950/50 border-2 border-gray-800 rounded-2xl p-8 transition-all duration-300 ${cardColors[promo.theme]} active:scale-[0.98] active:border-${promo.theme}-500`}
                >
                  <div className="flex items-start gap-6">
                    <div className={`p-3 rounded-lg bg-gray-900 border border-gray-700 ${iconColors[promo.theme]}`}>
                      <promo.icon size={32} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{promo.title}</h3>
                      <p className="text-gray-400 mb-6">{promo.description}</p>
                      <button className="font-bold text-lg bg-gradient-to-r from-rose-600 to-purple-600 text-white px-6 py-2 rounded-lg hover:scale-105 active:scale-100 transition-transform">
                        {promo.cta}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </section>
        </main>
      </div>
      <Footer />
    </>
  );
}
