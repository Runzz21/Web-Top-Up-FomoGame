// src/App.tsx → FINAL GOD MODE ADMIN + CRUD LENGKAP!
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import GameDetail from './pages/GameDetail'
import Checkout from './pages/Checkout'
import Success from './pages/Success'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin'
import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import Games from './pages/admin/Games'
import Products from './pages/admin/Products'
import Orders from './pages/admin/Orders'
import Users from './pages/admin/Users'

import { useUser } from './hooks/useUser'
import type { ReactNode } from 'react'

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/20 flex items-center justify-center">
        <div className="text-5xl font-bold text-rose-500 animate-pulse">
          FomoGame Loading...
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : <Navigate to="/login" replace />
}

function AdminRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useUser()

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-5xl text-rose-500 animate-pulse">Checking Admin Access...</p>
      </div>
    )
  }

  const isAdmin = user?.email === 'admin@fomogame.com' || user?.user_metadata?.role === 'admin'

  if (!user || !isAdmin) {
    return <Navigate to="/admin/login" replace />
  }

  return <>{children}</>
}

function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-[#0f0f0f] to-purple-900/20 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-9xl font-black text-rose-500">404</h1>
        <p className="text-3xl mt-4">Halaman tidak ditemukan bro!</p>
        <a href="/" className="mt-8 inline-block bg-rose-600 hover:bg-rose-700 px-8 py-4 rounded-xl text-xl font-bold">
          Kembali ke Home
        </a>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/game/:slug" element={<GameDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected User Routes */}
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/success" element={<ProtectedRoute><Success /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />

        {/* Admin Routes - FULL CRUD */}
        <Route path="/admin/login" element={<AdminLogin />} />
        
        <Route path="/admin" element={
          <AdminRoute>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </AdminRoute>
        } />

        <Route path="/admin/games" element={
          <AdminRoute>
            <AdminLayout>
              <Games />
            </AdminLayout>
          </AdminRoute>
        } />

        <Route path="/admin/products" element={
          <AdminRoute>
            <AdminLayout>
              <Products />
            </AdminLayout>
          </AdminRoute>
        } />

        <Route path="/admin/orders" element={
          <AdminRoute>
            <AdminLayout>
              <Orders />
            </AdminLayout>
          </AdminRoute>
        } />

        <Route path="/admin/users" element={
          <AdminRoute>
            <AdminLayout>
              <Users />
            </AdminLayout>
          </AdminRoute>
        } />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}