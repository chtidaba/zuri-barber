'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, User, LogOut, Settings, CalendarDays, Users, Plus, Edit, Menu, X } from 'lucide-react'
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext'
import Link from 'next/link'

interface Appointment {
  id: string
  date: string
  time: string
  duration: number
  status: string
  client: {
    name: string
    email: string
    phone?: string
  }
  prestations: Array<{
    prestation: {
      title: string
      price: number
    }
  }>
}

export default function EmployeeDashboard() {
  const { employee, logout } = useEmployeeAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!employee) return

      try {
        const response = await fetch(`/api/appointments/employee?employeeId=${employee.id}`)
        if (response.ok) {
          const data = await response.json()
          setAppointments(data)
        } else {
          console.error('Failed to fetch appointments:', response.status)
        }
      } catch (error) {
        console.error('Error fetching appointments:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppointments()
  }, [employee])

  const handleLogout = () => {
    logout()
  }

  const getTodayAppointments = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day
    
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.date)
      appointmentDate.setHours(0, 0, 0, 0) // Set to start of day
      return appointmentDate.getTime() === today.getTime()
    })
  }

  const getUpcomingAppointments = () => {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Set to start of day
    
    return appointments.filter(apt => {
      const appointmentDate = new Date(apt.date)
      appointmentDate.setHours(0, 0, 0, 0) // Set to start of day
      return appointmentDate.getTime() > today.getTime()
    }).slice(0, 5)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  return (
    <div className="min-h-screen bg-zuri-dark">
      {/* Mobile Header */}
      <div className="lg:hidden bg-zuri-gray border-b border-zuri-dark p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-zuri-light hover:text-zuri-gold transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
            <div>
              <h1 className="text-xl font-serif text-zuri-gold">Dashboard</h1>
              <p className="text-zuri-light text-sm">Welcome, {employee?.name}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-3 py-2 bg-zuri-dark text-zuri-light hover:text-zuri-gold transition-colors duration-300 rounded-lg text-sm"
          >
            <LogOut className="w-4 h-4 mr-1" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="lg:hidden bg-zuri-gray border-b border-zuri-dark"
        >
          <div className="p-4 space-y-3">
            <Link href="/admin/schedule" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zuri-dark transition-colors">
                <Calendar className="w-5 h-5 text-zuri-gold" />
                <span className="text-zuri-light">Manage Schedule</span>
              </div>
            </Link>
            <Link href="/admin/appointments" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zuri-dark transition-colors">
                <CalendarDays className="w-5 h-5 text-zuri-gold" />
                <span className="text-zuri-light">All Appointments</span>
              </div>
            </Link>
            <Link href="/admin/clients" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zuri-dark transition-colors">
                <Users className="w-5 h-5 text-zuri-gold" />
                <span className="text-zuri-light">Client List</span>
              </div>
            </Link>
            <Link href="/admin/settings" onClick={() => setMobileMenuOpen(false)}>
              <div className="flex items-center space-x-3 p-3 rounded-lg hover:bg-zuri-dark transition-colors">
                <Settings className="w-5 h-5 text-zuri-gold" />
                <span className="text-zuri-light">Settings</span>
              </div>
            </Link>
          </div>
        </motion.div>
      )}

      <div className="container-custom py-4 lg:py-8">
        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif text-zuri-gold mb-2">
              Welcome back, {employee?.name}!
            </h1>
            <p className="text-zuri-light">Manage your appointments and schedule</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 bg-zuri-dark text-zuri-light hover:text-zuri-gold transition-colors duration-300 rounded-lg"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Quick Actions - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8"
        >
          <Link href="/admin/schedule" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zuri-gray p-3 lg:p-6 rounded-xl border border-zuri-dark hover:border-zuri-gold transition-colors duration-300 cursor-pointer h-full"
            >
              <div className="flex flex-col items-center lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 h-full">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-zuri-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <Calendar className="w-4 h-4 lg:w-6 lg:h-6 text-zuri-dark" />
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h3 className="text-zuri-gold font-medium text-xs lg:text-lg">Schedule</h3>
                  <p className="text-zuri-light text-xs lg:text-sm">Set availability</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/appointments" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zuri-gray p-3 lg:p-6 rounded-xl border border-zuri-dark hover:border-zuri-gold transition-colors duration-300 cursor-pointer h-full"
            >
              <div className="flex flex-col items-center lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 h-full">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-zuri-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <CalendarDays className="w-4 h-4 lg:w-6 lg:h-6 text-zuri-dark" />
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h3 className="text-zuri-gold font-medium text-xs lg:text-lg">Appointments</h3>
                  <p className="text-zuri-light text-xs lg:text-sm">View bookings</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/clients" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zuri-gray p-3 lg:p-6 rounded-xl border border-zuri-dark hover:border-zuri-gold transition-colors duration-300 cursor-pointer h-full"
            >
              <div className="flex flex-col items-center lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 h-full">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-zuri-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 lg:w-6 lg:h-6 text-zuri-dark" />
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h3 className="text-zuri-gold font-medium text-xs lg:text-lg">Clients</h3>
                  <p className="text-zuri-light text-xs lg:text-sm">Manage clients</p>
                </div>
              </div>
            </motion.div>
          </Link>

          <Link href="/admin/settings" className="block">
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zuri-gray p-3 lg:p-6 rounded-xl border border-zuri-dark hover:border-zuri-gold transition-colors duration-300 cursor-pointer h-full"
            >
              <div className="flex flex-col items-center lg:flex-row lg:items-center space-y-2 lg:space-y-0 lg:space-x-4 h-full">
                <div className="w-8 h-8 lg:w-12 lg:h-12 bg-zuri-gold rounded-lg flex items-center justify-center flex-shrink-0">
                  <Settings className="w-4 h-4 lg:w-6 lg:h-6 text-zuri-dark" />
                </div>
                <div className="text-center lg:text-left flex-1">
                  <h3 className="text-zuri-gold font-medium text-xs lg:text-lg">Settings</h3>
                  <p className="text-zuri-light text-xs lg:text-sm">Preferences</p>
                </div>
              </div>
            </motion.div>
          </Link>
        </motion.div>

        {/* Today's Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-zuri-gray p-4 lg:p-6 rounded-xl border border-zuri-dark mb-6 lg:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-serif text-zuri-gold mb-2 sm:mb-0">Today's Appointments</h2>
            <span className="text-zuri-light text-sm">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </span>
          </div>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-zuri-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : getTodayAppointments().length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-zuri-light mx-auto mb-4" />
              <p className="text-zuri-light mb-4">No appointments scheduled for today</p>
              <p className="text-zuri-light text-sm">You're all caught up!</p>
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {getTodayAppointments().map((appointment) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zuri-dark p-3 lg:p-4 rounded-lg border border-zuri-gray"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3 lg:space-x-4 flex-1 min-w-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-zuri-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4 lg:w-5 lg:h-5 text-zuri-dark" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-zuri-gold font-medium text-sm lg:text-base break-words">
                          {appointment.client.name}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs lg:text-sm text-zuri-light mt-1">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                            {formatTime(appointment.time)} ({appointment.duration}min)
                          </span>
                          <span className="text-zuri-gold font-medium">
                            CHF {appointment.prestations.reduce((sum, p) => sum + p.prestation.price, 0)}
                          </span>
                        </div>
                        <div className="text-xs text-zuri-light mt-1 break-words">
                          {appointment.prestations.map(p => p.prestation.title).join(', ')}
                        </div>
                        {appointment.client.phone && (
                          <div className="text-xs text-zuri-light mt-1 break-all">
                            📞 {appointment.client.phone}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 flex-shrink-0">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                        appointment.status === 'CONFIRMED' 
                          ? 'bg-green-500/20 text-green-400'
                          : appointment.status === 'PENDING'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {appointment.status}
                      </span>
                      <button className="text-zuri-gold hover:text-white transition-colors duration-300 p-1">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-zuri-gray p-4 lg:p-6 rounded-xl border border-zuri-dark mb-6 lg:mb-8"
        >
          <h2 className="text-xl lg:text-2xl font-serif text-zuri-gold mb-4 lg:mb-6">Upcoming Appointments</h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-6 h-6 border-2 border-zuri-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : getUpcomingAppointments().length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-zuri-light mx-auto mb-4" />
              <p className="text-zuri-light mb-4">No upcoming appointments</p>
              <p className="text-zuri-light text-sm">Check back later for new bookings</p>
            </div>
          ) : (
            <div className="space-y-3 lg:space-y-4">
              {getUpcomingAppointments().map((appointment) => (
                <motion.div
                  key={appointment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="bg-zuri-dark p-3 lg:p-4 rounded-lg border border-zuri-gray"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                    <div className="flex items-start space-x-3 lg:space-x-4 flex-1 min-w-0">
                      <div className="w-8 h-8 lg:w-10 lg:h-10 bg-zuri-gold rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <User className="w-4 h-4 lg:w-5 lg:h-5 text-zuri-dark" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-zuri-gold font-medium text-sm lg:text-base break-words">
                          {appointment.client.name}
                        </h4>
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4 text-xs lg:text-sm text-zuri-light mt-1">
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                            {new Date(appointment.date).toLocaleDateString('en-US', {
                              weekday: 'short',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 lg:w-4 lg:h-4 mr-1 flex-shrink-0" />
                            {formatTime(appointment.time)}
                          </span>
                        </div>
                        <div className="text-xs text-zuri-light mt-1 break-words">
                          {appointment.prestations.map(p => p.prestation.title).join(', ')}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0">
                      <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
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

        {/* Employee Info - Mobile Optimized */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-zuri-gray p-4 lg:p-6 rounded-xl border border-zuri-dark"
        >
          <h2 className="text-xl lg:text-2xl font-serif text-zuri-gold mb-4 lg:mb-6">Employee Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
            <div>
              <label className="block text-zuri-light text-xs lg:text-sm font-medium mb-1 lg:mb-2">Name</label>
              <p className="text-zuri-gold text-sm lg:text-base">{employee?.name}</p>
            </div>
            <div>
              <label className="block text-zuri-light text-xs lg:text-sm font-medium mb-1 lg:mb-2">Email</label>
              <p className="text-zuri-gold text-sm lg:text-base break-all">{employee?.email}</p>
            </div>
            <div>
              <label className="block text-zuri-light text-xs lg:text-sm font-medium mb-1 lg:mb-2">Role</label>
              <p className="text-zuri-gold text-sm lg:text-base">Employee</p>
            </div>
            <div>
              <label className="block text-zuri-light text-xs lg:text-sm font-medium mb-1 lg:mb-2">Status</label>
              <p className="text-zuri-gold text-sm lg:text-base">Active</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
} 