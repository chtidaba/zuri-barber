import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employeeId = searchParams.get('employeeId')

    console.log('Employee appointments API called with employeeId:', employeeId)

    if (!employeeId) {
      return NextResponse.json(
        { error: 'Employee ID is required' },
        { status: 400 }
      )
    }

    // First, check if the employee exists
    console.log('Checking if employee exists...')
    const employee = await prisma.user.findUnique({
      where: { id: employeeId }
    })

    console.log('Found employee:', employee)

    if (!employee) {
      return NextResponse.json(
        { error: 'Employee not found' },
        { status: 404 }
      )
    }

    // Get appointments for this employee with full details
    console.log('Fetching appointments for employee...')
    const appointments = await prisma.appointment.findMany({
      where: {
        employeeId
      },
      include: {
        client: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        },
        prestations: {
          include: {
            prestation: true
          }
        }
      },
      orderBy: [
        { date: 'asc' },
        { time: 'asc' }
      ]
    })

    console.log('Found appointments:', appointments.length)

    return NextResponse.json(appointments)
  } catch (error) {
    console.error('Error fetching employee appointments:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    })
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 