'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, Phone } from 'lucide-react'

const locations = [
  {
    id: 'europaallee',
    name: 'Zurich Europaallee',
    address: 'Europaallee 41, 8004 Zürich, Switzerland',
    phone: '+41 44 123 4567',
    hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
    mapUrl: 'https://maps.app.goo.gl/Gfgau6iSvD849X1n8',
    staticMapUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=Europaallee+41,Zurich&zoom=15&size=400x300&maptype=roadmap&markers=color:gold%7CEuropaallee+41,Zurich&key=AIzaSyDU476wJoJELTJOesKJxe7FVxs5BaDRZqM',
    bookingUrl: '#'
  },
  {
    id: 'albisriedenplatz',
    name: 'Zurich Albisriedenplatz',
    address: 'Albisriederstrasse 123, 8003 Zürich, Switzerland',
    phone: '+41 44 987 6543',
    hours: 'Mon-Sat: 9:00 AM - 7:00 PM',
    mapUrl: 'https://maps.app.goo.gl/S6dciJzBH8BRCdQK9',
    staticMapUrl: 'https://maps.googleapis.com/maps/api/staticmap?center=Albisriederstrasse+123,Zurich&zoom=15&size=400x300&maptype=roadmap&markers=color:gold%7CAlbisriederstrasse+123,Zurich&key=AIzaSyDU476wJoJELTJOesKJxe7FVxs5BaDRZqM',
    bookingUrl: '#'
  }
]

export default function BookingSection() {
  return (
    <section id="booking" className="section-padding bg-zuri-gray">
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
            Book Your Appointment
          </h2>
          <p className="text-xl text-zuri-light max-w-2xl mx-auto">
            Choose your preferred location and book your grooming session with our expert barbers.
          </p>
        </motion.div>

        {/* Locations Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {locations.map((location, index) => (
            <motion.div
              key={location.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="bg-zuri-dark p-6 lg:p-8"
            >
              {/* Location Header */}
              <div className="mb-6">
                <h3 className="text-2xl font-serif text-zuri-gold mb-4">
                  {location.name}
                </h3>
                
                {/* Contact Info */}
                <div className="space-y-3">
                  <div className="flex items-center text-zuri-light">
                    <MapPin className="w-5 h-5 text-zuri-gold mr-3" />
                    <span className="text-sm">{location.address}</span>
                  </div>
                  <div className="flex items-center text-zuri-light">
                    <Phone className="w-5 h-5 text-zuri-gold mr-3" />
                    <span className="text-sm">{location.phone}</span>
                  </div>
                  <div className="flex items-center text-zuri-light">
                    <Clock className="w-5 h-5 text-zuri-gold mr-3" />
                    <span className="text-sm">{location.hours}</span>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="mb-6">
                <div className="relative h-48 lg:h-56 bg-zuri-gray rounded overflow-hidden group cursor-pointer">
                  <a
                    href={location.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full h-full"
                  >
                    {/* Real Map Preview Image */}
                    <img
                      src={location.staticMapUrl}
                      alt={`Map preview of ${location.name}`}
                      className="w-full h-full object-cover"
                      style={{ filter: 'brightness(0.85)' }}
                    />
                    {/* Overlay with Location Info */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zuri-dark/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="bg-zuri-dark/90 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="w-4 h-4 text-zuri-gold" />
                          <span className="text-zuri-light text-sm font-medium">{location.name}</span>
                        </div>
                        <p className="text-zuri-light/80 text-xs mt-1">{location.address}</p>
                      </div>
                    </div>
                    {/* Click to View Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-zuri-gold/90 backdrop-blur-sm rounded-lg px-4 py-2">
                        <p className="text-zuri-dark font-medium text-sm">Click to view on Google Maps</p>
                      </div>
                    </div>
                  </a>
                </div>
              </div>

              {/* Booking Button */}
              <motion.button
                disabled={location.id === 'albisriedenplatz'}
                whileHover={location.id !== 'albisriedenplatz' ? { scale: 1.02 } : {}}
                whileTap={location.id !== 'albisriedenplatz' ? { scale: 0.98 } : {}}
                className={`w-full block text-center py-3 px-6 rounded-lg font-medium transition-all duration-300 ${
                  location.id === 'albisriedenplatz' 
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed border border-gray-500 hover:bg-gray-600' 
                    : 'btn-primary'
                }`}
                onClick={location.id !== 'albisriedenplatz' ? () => window.location.href = '/booking' : undefined}
              >
                {location.id === 'albisriedenplatz' ? 'Coming Soon' : 'Book Now'}
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <p className="text-zuri-light text-sm">
            Walk-ins welcome, but appointments are recommended for the best experience.
          </p>
        </motion.div>
      </div>
    </section>
  )
} 