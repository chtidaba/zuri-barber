'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import ClientDashboard from '@/components/dashboard/ClientDashboard'
import EmployeeDashboard from '@/components/dashboard/EmployeeDashboard'
import { motion } from 'framer-motion'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-zuri-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zuri-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-zuri-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container-custom py-8"
      >
        {user.role === 'CLIENT' ? (
          <ClientDashboard />
        ) : (
          <EmployeeDashboard />
        )}
      </motion.div>
    </div>
  )
} 