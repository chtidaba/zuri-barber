'use client'

import { motion } from 'framer-motion'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'

const socialLinks = [
  {
    name: 'Instagram',
    icon: Instagram,
    url: 'https://instagram.com/zuribarber',
    color: 'hover:text-pink-400'
  },
  {
    name: 'Facebook',
    icon: Facebook,
    url: 'https://facebook.com/zuribarber',
    color: 'hover:text-blue-400'
  }
]

const quickLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Book Appointment', href: '#booking' },
  { name: 'Products', href: '#products' },
  { name: 'About', href: '#about' }
]

const contactInfo = [
  {
    icon: Phone,
    text: '+41 44 123 4567',
    href: 'tel:+41441234567'
  },
  {
    icon: Mail,
    text: 'info@zuribarber.ch',
    href: 'mailto:info@zuribarber.ch'
  },
  {
    icon: MapPin,
    text: 'Zurich, Switzerland',
    href: '#'
  }
]

export default function Footer() {
  return (
    <footer className="bg-zuri-dark border-t border-zuri-gray">
      <div className="container-custom py-16">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="md:col-span-1"
          >
            <h3 className="text-2xl font-serif text-zuri-gold mb-4">
              Zuri Barber
            </h3>
            <p className="text-zuri-light text-sm mb-6">
              Refined grooming and timeless style in the heart of Zurich.
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`text-zuri-light ${social.color} transition-colors duration-300`}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-serif text-zuri-gold mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-zuri-light hover:text-zuri-gold transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-serif text-zuri-gold mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((contact) => (
                <li key={contact.text}>
                  <a
                    href={contact.href}
                    className="flex items-center text-zuri-light hover:text-zuri-gold transition-colors duration-300 text-sm"
                  >
                    <contact.icon className="w-4 h-4 mr-2 text-zuri-gold" />
                    {contact.text}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Hours */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <h4 className="text-lg font-serif text-zuri-gold mb-4">
              Hours
            </h4>
            <div className="text-zuri-light text-sm space-y-1">
              <p>Monday - Friday: 9:00 AM - 7:00 PM</p>
              <p>Saturday: 9:00 AM - 6:00 PM</p>
              <p>Sunday: Closed</p>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="border-t border-zuri-gray mt-12 pt-8"
        >
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-zuri-light text-sm">
              © 2024 Zuri Barber and Beauty. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-zuri-light hover:text-zuri-gold text-sm transition-colors duration-300">
                Privacy Policy
              </a>
              <a href="#" className="text-zuri-light hover:text-zuri-gold text-sm transition-colors duration-300">
                Terms of Service
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
} 