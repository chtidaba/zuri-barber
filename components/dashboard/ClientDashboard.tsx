'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, LogOut, Plus, CalendarDays } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

interface Appointment {
  id: string
  date: string
  time: string
  duration: number
  status: string
  employee: {
    name: string
  }
  prestations: Array<{
    title: string
    price: number
  }>
}

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Fetch user's appointments from API
    // For now, using mock data
    setLoading(false)
  }, [])

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif text-zuri-gold mb-2">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-zuri-light">Manage your appointments and bookings</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center px-4 py-2 bg-zuri-dark text-zuri-light hover:text-zuri-gold transition-colors duration-300 rounded-lg"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Logout
        </button>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Link href="/booking">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-zuri-gray p-6 rounded-xl border border-zuri-dark hover:border-zuri-gold transition-colors duration-300 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zuri-gold rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-zuri-dark" />
              </div>
              <div>
                <h3 className="text-zuri-gold font-medium text-lg">Book New Appointment</h3>
                <p className="text-zuri-light text-sm">Schedule your next visit</p>
              </div>
            </div>
          </motion.div>
        </Link>

        <Link href="/dashboard/appointments">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="bg-zuri-gray p-6 rounded-xl border border-zuri-dark hover:border-zuri-gold transition-colors duration-300 cursor-pointer"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-zuri-gold rounded-lg flex items-center justify-center">
                <CalendarDays className="w-6 h-6 text-zuri-dark" />
              </div>
              <div>
                <h3 className="text-zuri-gold font-medium text-lg">View All Appointments</h3>
                <p className="text-zuri-light text-sm">See your booking history</p>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>

      {/* Recent Appointments */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-zuri-gray p-6 rounded-xl border border-zuri-dark"
      >
        <h2 className="text-2xl font-serif text-zuri-gold mb-6">Recent Appointments</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-zuri-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-zuri-light mx-auto mb-4" />
            <p className="text-zuri-light mb-4">No appointments yet</p>
            <Link
              href="/booking"
              className="inline-flex items-center px-4 py-2 bg-zuri-gold text-zuri-dark rounded-lg hover:bg-white transition-colors duration-300"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book Your First Appointment
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {appointments.slice(0, 3).map((appointment) => (
              <motion.div
                key={appointment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-zuri-dark p-4 rounded-lg border border-zuri-gray"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-zuri-gold rounded-lg flex items-center justify-center">
                      <Calendar className="w-5 h-5 text-zuri-dark" />
                    </div>
                    <div>
                      <h4 className="text-zuri-gold font-medium">
                        {new Date(appointment.date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-zuri-light">
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {appointment.time}
                        </span>
                        <span className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {appointment.employee.name}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      appointment.status === 'CONFIRMED' 
                        ? 'bg-green-500/20 text-green-400'
                        : appointment.status === 'PENDING'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* User Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-zuri-gray p-6 rounded-xl border border-zuri-dark"
      >
        <h2 className="text-2xl font-serif text-zuri-gold mb-6">Account Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-zuri-light text-sm font-medium mb-2">Name</label>
            <p className="text-zuri-gold">{user?.name}</p>
          </div>
          <div>
            <label className="block text-zuri-light text-sm font-medium mb-2">Email</label>
            <p className="text-zuri-gold">{user?.email}</p>
          </div>
          {user?.phone && (
            <div>
              <label className="block text-zuri-light text-sm font-medium mb-2">Phone</label>
              <p className="text-zuri-gold">{user.phone}</p>
            </div>
          )}
          <div>
            <label className="block text-zuri-light text-sm font-medium mb-2">Account Type</label>
            <p className="text-zuri-gold">Client</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
} 