'use client'

import { useEffect } from 'react'
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext'
import { useRouter } from 'next/navigation'
import EmployeeDashboard from '@/components/admin/EmployeeDashboard'
import { motion } from 'framer-motion'

export default function AdminDashboardPage() {
  const { employee, loading } = useEmployeeAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !employee) {
      router.push('/admin')
    }
  }, [employee, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-zuri-dark flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-zuri-gold border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!employee) {
    return null
  }

  return (
    <div className="min-h-screen bg-zuri-dark">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container-custom py-8"
      >
        <EmployeeDashboard />
      </motion.div>
    </div>
  )
} 