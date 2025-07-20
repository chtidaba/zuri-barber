import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { employeeId, weekday, timeSlots, isActive } = await request.json()

    if (!employeeId || weekday === undefined || !timeSlots || !Array.isArray(timeSlots)) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if employee exists
    const employee = await prisma.user.findUnique({
      where: { id: employeeId }
    })

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Validate time slots
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/
    for (const slot of timeSlots) {
      if (!slot.startTime || !slot.endTime) {
        return NextResponse.json(
          { error: 'Each time slot must have start and end times' },
          { status: 400 }
        )
      }

      if (!timeRegex.test(slot.startTime) || !timeRegex.test(slot.endTime)) {
        return NextResponse.json(
          { error: 'Invalid time format. Use HH:MM format' },
          { status: 400 }
        )
      }

      if (slot.startTime >= slot.endTime) {
        return NextResponse.json(
          { error: 'End time must be after start time' },
          { status: 400 }
        )
      }
    }

    // Create or update availability
    const availability = await prisma.availability.upsert({
      where: {
        employeeId_weekday: {
          employeeId,
          weekday
        }
      },
      update: {
        isActive
      },
      create: {
        employeeId,
        weekday,
        isActive
      }
    })

    // Delete existing time slots for this availability
    await prisma.timeSlot.deleteMany({
      where: {
        availabilityId: availability.id
      }
    })

    // Create new time slots
    const createdTimeSlots = []
    for (const slot of timeSlots) {
      const timeSlot = await prisma.timeSlot.create({
        data: {
          availabilityId: availability.id,
          startTime: slot.startTime,
          endTime: slot.endTime
        }
      })
      createdTimeSlots.push(timeSlot)
    }

    return NextResponse.json({
      message: 'Availability saved successfully',
      availability: {
        ...availability,
        timeSlots: createdTimeSlots
      }
    })

  } catch (error) {
    console.error('Error saving availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 