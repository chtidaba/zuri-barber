'use client'

import { motion } from 'framer-motion'

export default function LoadingSpinner() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-zuri-dark z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 mx-auto mb-4 relative"
        >
          {/* Barber pole stripes */}
          <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-white to-blue-600 rounded-full opacity-80"></div>
          <div className="absolute inset-1 bg-zuri-dark rounded-full"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-red-600 via-white to-blue-600 rounded-full opacity-60 animate-barber-pole"></div>
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-2xl font-serif text-zuri-gold mb-2"
        >
          Zuri Barber
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-zuri-light text-sm"
        >
          Loading...
        </motion.p>
      </div>
    </motion.div>
  )
} 