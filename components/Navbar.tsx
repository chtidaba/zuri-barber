'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Menu, X, ShoppingCart } from 'lucide-react'
import { useCart } from './CartContext'
import CartSidebar from './CartSidebar'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const { cart } = useCart()
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="bg-zuri-dark border-b border-zuri-gray sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-zuri-gold rounded-full"></div>
            <span className="text-xl font-serif text-zuri-gold">Züri Barber & Beauty</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-zuri-light hover:text-zuri-gold transition-colors duration-300">
              Home
            </Link>
            <Link href="/products" className="text-zuri-light hover:text-zuri-gold transition-colors duration-300">
              Products
            </Link>
            <Link href="/booking" className="text-zuri-light hover:text-zuri-gold transition-colors duration-300">
              Book
            </Link>
            <Link href="/admin" className="text-zuri-light hover:text-zuri-gold transition-colors duration-300">
              Employee Login
            </Link>
          </div>

          {/* Cart Icon */}
          <button
            className="relative ml-4 text-zuri-gold hover:text-white transition-colors duration-300"
            onClick={() => setCartOpen(true)}
            aria-label="Open cart"
          >
            <ShoppingCart className="w-7 h-7" />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden text-zuri-light hover:text-zuri-gold transition-colors duration-300"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden py-4 border-t border-zuri-gray"
          >
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-zuri-light hover:text-zuri-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/products" 
                className="text-zuri-light hover:text-zuri-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Products
              </Link>
              <Link 
                href="/booking" 
                className="text-zuri-light hover:text-zuri-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Book
              </Link>
              <Link 
                href="/admin" 
                className="text-zuri-light hover:text-zuri-gold transition-colors duration-300"
                onClick={() => setIsOpen(false)}
              >
                Employee Login
              </Link>
            </div>
          </motion.div>
        )}
      </div>
      <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
    </nav>
  )
} 