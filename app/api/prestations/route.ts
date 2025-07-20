import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const prestations = await prisma.prestation.findMany({
      orderBy: {
        createdAt: 'asc'
      }
    })

    // Define the desired category order
    const categoryOrder = [
      'Men\'s Haircuts',
      'Hair',
      'Beard',
      'Children\'s Haircuts',
      'Combo',
      'Eyebrows & Eyelashes',
      'Teeth Whitening',
      'Tooth Gems',
      'Waxing',
      'Facial Treatments'
    ]

    // Sort prestations by the defined category order
    const sortedPrestations = prestations.sort((a, b) => {
      const aIndex = categoryOrder.indexOf(a.category)
      const bIndex = categoryOrder.indexOf(b.category)
      
      // If both categories are in our order list, sort by their position
      if (aIndex !== -1 && bIndex !== -1) {
        return aIndex - bIndex
      }
      
      // If only one is in our order list, prioritize it
      if (aIndex !== -1) return -1
      if (bIndex !== -1) return 1
      
      // If neither is in our order list, sort alphabetically
      return a.category.localeCompare(b.category)
    })

    return NextResponse.json(sortedPrestations)
  } catch (error) {
    console.error('Error fetching prestations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 