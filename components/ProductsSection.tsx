'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Check, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useCart } from './CartContext'

const products = [
  {
    id: 1,
    name: 'Cantu Creme',
    price: 12.00,
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Die-Cantu-Kokosnuss-Locken-Creme.jpeg',
    description: 'Premium hair cream for styling and conditioning'
  },
  {
    id: 2,
    name: 'SKALA',
    price: 25.00,
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/SKALA.jpeg',
    description: 'Professional hair styling product'
  },
  {
    id: 3,
    name: 'Satin Schlafhaube',
    price: 9.90,
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Black.jpeg',
    description: 'Satin sleep cap for hair protection'
  },
  {
    id: 4,
    name: 'Volume Powder',
    price: 15.00,
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Hair-Volume-Powder.jpeg',
    description: 'Texturizing powder for volume and hold'
  },
  {
    id: 5,
    name: 'Bold Impact – S',
    price: 479.00,
    originalPrice: 500.00,
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-01-at-6.04.07-PM.jpeg',
    description: 'Premium styling product for bold looks'
  },
  {
    id: 6,
    name: 'Cologne (Baccarat Rouge)',
    price: 12.00,
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213350.jpeg',
    description: 'Luxury cologne fragrance'
  }
]

export default function ProductsSection() {
  const { addToCart, cart } = useCart()
  const [showCart, setShowCart] = useState(false)

  const isInCart = (productId: number) => cart.some(item => item.id === productId)

  return (
    <section id="products" className="section-padding bg-zuri-dark">
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
            Premium Products
          </h2>
          <p className="text-xl text-zuri-light max-w-2xl mx-auto">
            Discover our curated collection of premium grooming products for the modern gentleman.
          </p>
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-zuri-gray p-6 group hover:bg-zuri-gray/80 transition-all duration-300 rounded-xl cursor-pointer"
              onClick={() => window.location.href = `/products/${product.id}`}
            >
              {/* Product Image */}
              <div className="relative mb-6 overflow-hidden rounded-lg">
                <div className="aspect-square bg-zuri-dark rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>

              {/* Product Info */}
              <div className="text-center">
                <h3 className="text-2xl font-serif text-zuri-gold mb-2">
                  {product.name}
                </h3>
                <p className="text-zuri-light text-sm mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="text-left">
                    {product.originalPrice ? (
                      <div>
                        <span className="text-lg line-through text-zuri-light/60">
                          CHF {product.originalPrice}
                        </span>
                        <span className="text-2xl font-serif text-zuri-gold block">
                          CHF {product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-2xl font-serif text-zuri-gold">
                        CHF {product.price}
                      </span>
                    )}
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image });
                      setShowCart(true);
                      setTimeout(() => setShowCart(false), 2000);
                    }}
                    className={`px-4 py-2 text-sm font-medium transition-all duration-300 rounded-lg shadow-md ${
                      isInCart(product.id)
                        ? 'bg-green-500 text-white'
                        : 'bg-zuri-gold text-zuri-dark hover:bg-white'
                    }`}
                  >
                    {isInCart(product.id) ? 'Added' : 'Add to Cart'}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cart Notification */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{
            opacity: showCart ? 1 : 0,
            y: showCart ? 0 : 50,
          }}
          className={`fixed bottom-8 right-8 bg-zuri-gold text-zuri-dark px-6 py-3 rounded-xl shadow-lg z-50 ${
            showCart ? 'block' : 'hidden'
          }`}
        >
          <div className="flex items-center space-x-2">
            <Check className="w-5 h-5" />
            <span className="font-medium">Added to cart!</span>
          </div>
        </motion.div>

        {/* Load More Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <motion.a
            href="/products"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center bg-zuri-dark border-2 border-zuri-gold text-zuri-gold font-semibold px-8 py-3 rounded-xl hover:bg-zuri-gold hover:text-zuri-dark transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            View All Products
            <ArrowRight className="w-5 h-5 ml-2" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  )
} 