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

import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Games from './pages/admin/Games'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import Users from './pages/admin/Users'

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
  const isAdmin = user?.email === 'admin@fomogame.com' || user?.user_metadata?.role === 'admin'
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

function AppWithLoader() {
  const [showInitialLoader, setShowInitialLoader] = useState(true) // Cuma pas refresh / buka pertama
  const [showPostLoginLoader, setShowPostLoginLoader] = useState(false) // Cuma habis login berhasil
  const { user, loading: userLoading } = useUser()

  // 1. Loading pas buka web pertama kali / refresh
  useEffect(() => {
    const timer = setTimeout(() => setShowInitialLoader(false), 2500) // 2.5 detik
    return () => clearTimeout(timer)
  }, []) // Dependency kosong → cuma sekali

  // 2. Loading pas habis login berhasil (user muncul)
  useEffect(() => {
    if (!userLoading && user) {
      setShowPostLoginLoader(true)
      const timer = setTimeout(() => setShowPostLoginLoader(false), 2200) // 2.2 detik
      return () => clearTimeout(timer)
    }
  }, [user, userLoading]) // Trigger cuma pas user berubah dari null ke ada

  if (userLoading) return <PageLoader />

  const isLoading = showInitialLoader || showPostLoginLoader

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <PageLoader key="loader" />}
      </AnimatePresence>

      {!isLoading && (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game/:slug" element={<GameDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
          <Route path="/admin/games" element={<AdminRoute><AdminLayout><Games /></AdminLayout></AdminRoute>} />
          <Route path="/admin/products" element={<AdminRoute><AdminLayout><Products /></AdminLayout></AdminRoute>} />
          <Route path="/admin/orders" element={<AdminRoute><AdminLayout><Orders /></AdminLayout></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminLayout><Users /></AdminLayout></AdminRoute>} />

          <Route path="*" element={<NotFound />} />
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