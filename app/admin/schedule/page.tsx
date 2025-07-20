'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Clock, Save, Plus, X, Edit, Check, ArrowLeft, Trash2 } from 'lucide-react'
import { useEmployeeAuth } from '@/contexts/EmployeeAuthContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface TimeSlot {
  id?: string
  startTime: string
  endTime: string
}

interface Availability {
  id: string
  weekday: number
  isActive: boolean
  timeSlots: TimeSlot[]
}

interface DayConfig {
  name: string
  value: number
  shortName: string
}

const DAYS: DayConfig[] = [
  { name: 'Monday', value: 1, shortName: 'Mon' },
  { name: 'Tuesday', value: 2, shortName: 'Tue' },
  { name: 'Wednesday', value: 3, shortName: 'Wed' },
  { name: 'Thursday', value: 4, shortName: 'Thu' },
  { name: 'Friday', value: 5, shortName: 'Fri' },
  { name: 'Saturday', value: 6, shortName: 'Sat' },
  { name: 'Sunday', value: 0, shortName: 'Sun' }
]

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30'
]

export default function ScheduleManagementPage() {
  const { employee } = useEmployeeAuth()
  const router = useRouter()
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingDay, setEditingDay] = useState<number | null>(null)
  const [tempAvailability, setTempAvailability] = useState<{
    isActive: boolean
    timeSlots: TimeSlot[]
  }>({
    isActive: true,
    timeSlots: [
      { startTime: '09:00', endTime: '12:00' },
      { startTime: '13:00', endTime: '17:00' }
    ]
  })

  const checkForOverlaps = (timeSlots: TimeSlot[]): boolean => {
    // Sort time slots by start time
    const sortedSlots = [...timeSlots].sort((a, b) => a.startTime.localeCompare(b.startTime))
    
    for (let i = 0; i < sortedSlots.length - 1; i++) {
      const currentSlot = sortedSlots[i]
      const nextSlot = sortedSlots[i + 1]
      
      // Check if current slot's end time overlaps with next slot's start time
      if (currentSlot.endTime > nextSlot.startTime) {
        return true // Overlap found
      }
    }
    
    return false // No overlaps
  }

  // Check for overlaps in real-time
  const hasOverlaps = checkForOverlaps(tempAvailability.timeSlots)

  useEffect(() => {
    if (!employee) {
      router.push('/admin')
      return
    }

    fetchAvailabilities()
  }, [employee, router])

  const fetchAvailabilities = async () => {
    try {
      const response = await fetch(`/api/availability/employee?employeeId=${employee?.id}`)
      if (response.ok) {
        const data = await response.json()
        setAvailabilities(data)
      }
    } catch (error) {
      console.error('Error fetching availabilities:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteAvailability = async (availabilityId: string) => {
    try {
      const response = await fetch(`/api/availability/${availabilityId}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        await fetchAvailabilities()
      }
    } catch (error) {
      console.error('Error deleting availability:', error)
    }
  }

  const getAvailabilityForDay = (weekday: number) => {
    return availabilities.find(av => av.weekday === weekday)
  }

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const getTimeRanges = (timeSlots: TimeSlot[]) => {
    return timeSlots.map(slot => 
      `${formatTime(slot.startTime)} - ${formatTime(slot.endTime)}`
    ).join(', ')
  }

  const addTimeSlot = () => {
    setTempAvailability(prev => ({
      ...prev,
      timeSlots: [...prev.timeSlots, { startTime: '09:00', endTime: '12:00' }]
    }))
  }

  const removeTimeSlot = (index: number) => {
    setTempAvailability(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.filter((_, i) => i !== index)
    }))
  }

  const updateTimeSlot = (index: number, field: 'startTime' | 'endTime', value: string) => {
    setTempAvailability(prev => ({
      ...prev,
      timeSlots: prev.timeSlots.map((slot, i) => 
        i === index ? { ...slot, [field]: value } : slot
      )
    }))
  }

  const handleSaveAvailability = async (weekday: number) => {
    // Check for overlaps before saving
    if (checkForOverlaps(tempAvailability.timeSlots)) {
      alert('Error: Time slots cannot overlap. Please adjust your schedule.')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeId: employee?.id,
          weekday,
          timeSlots: tempAvailability.timeSlots,
          isActive: tempAvailability.isActive
        }),
      })

      if (response.ok) {
        await fetchAvailabilities()
        setEditingDay(null)
        setTempAvailability({
          isActive: true,
          timeSlots: [
            { startTime: '09:00', endTime: '12:00' },
            { startTime: '13:00', endTime: '17:00' }
          ]
        })
      }
    } catch (error) {
      console.error('Error saving availability:', error)
    } finally {
      setSaving(false)
    }
  }

  if (!employee) {
    return null
  }

  return (
    <div className="min-h-screen bg-zuri-dark">
      <Navbar />
      
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/dashboard"
              className="flex items-center text-zuri-gold hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Dashboard
            </Link>
            <div>
              <h1 className="text-3xl font-serif text-zuri-gold">Manage Schedule</h1>
              <p className="text-zuri-light">Set your weekly availability with multiple time slots</p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-2 border-zuri-gold border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Weekly Schedule */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-zuri-gray p-6 rounded-xl border border-zuri-dark"
            >
              <h2 className="text-2xl font-serif text-zuri-gold mb-6">Weekly Schedule</h2>
              
              <div className="space-y-4">
                {DAYS.map((day) => {
                  const availability = getAvailabilityForDay(day.value)
                  const isEditing = editingDay === day.value
                  
                  return (
                    <motion.div
                      key={day.value}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                        availability?.isActive
                          ? 'border-zuri-gold bg-zuri-gold/10'
                          : availability
                          ? 'border-zuri-gray bg-zuri-dark'
                          : 'border-zuri-dark bg-zuri-dark'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                            availability?.isActive
                              ? 'bg-zuri-gold text-zuri-dark'
                              : 'bg-zuri-dark text-zuri-light'
                          }`}>
                            <Calendar className="w-6 h-6" />
                          </div>
                          <div>
                            <h3 className={`font-medium ${
                              availability?.isActive ? 'text-zuri-gold' : 'text-zuri-light'
                            }`}>
                              {day.name}
                            </h3>
                            {availability ? (
                              <div className="flex items-center space-x-2 text-sm">
                                <Clock className="w-4 h-4 text-zuri-light" />
                                <span className="text-zuri-light">
                                  {availability.isActive 
                                    ? getTimeRanges(availability.timeSlots)
                                    : 'Not available'
                                  }
                                </span>
                              </div>
                            ) : (
                              <span className="text-sm text-zuri-light">No schedule set</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
                          {isEditing ? (
                            <>
                              <button
                                onClick={() => handleSaveAvailability(day.value)}
                                disabled={saving || hasOverlaps}
                                className={`flex items-center px-3 py-2 rounded-lg transition-colors duration-300 w-full sm:w-auto justify-center ${
                                  hasOverlaps 
                                    ? 'bg-red-500 text-white cursor-not-allowed opacity-50'
                                    : 'bg-green-500 text-white hover:bg-green-600'
                                }`}
                              >
                                {saving ? (
                                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                ) : hasOverlaps ? (
                                  <X className="w-4 h-4 mr-2" />
                                ) : (
                                  <Check className="w-4 h-4 mr-2" />
                                )}
                                {hasOverlaps ? 'Overlapping Times' : 'Save'}
                              </button>
                              <button
                                onClick={() => {
                                  setEditingDay(null)
                                  setTempAvailability({
                                    isActive: true,
                                    timeSlots: [
                                      { startTime: '09:00', endTime: '12:00' },
                                      { startTime: '13:00', endTime: '17:00' }
                                    ]
                                  })
                                }}
                                className="flex items-center px-3 py-2 bg-zuri-dark text-zuri-light rounded-lg hover:bg-zuri-gray transition-colors duration-300 w-full sm:w-auto justify-center"
                              >
                                <X className="w-4 h-4 mr-2" />
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => {
                                  setEditingDay(day.value)
                                  if (availability) {
                                    setTempAvailability({
                                      isActive: availability.isActive,
                                      timeSlots: availability.timeSlots
                                    })
                                  }
                                }}
                                className="flex items-center px-3 py-2 bg-zuri-gold text-zuri-dark rounded-lg hover:bg-white transition-colors duration-300 w-full sm:w-auto justify-center"
                              >
                                <Edit className="w-4 h-4 mr-2" />
                                {availability ? 'Edit' : 'Set'}
                              </button>
                              {availability && (
                                <button
                                  onClick={() => handleDeleteAvailability(availability.id)}
                                  className="flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300 w-full sm:w-auto justify-center"
                                >
                                  <X className="w-4 h-4 mr-2" />
                                  Remove
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Editing Form */}
                      {isEditing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 p-4 bg-zuri-dark rounded-lg"
                        >
                          <div className="space-y-4">
                            {/* Status */}
                            <div>
                              <label className="block text-zuri-light text-sm font-medium mb-2">
                                Status
                              </label>
                              <select
                                value={tempAvailability.isActive ? 'active' : 'inactive'}
                                onChange={(e) => setTempAvailability({
                                  ...tempAvailability,
                                  isActive: e.target.value === 'active'
                                })}
                                className="w-full px-3 py-2 bg-zuri-gray border border-zuri-dark text-zuri-light rounded-lg focus:outline-none focus:border-zuri-gold"
                              >
                                <option value="active">Available</option>
                                <option value="inactive">Not Available</option>
                              </select>
                            </div>

                            {/* Time Slots */}
                            <div>
                              <div className="flex items-center justify-between mb-3">
                                <label className="block text-zuri-light text-sm font-medium">
                                  Time Slots
                                </label>
                                <button
                                  onClick={addTimeSlot}
                                  className="flex items-center px-2 py-1 bg-zuri-gold text-zuri-dark rounded text-sm hover:bg-white transition-colors duration-300"
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Add Slot
                                </button>
                              </div>
                              
                              <div className="space-y-3">
                                {tempAvailability.timeSlots.map((slot, index) => {
                                  // Check if this slot overlaps with others
                                  const slotOverlaps = tempAvailability.timeSlots.some((otherSlot, otherIndex) => {
                                    if (index === otherIndex) return false
                                    return slot.startTime < otherSlot.endTime && slot.endTime > otherSlot.startTime
                                  })
                                  
                                  return (
                                    <div key={index} className={`flex items-center space-x-3 p-3 rounded-lg ${
                                      slotOverlaps ? 'bg-red-500/10 border border-red-500/30' : 'bg-zuri-gray'
                                    }`}>
                                      <div className="flex-1">
                                        <label className="block text-zuri-light text-xs mb-1">Start</label>
                                        <select
                                          value={slot.startTime}
                                          onChange={(e) => updateTimeSlot(index, 'startTime', e.target.value)}
                                          className={`w-full px-2 py-1 border text-zuri-light rounded text-sm focus:outline-none ${
                                            slotOverlaps 
                                              ? 'bg-red-500/20 border-red-500/50 focus:border-red-500' 
                                              : 'bg-zuri-dark border-zuri-gray focus:border-zuri-gold'
                                          }`}
                                        >
                                          {TIME_SLOTS.map((time) => (
                                            <option key={time} value={time}>
                                              {formatTime(time)}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      
                                      <div className="flex-1">
                                        <label className="block text-zuri-light text-xs mb-1">End</label>
                                        <select
                                          value={slot.endTime}
                                          onChange={(e) => updateTimeSlot(index, 'endTime', e.target.value)}
                                          className={`w-full px-2 py-1 border text-zuri-light rounded text-sm focus:outline-none ${
                                            slotOverlaps 
                                              ? 'bg-red-500/20 border-red-500/50 focus:border-red-500' 
                                              : 'bg-zuri-dark border-zuri-gray focus:border-zuri-gold'
                                          }`}
                                        >
                                          {TIME_SLOTS.map((time) => (
                                            <option key={time} value={time}>
                                              {formatTime(time)}
                                            </option>
                                          ))}
                                        </select>
                                      </div>
                                      
                                      {tempAvailability.timeSlots.length > 1 && (
                                        <button
                                          onClick={() => removeTimeSlot(index)}
                                          className="flex items-center justify-center w-8 h-8 bg-red-500 text-white rounded hover:bg-red-600 transition-colors duration-300"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </button>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                              
                              {hasOverlaps && (
                                <div className="mt-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
                                  <p className="text-red-400 text-sm">
                                    ⚠️ Time slots cannot overlap. Please adjust your schedule to have gaps between time slots.
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>

            {/* Quick Actions & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-6"
            >
              {/* Quick Actions */}
              <div className="bg-zuri-gray p-6 rounded-xl border border-zuri-dark">
                <h3 className="text-xl font-serif text-zuri-gold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      // Set standard hours for all weekdays
                      DAYS.slice(0, 5).forEach((day) => {
                        if (!getAvailabilityForDay(day.value)) {
                          setEditingDay(day.value)
                          setTempAvailability({
                            isActive: true,
                            timeSlots: [
                              { startTime: '09:00', endTime: '12:00' },
                              { startTime: '13:00', endTime: '17:00' }
                            ]
                          })
                          handleSaveAvailability(day.value)
                        }
                      })
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-zuri-gold text-zuri-dark rounded-lg hover:bg-white transition-colors duration-300"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Set Standard Week (Mon-Fri, 9AM-12PM & 1PM-5PM)
                  </button>
                  
                  <button
                    onClick={() => {
                      // Clear all availabilities
                      availabilities.forEach((av) => {
                        handleDeleteAvailability(av.id)
                      })
                    }}
                    className="w-full flex items-center justify-center px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-300"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear All Schedules
                  </button>
                </div>
              </div>

              {/* Schedule Info */}
              <div className="bg-zuri-gray p-6 rounded-xl border border-zuri-dark">
                <h3 className="text-xl font-serif text-zuri-gold mb-4">Schedule Information</h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="text-zuri-gold font-medium mb-2">How it works:</h4>
                    <ul className="space-y-2 text-zuri-light">
                      <li>• Set multiple time slots for each day (e.g., 8AM-12PM, 2PM-6PM)</li>
                      <li>• Clients can only book during your available time slots</li>
                      <li>• Add or remove time slots as needed</li>
                      <li>• Mark days as "Not Available" to block bookings</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="text-zuri-gold font-medium mb-2">Current Status:</h4>
                    <div className="text-zuri-light">
                      <p>Active days: {availabilities.filter(av => av.isActive).length}/7</p>
                      <p>Total schedules: {availabilities.length}/7</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  )
} 