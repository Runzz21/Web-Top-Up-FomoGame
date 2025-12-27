// src/App.tsx → FINAL — LOADING CUMA PAS REFRESH & HABIS LOGIN BERHASIL!
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import HowToTopUp from './pages/HowToTopUp'; // Re-add HowToTopUp import

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Games from './pages/admin/Games'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import Users from './pages/admin/Users'
import Promos from './pages/admin/Promos'
import Payments from './pages/admin/Payments'
import Settings from './pages/admin/Settings'

// Import Settings Pages
import SettingsLayout from './pages/SettingsLayout';
import ProfileSettings from './pages/settings/Profile';
import SecuritySettings from './pages/settings/Security';

import { useUser } from './hooks/useUser'
import PageLoader from './components/PageLoader'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser()
  if (loading) return <PageLoader />
  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser()
  if (loading) return <PageLoader />
  const isAdmin = user?.email === 'admin@fomogame.com'
  return user && isAdmin ? <>{children}</> : <Navigate to="/admin/login" replace />
}

function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <h1 className="text-9xl font-black text-rose-500">404</h1>
        <p className="text-4xl mt-8">Halaman tidak ditemukan</p>
        <a href="/" className="mt-8 inline-block bg-gradient-to-r from-rose-600 to-purple-600 px-10 py-5 rounded-2xl text-2xl font-black">
          Kembali
        </a>
      </div>
    </div>
  )
}

import PopularGames from './pages/PopularGames';

import Promo from './pages/Promo';

function AppWithLoader() {
  const [showPostLoginLoader, setShowPostLoginLoader] = useState(false) // Cuma habis login berhasil
  const { user, loading: userLoading } = useUser()

  console.log('AppWithLoader: Rendered. userLoading:', userLoading, 'user:', user?.id ? 'found' : 'null', 'showPostLoginLoader:', showPostLoginLoader);

  // 2. Loading pas habis login berhasil (user muncul)
  useEffect(() => {
    console.log('AppWithLoader useEffect (post-login): userLoading:', userLoading, 'user:', user?.id ? 'found' : 'null', 'showPostLoginLoader:', showPostLoginLoader);
    if (!userLoading && user) {
      console.log('AppWithLoader: Triggering post-login loader.');
      setShowPostLoginLoader(true)
      const timer = setTimeout(() => {
        console.log('AppWithLoader: Hiding post-login loader.');
        setShowPostLoginLoader(false);
      }, 2200) // 2.2 detik
      return () => clearTimeout(timer)
    }
  }, [user, userLoading]) // Trigger cuma pas user berubah dari null ke ada

  if (userLoading) {
    console.log('AppWithLoader: Rendering full PageLoader due to userLoading.');
    return <PageLoader />;
  }

  const isLoading = showPostLoginLoader;
  console.log('AppWithLoader: Final isLoading status:', isLoading);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <Routes>
          <Route path="/" element={<Home />} key="home" />
          <Route path="/promo" element={<Promo />} key="promo" />
          <Route path="/popular-games" element={<PopularGames />} key="popular-games" />
          <Route path="/game/:slug" element={<GameDetail />} key="game-detail" />
          <Route path="/login" element={<Login />} key="login" />
          <Route path="/register" element={<Register />} key="register" />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} key="checkout" />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} key="success" />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} key="dashboard" />
          <Route path="/how-to-top-up" element={<HowToTopUp />} key="how-to-top-up" /> {/* Re-add HowToTopUp Route */}

          {/* Settings Routes (Explicit Structure) */}
          <Route path="/settings/profile" element={<ProtectedRoute><SettingsLayout><ProfileSettings /></SettingsLayout></ProtectedRoute>} key="settings-profile" />
          <Route path="/settings/security" element={<ProtectedRoute><SettingsLayout><SecuritySettings /></SettingsLayout></ProtectedRoute>} key="settings-security" />
          <Route path="/settings" element={<Navigate to="/settings/profile" replace />} key="settings-redirect" />

          <Route path="/admin/login" element={<AdminLogin />} key="admin-login" />
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} key="admin-dashboard-layout" />
          <Route path="/admin/games" element={<AdminRoute><AdminLayout><Games /></AdminLayout></AdminRoute>} key="admin-games" />
          <Route path="/admin/products" element={<AdminRoute><AdminLayout><Products /></AdminLayout></AdminRoute>} key="admin-products" />
          <Route path="/admin/orders" element={<AdminRoute><AdminLayout><Orders /></AdminLayout></AdminRoute>} key="admin-orders" />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><Users /></AdminLayout></AdminRoute>} key="admin-users" />
          <Route path="/admin/promos" element={<AdminRoute><AdminLayout><Promos /></AdminLayout></AdminRoute>} key="admin-promos" />
          <Route path="/admin/payments" element={<AdminRoute><AdminLayout><Payments /></AdminLayout></AdminRoute>} key="admin-payments" />
          <Route path="/admin/settings" element={<AdminRoute><AdminLayout><Settings /></AdminLayout></AdminRoute>} key="admin-settings" />

          <Route path="*" element={<NotFound />} key="not-found" />
        </Routes>
      )}
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWithLoader />
    </BrowserRouter>
  )
}