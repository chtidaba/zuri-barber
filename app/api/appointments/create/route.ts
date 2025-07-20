import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      employeeId, 
      date, 
      time, 
      duration, 
      prestationIds, 
      notes 
    } = await request.json()

    // Validate required fields
    if (!clientName || !clientPhone || !employeeId || !date || !time || !prestationIds || prestationIds.length === 0) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if employee exists and is an employee
    const employee = await prisma.user.findFirst({
      where: { 
        id: employeeId,
        role: 'EMPLOYEE'
      }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Invalid employee selected' },
        { status: 400 }
      )
    }

    // Check if the selected time slot is available
    const appointmentDate = new Date(date)
    const weekday = appointmentDate.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Check employee availability for this day
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
      return NextResponse.json(
        { error: 'Employee is not available on this day' },
        { status: 400 }
      )
    }

    // Check if time is within any available time slot
    const appointmentTime = time
    const isWithinTimeSlot = availability.timeSlots.some(slot => 
      appointmentTime >= slot.startTime && appointmentTime <= slot.endTime
    )

    if (!isWithinTimeSlot) {
      const timeRanges = availability.timeSlots.map(slot => 
        `${slot.startTime}-${slot.endTime}`
      ).join(', ')
      return NextResponse.json(
        { error: `Selected time is outside available hours. Employee is available during: ${timeRanges}` },
        { status: 400 }
      )
    }

    // Check for existing appointments at the same time
    const existingAppointment = await prisma.appointment.findFirst({
      where: {
        employeeId,
        date: appointmentDate,
        time,
        status: {
          in: ['PENDING', 'CONFIRMED']
        }
      }
    })

    if (existingAppointment) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 400 }
      )
    }

    // Create or find client user
    let clientUser = null
    if (clientEmail) {
      clientUser = await prisma.user.findUnique({
        where: { email: clientEmail }
      })
    }

    if (!clientUser) {
      // Create a new client user
      clientUser = await prisma.user.create({
        data: {
          name: clientName,
          email: clientEmail || `client_${Date.now()}@temp.com`,
          phone: clientPhone,
          role: 'CLIENT',
          password: 'temp_password' // This will be changed if they register later
        }
      })
    }

    // Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        clientId: clientUser.id,
        employeeId,
        date: appointmentDate,
        time,
        duration,
        notes,
        status: 'CONFIRMED' // Auto-confirm for now
      }
    })

    // Link prestations to the appointment
    for (const prestationId of prestationIds) {
      await prisma.appointmentPrestation.create({
        data: {
          appointmentId: appointment.id,
          prestationId
        }
      })
    }

    // Fetch the created appointment with all related data
    const createdAppointment = await prisma.appointment.findUnique({
      where: { id: appointment.id },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        employee: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        prestations: {
          include: {
            prestation: true
          }
        }
      }
    })

    return NextResponse.json({
      message: 'Appointment created successfully',
      appointment: createdAppointment
    })

  } catch (error) {
    console.error('Appointment creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 