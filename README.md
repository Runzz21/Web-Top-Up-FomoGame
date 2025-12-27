# FomoGame: Platform Top-Up Diamond Mobile Gaming

FomoGame adalah platform web modern untuk melakukan top-up diamond (mata uang dalam game) untuk berbagai game mobile. Dilengkapi dengan dashboard admin yang komprehensif, FomoGame memungkinkan pengelolaan game, produk, transaksi, pengguna, promosi, dan metode pembayaran secara efisien. Desainnya responsif, menjamin pengalaman pengguna yang optimal baik di desktop maupun perangkat mobile.

## Fitur Utama

### Pengguna (User-facing)
*   **Top-Up Game**: Proses pembelian diamond yang mudah dan cepat untuk berbagai game.
*   **Riwayat Transaksi**: Melihat riwayat pembelian.
*   **Profil Pengguna**: Pengelolaan akun dan pengaturan.
*   **Promo & Bonus**: Menerima penawaran dan bonus menarik.

### Admin Dashboard
*   **Statistik Real-time**: Memantau total pendapatan, pesanan harian/mingguan/bulanan, dan statistik pengguna (total, bulanan, mingguan, harian) secara real-time.
*   **Manajemen Game**: Menambah, mengedit, atau menghapus daftar game yang tersedia.
*   **Manajemen Produk & Harga**: Mengelola item top-up dan harganya untuk setiap game, termasuk diskon dan stok.
*   **Manajemen Pesanan (Transaksi)**: Melihat detail semua transaksi, mengubah status pesanan (Sukses/Gagal) dengan konfirmasi modal yang interaktif.
*   **Manajemen Pengguna**: Melihat daftar pengguna, informasi detail, dan status terakhir login.
*   **Manajemen Promo & Bonus**: Membuat, mengedit, dan melacak kampanye promosi.
*   **Manajemen Metode Pembayaran**: Mengkonfigurasi gateway pembayaran, mengatur biaya transaksi, dan melihat log gateway terbaru.
*   **Sistem Notifikasi**: Bell notifikasi real-time untuk pesanan pending di header admin.
*   **Pencarian Global**: Fungsionalitas pencarian terpadu di dashboard admin untuk memfilter pesanan, pengguna, dan data lainnya.
*   **Pengaturan Sistem**: Mengelola konfigurasi situs (umum, keamanan, notifikasi, backup, API).

### Desain & Pengalaman Pengguna
*   **Desain Modern & Responsif**: Tampilan menarik dan user-friendly, beradaptasi dengan baik di desktop dan perangkat mobile.
*   **Animasi Halus**: Menggunakan `framer-motion` untuk transisi dan interaksi yang halus.
*   **Real-time Updates**: Statistik dan pesanan diperbarui secara langsung menggunakan Supabase Realtime.
*   **Background Dinamis**: Latar belakang animasi "floating lines" untuk halaman otentikasi.

## Teknologi yang Digunakan

*   **Frontend**: React.js, TypeScript
*   **Styling**: Tailwind CSS, clsx
*   **State Management**: React Hooks (useState, useEffect)
*   **Routing**: React Router DOM
*   **Backend as a Service (BaaS)**: Supabase (Auth, Database, Realtime, Storage, Edge Functions/RPCs)
*   **Validasi Form**: React Hook Form, Zod
*   **Notifikasi UI**: React Hot Toast
*   **Ikonografi**: Lucide React
*   **Animasi UI**: Framer Motion

## Instalasi & Setup Proyek

Untuk menjalankan proyek FomoGame ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

### Prasyarat
Pastikan Anda telah menginstal yang berikut ini di mesin pengembangan Anda:
*   **Node.js**: Versi 18.x atau lebih tinggi (disarankan).
*   **npm** atau **Yarn** atau **pnpm**: Manajer paket JavaScript.

### Langkah 1: Clone Repositori
```bash
git clone <URL_REPOSITORI_ANDA>
cd fomogame
```
*(Ganti `<URL_REPOSITORI_ANDA>` dengan URL repositori GitHub Anda)*

### Langkah 2: Instal Dependensi
Gunakan manajer paket pilihan Anda untuk menginstal semua dependensi proyek:
```bash
npm install
# atau
yarn install
# atau
pnpm install
```

### Langkah 3: Setup Supabase
FomoGame menggunakan Supabase sebagai backend-nya. Anda perlu membuat proyek Supabase baru:
1.  **Buat Proyek Supabase**: Kunjungi [Supabase.com](https://supabase.com/) dan buat proyek baru.
2.  **Dapatkan Kredensial API**:
    *   Setelah proyek Anda dibuat, navigasikan ke `Project Settings` > `API`.
    *   Catat `Project URL` Anda.
    *   Catat `anon public` key Anda.
    *   *(Opsional)* Catat `service_role` key Anda jika ada operasi backend yang memerlukan akses admin penuh (misalnya, untuk RPC `get_all_users`).

### Langkah 4: Konfigurasi Variabel Lingkungan
Buat file `.env` di direktori root proyek (`fomogame/`) Anda dan tambahkan kredensial Supabase Anda:
```
VITE_SUPABASE_URL="URL_PROYEK_SUPABASE_ANDA"
VITE_SUPABASE_ANON_KEY="KUNCI_ANON_PUBLIK_SUPABASE_ANDA"
# VITE_SUPABASE_SERVICE_KEY="KUNCI_SERVICE_ROLE_SUPABASE_ANDA" # Hanya jika diperlukan
```
*(Ganti placeholder dengan kredensial Supabase Anda yang sebenarnya).*

### Langkah 5: Skema Database & RPCs (Penting!)
Agar dashboard admin berfungsi dengan benar, Anda perlu menyiapkan skema database dan fungsi RPC di proyek Supabase Anda. Anda akan memerlukan tabel seperti `profiles`, `transactions`, dan mungkin beberapa `VIEW` atau `FUNCTION` untuk statistik (misalnya `user_stats`, `order_stats`, `total_revenue`, `pending_orders_count`, `payment_stats_grouped`, `payment_methods_popular`).

*   **Tabel**: `profiles`, `transactions`. Pastikan `transactions` memiliki `user_id` yang terhubung ke `profiles`.
*   **Fungsi RPC**: Dashboard admin sangat bergantung pada fungsi `get_all_users()`. Anda perlu membuat fungsi SQL ini di Supabase Anda untuk mengambil data pengguna secara komprehensif (biasanya dari tabel `auth.users` dan `public.profiles`).
    *(Contoh dasar `get_all_users` RPC dapat ditemukan di dokumentasi Supabase atau Anda mungkin sudah memilikinya dari proyek asal).*

### Langkah 6: Jalankan Aplikasi
Setelah semua dependensi terinstal dan Supabase dikonfigurasi, Anda dapat menjalankan server pengembangan:
```bash
npm run dev
# atau
yarn dev
# atau
pnpm dev
```
Aplikasi akan terbuka di browser Anda (biasanya di `http://localhost:5173` atau port lain yang tersedia).

## Penggunaan

### Akses Aplikasi Frontend
*   Buka browser Anda dan navigasikan ke `http://localhost:5173`.

### Akses Admin Dashboard
*   Navigasikan ke `http://localhost:5173/admin/login`.
*   **Kredensial Admin Default**:
    *   **Email**: `admin@fomogame.com`
    *   **Password**: `admin123`
    *(Pastikan akun admin ini terdaftar di Supabase Auth dan, jika `get_all_users` memfilter berdasarkan email admin, pastikan email ini cocok).*

Selamat Mengelola FomoGame!

---
**Catatan**: Jika Anda mengalami masalah dengan Hot Module Reloading (HMR) atau error yang tidak terduga setelah perubahan, coba hentikan server (`Ctrl+C`) dan mulai ulang (`npm run dev`). Jika masih ada masalah caching, pertimbangkan untuk menghapus `node_modules/.vite` atau folder cache build serupa di proyek Anda.