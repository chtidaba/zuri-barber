import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Availability ID is required' },
        { status: 400 }
      )
    }

    // Check if availability exists
    const availability = await prisma.availability.findUnique({
      where: { id }
    })

    if (!availability) {
      return NextResponse.json(
        { error: 'Availability not found' },
        { status: 404 }
      )
    }

    // Delete the availability
    await prisma.availability.delete({
      where: { id }
    })

    return NextResponse.json({
      message: 'Availability deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting availability:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 