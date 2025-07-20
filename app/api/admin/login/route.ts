import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { comparePassword, generateToken } from '@/lib/auth'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Find user with EMPLOYEE role
    const user = await prisma.user.findFirst({
      where: { 
        email,
        role: 'EMPLOYEE'
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials or not authorized' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await comparePassword(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Generate token
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role
    })

    // Return employee data (without password)
    const employeeData = {
      id: user.id,
      email: user.email,
      name: user.name
    }

    return NextResponse.json({
      employee: employeeData,
      token
    })

  } catch (error) {
    console.error('Employee login error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 