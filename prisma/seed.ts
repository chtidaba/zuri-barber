import { PrismaClient } from '@prisma/client'
import { hashPassword } from '../lib/auth'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create employees
  const employees = [
    {
      name: 'Make Barber',
      email: 'make@zuribarber.com',
      password: 'password123',
      phone: '+41 79 123 4567'
    },
    {
      name: 'Moo',
      email: 'moo@zuribarber.com',
      password: 'password123',
      phone: '+41 79 234 5678'
    },
    {
      name: 'Ihab Barber',
      email: 'ihab@zuribarber.com',
      password: 'password123',
      phone: '+41 79 345 6789'
    },
    {
      name: 'Rayan Barber',
      email: 'rayan@zuribarber.com',
      password: 'password123',
      phone: '+41 79 456 7890'
    },
    {
      name: 'Enmanuel Barber',
      email: 'enmanuel@zuribarber.com',
      password: 'password123',
      phone: '+41 79 567 8901'
    },
    {
      name: 'Ely Barber',
      email: 'ely@zuribarber.com',
      password: 'password123',
      phone: '+41 79 678 9012'
    }
  ]

  console.log('👥 Creating employees...')
  for (const employeeData of employees) {
    const hashedPassword = await hashPassword(employeeData.password)
    
    await prisma.user.upsert({
      where: { email: employeeData.email },
      update: {},
      create: {
        email: employeeData.email,
        password: hashedPassword,
        name: employeeData.name,
        phone: employeeData.phone,
        role: 'EMPLOYEE'
      }
    })
  }

  // Create services (prestations)
  const services = [
    // Men's Haircuts
    {
      title: 'Men\'s Haircut',
      category: 'Men\'s Haircuts',
      duration: '45min-1h15min',
      price: 30.00
    },
    {
      title: 'Men\'s Haircut & Beard',
      category: 'Men\'s Haircuts',
      duration: '1h',
      price: 50.00
    },
    {
      title: 'Men\'s Cut & Style',
      category: 'Men\'s Haircuts',
      duration: '50min',
      price: 35.00
    },
    {
      title: 'Men\'s Wash & Style',
      category: 'Men\'s Haircuts',
      duration: '10min',
      price: 15.00
    },
    {
      title: 'Men\'s Hair Straightening',
      category: 'Men\'s Haircuts',
      duration: '1h',
      price: 100.00
    },
    {
      title: 'Men\'s Hair Coloring',
      category: 'Men\'s Haircuts',
      duration: '1h30min',
      price: 100.00
    },
    {
      title: 'Men\'s Bleaching or Highlights',
      category: 'Men\'s Haircuts',
      duration: '2h55min',
      price: 130.00
    },
    {
      title: 'Men\'s Hair Toning',
      category: 'Men\'s Haircuts',
      duration: '30min',
      price: 50.00
    },
    {
      title: 'Permanent Wave Short Hair',
      category: 'Men\'s Haircuts',
      duration: '4h20min',
      price: 200.00
    },

    // Hair (General)
    {
      title: 'Facial Treatment - Mask',
      category: 'Hair',
      duration: '1h30min',
      price: 50.00
    },

    // Beard
    {
      title: 'Men\'s Beard Trim',
      category: 'Beard',
      duration: '20min',
      price: 25.00
    },
    {
      title: 'Men\'s Shave',
      category: 'Beard',
      duration: '15min',
      price: 25.00
    },
    {
      title: 'Men\'s Beard Straightening',
      category: 'Beard',
      duration: '20min',
      price: 15.00
    },
    {
      title: 'Men\'s Beard Coloring',
      category: 'Beard',
      duration: '15min',
      price: 20.00
    },

    // Children's Haircuts
    {
      title: 'Children\'s Haircut (under 12)',
      category: 'Children\'s Haircuts',
      duration: '25min',
      price: 25.00
    },

    // Combo
    {
      title: 'Men\'s Eyebrow Plucking',
      category: 'Combo',
      duration: '20min',
      price: 15.00
    },

    // Eyebrows & Eyelashes
    {
      title: 'Women\'s Eyebrow Plucking',
      category: 'Eyebrows & Eyelashes',
      duration: '15min',
      price: 20.00
    },
    {
      title: 'Men\'s Eyebrow Plucking',
      category: 'Eyebrows & Eyelashes',
      duration: '10min',
      price: 15.00
    },

    // Teeth Whitening
    {
      title: 'Simple White',
      category: 'Teeth Whitening',
      duration: '30min',
      price: 60.00
    },
    {
      title: 'Super White',
      category: 'Teeth Whitening',
      duration: '1h',
      price: 90.00
    },
    {
      title: 'Brilliant White',
      category: 'Teeth Whitening',
      duration: '1h30min',
      price: 130.00
    },

    // Tooth Gems
    {
      title: '1 Swarovski Stone',
      category: 'Tooth Gems',
      duration: '15min',
      price: 50.00
    },
    {
      title: 'Full Tooth',
      category: 'Tooth Gems',
      duration: '20min-1h',
      price: 70.00
    },
    {
      title: 'Butterfly',
      category: 'Tooth Gems',
      duration: '25min-40min',
      price: 120.00
    },
    {
      title: 'Fairydust',
      category: 'Tooth Gems',
      duration: '25min',
      price: 100.00
    },
    {
      title: 'Pattern Stones & Gold',
      category: 'Tooth Gems',
      duration: '25min',
      price: 60.00
    },

    // Waxing
    {
      title: 'Waxing - Upper Lip',
      category: 'Waxing',
      duration: '30min',
      price: 18.00
    },
    {
      title: 'Women\'s Waxing - Full Face',
      category: 'Waxing',
      duration: '1h',
      price: 55.00
    },
    {
      title: 'Men\'s Waxing - Full Face',
      category: 'Waxing',
      duration: '10min',
      price: 15.00
    },
    {
      title: 'Women\'s Waxing - Underarms',
      category: 'Waxing',
      duration: '30min',
      price: 30.00
    },
    {
      title: 'Men\'s Waxing - Underarms',
      category: 'Waxing',
      duration: '30min',
      price: 30.00
    },
    {
      title: 'Waxing - Back',
      category: 'Waxing',
      duration: '45min',
      price: 65.00
    },
    {
      title: 'Waxing - Chest',
      category: 'Waxing',
      duration: '45min',
      price: 65.00
    },
    {
      title: 'Waxing - Full Arms',
      category: 'Waxing',
      duration: '30min',
      price: 65.00
    },
    {
      title: 'Waxing - Forearms',
      category: 'Waxing',
      duration: '20min',
      price: 30.00
    },
    {
      title: 'Waxing - Stomach',
      category: 'Waxing',
      duration: '30min',
      price: 30.00
    },
    {
      title: 'Waxing - Buttocks',
      category: 'Waxing',
      duration: '30min',
      price: 30.00
    },
    {
      title: 'Waxing - Full Legs',
      category: 'Waxing',
      duration: '1h',
      price: 85.00
    },
    {
      title: 'Waxing - Half Legs',
      category: 'Waxing',
      duration: '30min',
      price: 45.00
    },

    // Facial Treatments
    {
      title: 'Facial Treatment - Mask',
      category: 'Facial Treatments',
      duration: '1h30min',
      price: 50.00
    }
  ]

  console.log('💇 Creating services...')
  for (const service of services) {
    await prisma.prestation.upsert({
      where: { title: service.title },
      update: {},
      create: {
        title: service.title,
        category: service.category,
        duration: service.duration,
        price: service.price
      }
    })
  }

  // Create default availability for all employees
  console.log('📅 Creating default availability...')
  const allEmployees = await prisma.user.findMany({
    where: { role: 'EMPLOYEE' }
  })

  for (const employee of allEmployees) {
    // Monday to Friday availability
    for (let weekday = 1; weekday <= 5; weekday++) {
      const availability = await prisma.availability.upsert({
        where: {
          employeeId_weekday: {
            employeeId: employee.id,
            weekday
          }
        },
        update: {},
        create: {
          employeeId: employee.id,
          weekday,
          isActive: true
        }
      })

      // Create time slot 1: 9AM-12PM
      await prisma.timeSlot.upsert({
        where: {
          id: `default-${availability.id}-1`
        },
        update: {},
        create: {
          id: `default-${availability.id}-1`,
          availabilityId: availability.id,
          startTime: '09:00',
          endTime: '12:00'
        }
      })

      // Create time slot 2: 1PM-5PM
      await prisma.timeSlot.upsert({
        where: {
          id: `default-${availability.id}-2`
        },
        update: {},
        create: {
          id: `default-${availability.id}-2`,
          availabilityId: availability.id,
          startTime: '13:00',
          endTime: '17:00'
        }
      })
    }

    // Saturday availability
    const saturdayAvailability = await prisma.availability.upsert({
      where: {
        employeeId_weekday: {
          employeeId: employee.id,
          weekday: 6
        }
      },
      update: {},
      create: {
        employeeId: employee.id,
        weekday: 6,
        isActive: true
      }
    })

    // Create time slot for Saturday 9AM-4PM
    await prisma.timeSlot.upsert({
      where: {
        id: `default-${saturdayAvailability.id}-1`
      },
      update: {},
      create: {
        id: `default-${saturdayAvailability.id}-1`,
        availabilityId: saturdayAvailability.id,
        startTime: '09:00',
        endTime: '16:00'
      }
    })
  }

  console.log('✅ Database seeded successfully!')
  console.log('📧 Employee login emails:')
  employees.forEach(emp => {
    console.log(`   ${emp.email} (password: password123)`)
  })
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 