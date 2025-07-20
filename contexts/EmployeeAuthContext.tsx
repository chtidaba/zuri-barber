'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

interface Employee {
  id: string
  name: string
  email: string
}

interface EmployeeAuthContextType {
  employee: Employee | null
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
  loading: boolean
}

const EmployeeAuthContext = createContext<EmployeeAuthContextType | undefined>(undefined)

export const useEmployeeAuth = () => {
  const context = useContext(EmployeeAuthContext)
  if (context === undefined) {
    throw new Error('useEmployeeAuth must be used within an EmployeeAuthProvider')
  }
  return context
}

export const EmployeeAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing token on app load
    const savedToken = localStorage.getItem('employee_token')
    const savedEmployee = localStorage.getItem('employee_data')
    
    if (savedToken && savedEmployee) {
      setToken(savedToken)
      setEmployee(JSON.parse(savedEmployee))
    }
    
    setLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error }
      }

      setEmployee(data.employee)
      setToken(data.token)
      localStorage.setItem('employee_token', data.token)
      localStorage.setItem('employee_data', JSON.stringify(data.employee))

      return { success: true }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' }
    }
  }

  const logout = () => {
    setEmployee(null)
    setToken(null)
    localStorage.removeItem('employee_token')
    localStorage.removeItem('employee_data')
  }

  const value = {
    employee,
    token,
    login,
    logout,
    loading
  }

  return (
    <EmployeeAuthContext.Provider value={value}>
      {children}
    </EmployeeAuthContext.Provider>
  )
} 