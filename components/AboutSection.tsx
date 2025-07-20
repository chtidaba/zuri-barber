'use client'

import { motion } from 'framer-motion'
import { Award, Users, Heart, Star } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Employee {
  id: string
  name: string
  role: string
}

const values = [
  {
    icon: Award,
    title: 'Excellence',
    description: 'We strive for perfection in every cut and style'
  },
  {
    icon: Users,
    title: 'Community',
    description: 'Building lasting relationships with our clients'
  },
  {
    icon: Heart,
    title: 'Passion',
    description: 'Love for the craft drives everything we do'
  },
  {
    icon: Star,
    title: 'Quality',
    description: 'Premium products and exceptional service'
  }
]

export default function AboutSection() {
  const [employees, setEmployees] = useState<Employee[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await fetch('/api/employees')
        if (response.ok) {
          const data = await response.json()
          setEmployees(data)
        }
      } catch (error) {
        console.error('Error fetching employees:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  // Professional barber profile picture URLs
  const profilePictures = [
    'https://images.newrepublic.com/9bba0e56c589fb3e06191969202abb446327a86a.jpeg?auto=format&fit=crop&crop=faces&q=65&w=1000&ar=3%3A2&ixlib=react-9.10.0',
    'https://www.ringmybarber.com/wp-content/uploads/2022/10/qualities-of-a-highly-professional-barber.jpg',
    'https://images.squarespace-cdn.com/content/v1/62f1307024cba25fc6025b32/31700a79-c001-45ff-9809-3081c8dcbf5b/AdobeStock_374326500.jpeg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkWWOTtuD_mWUzO2KsyYix0ICy2lwKvxRUK2QogB8-of2VY6tLWstpmCZxhLUsPDszBwU&usqp=CAU',
    'https://cdn.bokadirekt.se/ucdn/407c9efc-5523-440c-814c-10f06903b30e/',
    'https://cdn.bokadirekt.se/ucdn/8c6c6afb-5bb8-4282-95c0-1db973d1f969/-/crop/1125x1124/0,0/-/preview/'
  ]

  return (
    <section id="about" className="section-padding bg-zuri-gray">
      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif text-zuri-gold mb-6">
            About Zuri Barber
          </h2>
          <p className="text-xl text-zuri-light max-w-3xl mx-auto">
            Where tradition meets innovation in the heart of Zurich
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Story Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="text-3xl font-serif text-zuri-gold mb-6">
              Our Story
            </h3>
            <div className="space-y-4 text-zuri-light">
              <p>
                Founded in 2018, Zuri Barber and Beauty began as a vision to bring 
                back the art of traditional barbering while embracing modern techniques 
                and trends. Our journey started in the vibrant streets of Zurich, where 
                we discovered that every client has a unique story and style.
              </p>
              <p>
                Today, with two premium locations in Europaallee and Albisriedenplatz, 
                we continue to serve Zurich's most discerning gentlemen with the highest 
                standards of grooming excellence. Our team of master barbers combines 
                years of experience with ongoing education to deliver exceptional results.
              </p>
              <p>
                We believe that a great haircut is more than just a service—it's an 
                experience that boosts confidence and reflects personal style. That's 
                why we take the time to understand each client's needs and preferences.
              </p>
            </div>
          </motion.div>

          {/* Team Section */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <h3 className="text-3xl font-serif text-zuri-gold mb-6 text-center">
              Our Expert Team
            </h3>
            
            {loading ? (
              <div className="grid grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="text-center">
                    <div className="w-60 h-60 bg-zuri-dark rounded-full mx-auto mb-2 animate-pulse">
                      <div className="w-full h-full bg-gradient-to-br from-zuri-gold/20 to-zuri-dark rounded-full flex items-center justify-center">
                        <Users className="w-18 h-18 text-zuri-gold/30" />
                      </div>
                    </div>
                    <div className="h-4 bg-zuri-dark rounded animate-pulse mx-2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-6">
                {employees.map((employee, index) => (
                  <motion.div
                    key={employee.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-center group cursor-pointer"
                  >
                    <div className="w-50 h-52 bg-zuri-dark rounded-full mx-auto mb-3 overflow-hidden relative">
                      <img
                        src={profilePictures[index]}
                        alt={employee.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <p className="text-zuri-gold text-sm font-medium truncate">{employee.name}</p>
                    <p className="text-zuri-light/80 text-xs">Master Barber</p>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Values Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-3xl font-serif text-zuri-gold text-center mb-12">
            Our Values
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center group"
              >
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  className="w-16 h-16 bg-zuri-gold rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white transition-colors duration-300"
                >
                  <value.icon className="w-8 h-8 text-zuri-dark" />
                </motion.div>
                <h4 className="text-xl font-serif text-zuri-gold mb-2">
                  {value.title}
                </h4>
                <p className="text-zuri-light text-sm">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="mt-16 grid md:grid-cols-3 gap-8 text-center"
        >
          <div>
            <div className="text-4xl font-serif text-zuri-gold mb-2">5+</div>
            <div className="text-zuri-light">Years of Excellence</div>
          </div>
          <div>
            <div className="text-4xl font-serif text-zuri-gold mb-2">1000+</div>
            <div className="text-zuri-light">Happy Clients</div>
          </div>
          <div>
            <div className="text-4xl font-serif text-zuri-gold mb-2">{employees.length}</div>
            <div className="text-zuri-light">Expert Barbers</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
} 