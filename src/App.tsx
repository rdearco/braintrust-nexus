import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from '@/contexts/AuthContext'
import { LoginForm } from '@/components/auth/LoginForm'
import { Layout } from '@/components/layout/Layout'
import { AdminDashboard } from '@/components/admin/Dashboard/Dashboard'
import { ClientManagement } from '@/components/admin/ClientManagement/ClientManagement'
import { UserManagement } from '@/components/admin/UserManagement/UserManagement'
import { Subscriptions } from '@/components/admin/Subscriptions/Subscriptions'
import { SubscriptionNew } from '@/components/admin/SubscriptionNew/SubscriptionNew'
import { Exceptions } from '@/components/admin/Exceptions/Exceptions'
import { Credentials } from '@/components/admin/Credentials/Credentials'
import { ClientDashboard } from '@/components/client/Dashboard/Dashboard'
import { WorkflowManagement } from '@/components/client/WorkflowManagement/WorkflowManagement'
import { ExceptionHandling } from '@/components/client/ExceptionHandling/ExceptionHandling'
import './index.css'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }
  
  if (!user) {
    return <LoginForm />
  }
  
  return <Layout>{children}</Layout>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  if (user?.role !== 'admin' && user?.role !== 'se') {
    return <Navigate to="/client" replace />
  }
  
  return <>{children}</>
}

function ClientRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  
  if (user?.role !== 'client') {
    return <Navigate to="/admin" replace />
  }
  
  return <>{children}</>
}

function AppRoutes() {
  const { user } = useAuth()
  
  return (
    <Routes>
      <Route path="/login" element={<LoginForm />} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute>
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/clients" element={
        <ProtectedRoute>
          <AdminRoute>
            <ClientManagement />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/users" element={
        <ProtectedRoute>
          <AdminRoute>
            <UserManagement />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/subscriptions" element={
        <ProtectedRoute>
          <AdminRoute>
            <Subscriptions />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/subscriptions/new" element={
        <ProtectedRoute>
          <AdminRoute>
            <SubscriptionNew />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/exceptions" element={
        <ProtectedRoute>
          <AdminRoute>
            <Exceptions />
          </AdminRoute>
        </ProtectedRoute>
      } />
      <Route path="/admin/credentials" element={
        <ProtectedRoute>
          <AdminRoute>
            <Credentials />
          </AdminRoute>
        </ProtectedRoute>
      } />
      
      {/* Client Routes */}
      <Route path="/client" element={
        <ProtectedRoute>
          <ClientRoute>
            <ClientDashboard />
          </ClientRoute>
        </ProtectedRoute>
      } />
      <Route path="/client/workflows" element={
        <ProtectedRoute>
          <ClientRoute>
            <WorkflowManagement />
          </ClientRoute>
        </ProtectedRoute>
      } />
      <Route path="/client/exceptions" element={
        <ProtectedRoute>
          <ClientRoute>
            <ExceptionHandling />
          </ClientRoute>
        </ProtectedRoute>
      } />
      
      {/* Default redirects */}
      <Route path="/" element={
        <Navigate to={user?.role === 'client' ? '/client' : '/admin'} replace />
      } />
      <Route path="*" element={
        <Navigate to={user?.role === 'client' ? '/client' : '/admin'} replace />
      } />
    </Routes>
  )
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

export default App