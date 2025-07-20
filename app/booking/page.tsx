'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Check, Clock, User, Calendar, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'

interface Prestation {
  id: string
  title: string
  category: string
  duration: string
  price: number
}

interface Employee {
  id: string
  name: string
  role: string
}

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPrestations, setSelectedPrestations] = useState<string[]>([])
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [bookingData, setBookingData] = useState({
    name: '',
    phone: '',
    email: '',
    notes: ''
  })
  const [scheduleStep, setScheduleStep] = useState<'date' | 'time'>('date')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Data from database
  const [prestations, setPrestations] = useState<Prestation[]>([])
  const [employees, setEmployees] = useState<Employee[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([])
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false)

  // Fetch data from database
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch prestations
        const prestationsResponse = await fetch('/api/prestations')
        if (prestationsResponse.ok) {
          const prestationsData = await prestationsResponse.json()
          setPrestations(prestationsData)
          // Get unique categories in the order they appear in the data
          const uniqueCategories = prestationsData.reduce((acc: string[], prestation: Prestation) => {
            if (!acc.includes(prestation.category)) {
              acc.push(prestation.category)
            }
            return acc
          }, [])
          setCategories(uniqueCategories)
          setSelectedCategory(uniqueCategories[0] || '')
        }

        // Fetch employees
        const employeesResponse = await fetch('/api/employees')
        if (employeesResponse.ok) {
          const employeesData = await employeesResponse.json()
          setEmployees(employeesData)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  // Fetch available time slots when employee or date changes
  useEffect(() => {
    if (selectedEmployee && selectedDate) {
      fetchAvailableTimeSlots()
    } else {
      setAvailableTimeSlots([])
    }
  }, [selectedEmployee, selectedDate])

  const fetchAvailableTimeSlots = async () => {
    if (!selectedEmployee || !selectedDate) return

    setLoadingTimeSlots(true)
    try {
      const response = await fetch(`/api/availability/timeslots?employeeId=${selectedEmployee}&date=${selectedDate}`)
      if (response.ok) {
        const data = await response.json()
        if (data.available) {
          setAvailableTimeSlots(data.timeSlots)
        } else {
          setAvailableTimeSlots([])
        }
      } else {
        setAvailableTimeSlots([])
      }
    } catch (error) {
      console.error('Error fetching available time slots:', error)
      setAvailableTimeSlots([])
    } finally {
      setLoadingTimeSlots(false)
    }
  }

  const selectedPrestationsData = prestations.filter(item => selectedPrestations.includes(item.id))

  // Helper function to parse duration strings
  const parseDuration = (duration: string): number => {
    // Handle ranges like "30-45min"
    if (duration.includes('-')) {
      const [minDuration, maxDuration] = duration.split('-')
      const minMinutes = parseSingleDuration(minDuration)
      // Always use the minimum time to ensure appointment fits
      return minMinutes
    }
    return parseSingleDuration(duration)
  }

  const parseSingleDuration = (duration: string): number => {
    const trimmed = duration.trim()
    let totalMinutes = 0
    
    // Handle hours and minutes like "1h30min" or "1h 30min"
    if (trimmed.includes('h')) {
      const parts = trimmed.split('h')
      const hours = parseInt(parts[0]) || 0
      totalMinutes += hours * 60
      
      // Check if there are minutes after hours
      if (parts[1] && parts[1].includes('min')) {
        const minutes = parseInt(parts[1].split('min')[0]) || 0
        totalMinutes += minutes
      }
    } else if (trimmed.includes('min')) {
      // Handle minutes only like "45min" or "30"
      const minutesStr = trimmed.split('min')[0]
      totalMinutes = parseInt(minutesStr) || 0
    } else {
      // Handle plain numbers like "30"
      totalMinutes = parseInt(trimmed) || 0
    }
    
    return totalMinutes
  }

  const totalPrice = selectedPrestationsData.reduce((sum, item) => sum + item.price, 0)
  const totalDuration = selectedPrestationsData.reduce((sum, item) => {
    const itemDuration = parseDuration(item.duration)
    return sum + itemDuration
  }, 0)

  const handlePrestationToggle = (prestationId: string) => {
    setSelectedPrestations(prev => 
      prev.includes(prestationId) 
        ? prev.filter(id => id !== prestationId)
        : [...prev, prestationId]
    )
  }

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1)
      // Reset schedule step to date selection when going to step 3
      if (currentStep + 1 === 3) {
        setScheduleStep('date')
      }
    }
  }

  const prevStep = () => {
    if (currentStep === 3 && scheduleStep === 'time') {
      // If we're in time selection, go back to date selection
      setScheduleStep('date')
    } else if (currentStep > 1) {
      // Otherwise go to previous step
      setCurrentStep(currentStep - 1)
      // Reset schedule step to date selection when going back to step 3
      if (currentStep - 1 === 3) {
        setScheduleStep('date')
      }
    }
  }

  const handleDateSelect = (date: string) => {
    if (!selectedEmployee) {
      alert('Please select an employee first')
      return
    }
    setSelectedDate(date)
    setScheduleStep('time')
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientName: bookingData.name,
          clientEmail: bookingData.email,
          clientPhone: bookingData.phone,
          employeeId: selectedEmployee,
          date: selectedDate,
          time: selectedTime,
          duration: totalDuration,
          prestationIds: selectedPrestations,
          notes: bookingData.notes
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.error || 'Failed to create appointment')
      } else {
        setSuccess(true)
        // Reset form after successful booking
        setTimeout(() => {
          setCurrentStep(1)
          setSelectedPrestations([])
          setSelectedEmployee(null)
          setSelectedDate('')
          setSelectedTime('')
          setScheduleStep('date')
          setBookingData({ name: '', phone: '', email: '', notes: '' })
          setSuccess(false)
        }, 3000)
      }
    } catch (error) {
      setError('An error occurred while creating the appointment')
    }
    
    setLoading(false)
  }

  const steps = [
    { number: 1, title: "Services", icon: Check },
    { number: 2, title: "Employee", icon: User },
    { number: 3, title: "Schedule", icon: Calendar },
    { number: 4, title: "Confirm", icon: CreditCard }
  ]

  // Generate available dates (next 30 days)
  const generateAvailableDates = () => {
    const dates = []
    const today = new Date()
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      // Skip Sundays (day 0)
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0])
      }
    }
    return dates
  }

  // Generate all possible time slots (9:00-18:00 in 30-minute intervals)
  const generateAllTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        if (hour === 18 && minute === 30) break // Stop at 18:30
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
        slots.push(time)
      }
    }
    return slots
  }

  const availableDates = generateAvailableDates()
  const allTimeSlots = generateAllTimeSlots()

  if (success) {
    return (
      <div className="min-h-screen bg-zuri-dark flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-zuri-gray p-8 rounded-xl border border-zuri-dark text-center max-w-md"
        >
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-serif text-zuri-gold mb-4">Booking Confirmed!</h2>
          <p className="text-zuri-light mb-6">
            Your appointment has been successfully booked. You will receive a confirmation shortly.
          </p>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-zuri-gold text-zuri-dark rounded-lg hover:bg-white transition-colors duration-300"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zuri-dark">
      <Navbar />
      
      {/* Header */}
      <div className="bg-zuri-gray border-b border-zuri-dark">
        <div className="container-custom py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center text-zuri-gold hover:text-white transition-colors duration-300">
              <ChevronLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-serif text-zuri-gold">Book Appointment</h1>
            <div className="text-zuri-light">
              Step {currentStep} of 4
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-8 pb-32 lg:pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Progress Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-zuri-gray p-6 rounded-xl sticky top-8">
              <h3 className="text-xl font-serif text-zuri-gold mb-6">Booking Progress</h3>
              <div className="space-y-4">
                {steps.map((step, index) => (
                  <motion.div
                    key={step.number}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'bg-zuri-gold text-zuri-dark'
                        : 'bg-zuri-dark text-zuri-light'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                      currentStep > step.number
                        ? 'bg-green-500 text-white'
                        : currentStep === step.number
                        ? 'bg-zuri-dark text-zuri-gold'
                        : 'bg-zuri-gray text-zuri-light'
                    }`}>
                      {currentStep > step.number ? <Check className="w-4 h-4" /> : step.number}
                    </div>
                    <span className="font-medium">{step.title}</span>
                  </motion.div>
                ))}
              </div>

              {/* Summary */}
              {selectedPrestations.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-zuri-dark rounded-lg"
                >
                  <h4 className="text-zuri-gold font-medium mb-2">Selected Services</h4>
                  <div className="space-y-2">
                    {selectedPrestationsData.slice(0, 3).map(item => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-zuri-light truncate">{item.title}</span>
                        <span className="text-zuri-gold">CHF {item.price}</span>
                      </div>
                    ))}
                    {selectedPrestationsData.length > 3 && (
                      <div className="text-sm text-zuri-light">
                        +{selectedPrestationsData.length - 3} more
                      </div>
                    )}
                  </div>
                  <div className="border-t border-zuri-gray mt-3 pt-3">
                    <div className="flex justify-between font-medium">
                      <span className="text-zuri-light">Total:</span>
                      <span className="text-zuri-gold">CHF {totalPrice}</span>
                    </div>
                    <div className="flex items-center text-sm text-zuri-light mt-1">
                      <Clock className="w-4 h-4 mr-1" />
                      {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zuri-gray p-8 rounded-xl"
                >
                  <h2 className="text-3xl font-serif text-zuri-gold mb-8">Select Services</h2>
                  
                  {/* Category Filter */}
                  <div className="mb-8">
                    <div className="flex flex-wrap gap-2">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                          className={`px-4 py-2 rounded-lg transition-all duration-300 ${
                            selectedCategory === category
                              ? 'bg-zuri-gold text-zuri-dark'
                              : 'bg-zuri-dark text-zuri-light hover:bg-zuri-dark/80'
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Services Grid */}
                  <div className="space-y-4">
                    {prestations
                      .filter(item => item.category === selectedCategory)
                      .map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          onClick={() => handlePrestationToggle(item.id)}
                          className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                            selectedPrestations.includes(item.id)
                              ? 'border-zuri-gold bg-zuri-gold/10'
                              : 'border-zuri-dark hover:border-zuri-gray'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="text-zuri-gold font-medium">{item.title}</h4>
                              <div className="flex items-center space-x-4 mt-2 text-sm text-zuri-light">
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {item.duration}
                                </span>
                                <span className="text-zuri-gold font-medium">CHF {item.price}</span>
                              </div>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              selectedPrestations.includes(item.id)
                                ? 'border-zuri-gold bg-zuri-gold'
                                : 'border-zuri-light'
                            }`}>
                              {selectedPrestations.includes(item.id) && (
                                <Check className="w-4 h-4 text-zuri-dark" />
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zuri-gray p-8 rounded-xl"
                >
                  <h2 className="text-3xl font-serif text-zuri-gold mb-8">Choose Your Specialist</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {employees.map((employee) => (
                      <motion.div
                        key={employee.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        onClick={() => setSelectedEmployee(employee.id)}
                        className={`p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                          selectedEmployee === employee.id
                            ? 'border-zuri-gold bg-zuri-gold/10'
                            : 'border-zuri-dark hover:border-zuri-gray'
                        }`}
                      >
                        <div className="text-center">
                          <div className="w-16 h-16 bg-zuri-dark rounded-full flex items-center justify-center mx-auto mb-4">
                            <User className="w-8 h-8 text-zuri-gold" />
                          </div>
                          <h3 className="text-zuri-gold font-medium text-lg mb-2">{employee.name}</h3>
                          <p className="text-zuri-light text-sm">{employee.role}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zuri-gray p-8 rounded-xl"
                >
                  <h2 className="text-3xl font-serif text-zuri-gold mb-8">Schedule Your Appointment</h2>
                  
                  <AnimatePresence mode="wait">
                    {scheduleStep === 'date' && (
                      <motion.div
                        key="date"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-xl font-medium text-zuri-light mb-4">Select Date</h3>
                          {!selectedEmployee ? (
                            <div className="text-center py-8 text-zuri-light">
                              Please select an employee first to see available dates.
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                              {availableDates.map((date, index) => (
                                <motion.button
                                  key={date}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => handleDateSelect(date)}
                                  className={`p-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                                    selectedDate === date
                                      ? 'bg-zuri-gold text-zuri-dark shadow-lg'
                                      : 'bg-zuri-dark text-zuri-light hover:bg-zuri-dark/80 border border-zuri-gray'
                                  }`}
                                >
                                  {new Date(date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    weekday: 'short'
                                  })}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {scheduleStep === 'time' && selectedDate && (
                      <motion.div
                        key="time"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="space-y-6"
                      >
                        <div>
                          <h3 className="text-xl font-medium text-zuri-light mb-4">Select Time</h3>
                          {loadingTimeSlots ? (
                            <div className="text-center py-8">
                              <div className="w-8 h-8 border-2 border-zuri-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                              <p className="text-zuri-light">Loading available time slots...</p>
                            </div>
                          ) : availableTimeSlots.length === 0 ? (
                            <div className="text-center py-8">
                              <p className="text-zuri-light mb-2">No available time slots for this date.</p>
                              <p className="text-sm text-zuri-light">The employee may not be working on this day or all slots are booked.</p>
                            </div>
                          ) : (
                            <div className="grid grid-cols-2 gap-3">
                              {allTimeSlots.map((time, index) => (
                                <motion.button
                                  key={time}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  onClick={() => availableTimeSlots.includes(time) && handleTimeSelect(time)}
                                  className={`p-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                                    selectedTime === time
                                      ? 'bg-zuri-gold text-zuri-dark shadow-lg'
                                      : availableTimeSlots.includes(time)
                                      ? 'bg-zuri-dark text-zuri-light hover:bg-zuri-dark/80 border border-zuri-gray'
                                      : 'bg-zuri-gray/30 text-zuri-light/50 border border-zuri-gray/30 cursor-not-allowed line-through'
                                  }`}
                                  disabled={!availableTimeSlots.includes(time)}
                                >
                                  {time}
                                </motion.button>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div
                  key="step4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-zuri-gray p-8 rounded-xl"
                >
                  <h2 className="text-3xl font-serif text-zuri-gold mb-8">Confirm Booking</h2>
                  
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg mb-6"
                    >
                      {error}
                    </motion.div>
                  )}
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Booking Summary */}
                    <div>
                      <h3 className="text-xl font-medium text-zuri-light mb-4">Booking Summary</h3>
                      <div className="bg-zuri-dark p-6 rounded-lg space-y-4">
                        <div>
                          <h4 className="text-zuri-gold font-medium mb-2">Selected Services</h4>
                          <div className="space-y-2">
                            {selectedPrestationsData.map((item) => (
                              <div key={item.id} className="flex justify-between text-sm">
                                <span className="text-zuri-light">{item.title}</span>
                                <span className="text-zuri-gold">CHF {item.price}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                        
                        <div className="border-t border-zuri-gray pt-4">
                          <div className="flex justify-between font-medium">
                            <span className="text-zuri-light">Total:</span>
                            <span className="text-zuri-gold">CHF {totalPrice}</span>
                          </div>
                          <div className="flex items-center text-sm text-zuri-light mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {Math.floor(totalDuration / 60)}h {totalDuration % 60}min
                          </div>
                        </div>

                        {selectedEmployee && (
                          <div className="border-t border-zuri-gray pt-4">
                            <h4 className="text-zuri-gold font-medium mb-2">Specialist</h4>
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-zuri-dark rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-zuri-gold" />
                              </div>
                              <div>
                                <div className="text-zuri-light font-medium">
                                  {employees.find(e => e.id === selectedEmployee)?.name}
                                </div>
                                <div className="text-sm text-zuri-light">
                                  {employees.find(e => e.id === selectedEmployee)?.role}
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {selectedDate && selectedTime && (
                          <div className="border-t border-zuri-gray pt-4">
                            <h4 className="text-zuri-gold font-medium mb-2">Appointment</h4>
                            <div className="text-zuri-light">
                              {new Date(selectedDate).toLocaleDateString('en-US', { 
                                weekday: 'long', 
                                year: 'numeric', 
                                month: 'long', 
                                day: 'numeric' 
                              })}
                              <br />
                              {selectedTime}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Contact Form */}
                    <div>
                      <h3 className="text-xl font-medium text-zuri-light mb-4">Your Information</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-zuri-light text-sm font-medium mb-2">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            value={bookingData.name}
                            onChange={(e) => setBookingData({ ...bookingData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-zuri-dark border border-zuri-gray text-zuri-light rounded-lg focus:outline-none focus:border-zuri-gold"
                            placeholder="Enter your full name"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-zuri-light text-sm font-medium mb-2">
                            Phone Number *
                          </label>
                          <input
                            type="tel"
                            value={bookingData.phone}
                            onChange={(e) => setBookingData({ ...bookingData, phone: e.target.value })}
                            className="w-full px-4 py-3 bg-zuri-dark border border-zuri-gray text-zuri-light rounded-lg focus:outline-none focus:border-zuri-gold"
                            placeholder="Enter your phone number"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-zuri-light text-sm font-medium mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={bookingData.email}
                            onChange={(e) => setBookingData({ ...bookingData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-zuri-dark border border-zuri-gray text-zuri-light rounded-lg focus:outline-none focus:border-zuri-gold"
                            placeholder="Enter your email (optional)"
                          />
                        </div>

                        <div>
                          <label className="block text-zuri-light text-sm font-medium mb-2">
                            Special Requests
                          </label>
                          <textarea
                            value={bookingData.notes}
                            onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                            className="w-full px-4 py-3 bg-zuri-dark border border-zuri-gray text-zuri-light rounded-lg focus:outline-none focus:border-zuri-gold"
                            placeholder="Any special requests or notes"
                            rows={3}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile Navigation */}
            <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-zuri-dark border-t border-zuri-gray p-4">
              <div className="flex justify-between items-center">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 1}
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                    currentStep === 1
                      ? 'bg-zuri-gray text-zuri-light cursor-not-allowed'
                      : 'bg-zuri-dark text-zuri-gold hover:bg-zuri-gold hover:text-zuri-dark'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4 mr-2" />
                  Previous
                </button>

                <button
                  onClick={currentStep === 4 ? handleSubmit : nextStep}
                  disabled={
                    (currentStep === 1 && selectedPrestations.length === 0) ||
                    (currentStep === 2 && !selectedEmployee) ||
                    (currentStep === 3 && (!selectedDate || !selectedTime)) ||
                    (currentStep === 4 && (!bookingData.name || !bookingData.phone)) ||
                    loading
                  }
                  className={`flex items-center px-4 py-2 rounded-lg transition-all duration-300 ${
                    (currentStep === 1 && selectedPrestations.length === 0) ||
                    (currentStep === 2 && !selectedEmployee) ||
                    (currentStep === 3 && (!selectedDate || !selectedTime)) ||
                    (currentStep === 4 && (!bookingData.name || !bookingData.phone)) ||
                    loading
                      ? 'bg-zuri-gray text-zuri-light cursor-not-allowed'
                      : 'bg-zuri-gold text-zuri-dark hover:bg-white'
                  }`}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-zuri-dark border-t-transparent rounded-full animate-spin mr-2" />
                  ) : null}
                  {currentStep === 4 ? 'Confirm Booking' : 'Next'}
                  {currentStep !== 4 && <ChevronRight className="w-4 h-4 ml-2" />}
                  {currentStep === 4 && <ArrowRight className="w-4 h-4 ml-2" />}
                </button>
              </div>
            </div>

            {/* Desktop Navigation - floating gold bar always visible */}
            <div className="hidden lg:block">
              <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none pb-8">
                <div className="container-custom">
                  <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1"></div>
                    <div className="lg:col-span-3 flex justify-center">
                      <div className="bg-zuri-dark rounded-full shadow-2xl flex justify-between items-center px-8 py-3 w-full max-w-4xl pointer-events-auto border-4 border-zuri-gray/60">
                        <button
                          onClick={prevStep}
                          disabled={currentStep === 1}
                          className={`flex items-center px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-md mr-4 ${
                            currentStep === 1
                              ? 'bg-zuri-gold/60 text-zuri-dark/40 cursor-not-allowed'
                              : 'bg-zuri-gold text-zuri-dark hover:bg-zuri-dark hover:text-zuri-gold border border-zuri-gold'
                          }`}
                        >
                          <ChevronLeft className="w-5 h-5 mr-2" />
                          Previous
                        </button>

                        <button
                          onClick={currentStep === 4 ? handleSubmit : nextStep}
                          disabled={
                            (currentStep === 1 && selectedPrestations.length === 0) ||
                            (currentStep === 2 && !selectedEmployee) ||
                            (currentStep === 3 && (!selectedDate || !selectedTime)) ||
                            (currentStep === 4 && (!bookingData.name || !bookingData.phone)) ||
                            loading
                          }
                          className={`flex items-center px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 shadow-md ml-4 ${
                            (currentStep === 1 && selectedPrestations.length === 0) ||
                            (currentStep === 2 && !selectedEmployee) ||
                            (currentStep === 3 && (!selectedDate || !selectedTime)) ||
                            (currentStep === 4 && (!bookingData.name || !bookingData.phone)) ||
                            loading
                              ? 'bg-zuri-gold/60 text-zuri-dark/40 cursor-not-allowed'
                              : 'bg-zuri-gold text-zuri-dark hover:bg-zuri-dark hover:text-zuri-gold border border-zuri-gold'
                          }`}
                        >
                          {loading ? (
                            <div className="w-4 h-4 border-2 border-zuri-dark border-t-transparent rounded-full animate-spin mr-2" />
                          ) : null}
                          {currentStep === 4 ? 'Confirm Booking' : 'Next'}
                          {currentStep !== 4 && <ChevronRight className="w-5 h-5 ml-2" />}
                          {currentStep === 4 && <ArrowRight className="w-5 h-5 ml-2" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 