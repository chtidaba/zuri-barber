import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')
    const date = searchParams.get('date')

    if (!employeeId || !date) {
      return NextResponse.json(
        { error: 'Missing employeeId or date parameter' },
        { status: 400 }
      )
    }

    // Get the weekday for the selected date
    const appointmentDate = new Date(date)
    const weekday = appointmentDate.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Get employee availability for this day
    const availability = await prisma.availability.findUnique({
      where: {
        employeeId_weekday: {
          employeeId,
          weekday
        }
      },
      include: {
        timeSlots: {
          orderBy: {
            startTime: 'asc'
          }
        }
      }
    })

    if (!availability || !availability.isActive) {
      return NextResponse.json({
        available: false,
        message: 'Employee is not available on this day'
      })
    }

    // Generate available time slots within the employee's time slots
    const availableTimeSlots = []
    
    for (const timeSlot of availability.timeSlots) {
      const startHour = parseInt(timeSlot.startTime.split(':')[0])
      const startMinute = parseInt(timeSlot.startTime.split(':')[1])
      const endHour = parseInt(timeSlot.endTime.split(':')[0])
      const endMinute = parseInt(timeSlot.endTime.split(':')[1])
      
      // Generate 30-minute intervals within this time slot
      let currentHour = startHour
      let currentMinute = startMinute
      
      while (
        (currentHour < endHour) || 
        (currentHour === endHour && currentMinute < endMinute)
      ) {
        const timeString = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`
        availableTimeSlots.push(timeString)
        
        // Move to next 30-minute slot
        currentMinute += 30
        if (currentMinute >= 60) {
          currentHour += 1
          currentMinute = 0
        }
      }
    }

    // Check for existing appointments and remove those time slots
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        employeeId,
        date: appointmentDate,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      },
      select: {
        time: true,
        duration: true
      }
    })

    // Remove booked time slots
    const bookedTimes = new Set()
    existingAppointments.forEach(appointment => {
      const appointmentTime = appointment.time
      const duration = appointment.duration
      
      // Add the appointment time and all subsequent 30-minute slots within the duration
      let currentTime = appointmentTime
      let remainingMinutes = duration
      
      while (remainingMinutes > 0) {
        bookedTimes.add(currentTime)
        
        // Move to next 30-minute slot
        const [hour, minute] = currentTime.split(':').map(Number)
        let nextHour = hour
        let nextMinute = minute + 30
        
        if (nextMinute >= 60) {
          nextHour += 1
          nextMinute = 0
        }
        
        currentTime = `${nextHour.toString().padStart(2, '0')}:${nextMinute.toString().padStart(2, '0')}`
        remainingMinutes -= 30
      }
    })

    // Filter out booked times
    const finalAvailableSlots = availableTimeSlots.filter(time => !bookedTimes.has(time))

    return NextResponse.json({
      available: true,
      timeSlots: finalAvailableSlots,
      employeeAvailability: availability.timeSlots.map(slot => ({
        startTime: slot.startTime,
        endTime: slot.endTime
      }))
    })

  } catch (error) {
    console.error('Error fetching available time slots:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 