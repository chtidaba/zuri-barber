'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingCart, Plus, Check, ArrowLeft, Search } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { AnimatePresence } from 'framer-motion'
import { useCart } from '@/components/CartContext'

const allProducts = [
  // Hair Care Products
  { id: 1, name: 'Cantu Creme', price: 12.00, category: 'Hair Care', description: 'Premium hair cream for styling and conditioning', image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Die-Cantu-Kokosnuss-Locken-Creme.jpeg' },
  { id: 2, name: 'SKALA', price: 25.00, category: 'Hair Care', description: 'Professional hair styling product', image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/SKALA.jpeg' },
  { id: 3, name: 'Satin Schlafhaube', price: 9.90, category: 'Hair Care', description: 'Satin sleep cap for hair protection', image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Black.jpeg' },
  { id: 4, name: 'Volume Powder', price: 15.00, category: 'Hair Care', description: 'Texturizing powder for volume and hold', image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Hair-Volume-Powder.jpeg' },
  { id: 5, name: 'Bold Impact – S', price: 479.00, originalPrice: 500.00, category: 'Hair Care', description: 'Premium styling product for bold looks', image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-01-at-6.04.07-PM.jpeg' },
  { id: 6, name: 'Cologne (Baccarat Rouge)', price: 12.00, category: 'Fragrance', description: 'Luxury cologne fragrance', image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213350.jpeg' },
  { id: 7, name: 'Sheen Spray', price: 20.00, category: 'Hair Care', description: 'Shine and hold spray', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_132032.jpeg' },
  { id: 8, name: 'Olive Oil Mousse', price: 15.00, category: 'Hair Care', description: 'Nourishing hair mousse', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_132102.jpeg' },
  { id: 9, name: 'Oud Royal Aftershave', price: 25.00, category: 'Grooming', description: 'Premium aftershave with oud fragrance', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213051.jpeg' },
  { id: 10, name: 'Matte Pomade', price: 15.00, category: 'Hair Care', description: 'Matte finish hair pomade', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_132128.jpeg' },
  { id: 11, name: 'Clay Pomade', price: 15.00, category: 'Hair Care', description: 'Natural clay-based pomade', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213008.jpeg' },
  { id: 12, name: 'Cologne Spray (Baccarat Rouge 540)', price: 25.00, category: 'Fragrance', description: 'Luxury cologne spray', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_212843.jpeg' },
  { id: 13, name: 'Shine \'n Jam', price: 15.00, category: 'Hair Care', description: 'Shine and hold gel', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_212936.jpeg' },
  { id: 14, name: 'RedOne Red', price: 15.00, category: 'Hair Care', description: 'Red hair styling product', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213008.jpeg' },
  { id: 15, name: 'RedOne Black', price: 15.00, category: 'Hair Care', description: 'Black hair styling product', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_215833.jpeg' },
  
  // Services
  { id: 16, name: 'The Royal Treatment', price: 250.00, category: 'Services', description: 'Premium grooming service package', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-10.jpg' },
  { id: 17, name: 'The Executive Cut', price: 150.00, category: 'Services', description: 'Executive haircut and styling', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-14-1.jpg' },
  { id: 18, name: 'Stempelkarte', price: 0.00, category: 'Services', description: 'Loyalty card for services', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-18.jpg' },
  { id: 19, name: 'E-Gutschein', price: 50.00, category: 'Services', description: 'Digital gift certificate', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-17.jpg' },
  
  // Barber Chairs
  { id: 20, name: 'Barbierstuhl in Mattgrau', price: 1200.00, originalPrice: 1350.00, category: 'Equipment', description: 'Premium barber chair in matte gray', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-6.jpg' },
  { id: 21, name: 'Barberstuhl in Dunkelbraun', price: 800.00, originalPrice: 1000.00, category: 'Equipment', description: 'Classic barber chair in dark brown', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-7.jpg' },
  { id: 22, name: 'Moderner Barberstuhl', price: 800.00, originalPrice: 1000.00, category: 'Equipment', description: 'Modern design barber chair', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-19.jpg' },
  { id: 23, name: 'Barberstuhl in Antikbraun', price: 750.00, originalPrice: 1000.00, category: 'Equipment', description: 'Antique style barber chair', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-20.jpg' },
  { id: 24, name: 'Schwarzer Barbierstuhl', price: 800.00, originalPrice: 1100.00, category: 'Equipment', description: 'Black professional barber chair', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224738.jpeg' },
  { id: 25, name: 'Grey Metal Barbierstuhl', price: 950.00, originalPrice: 1200.00, category: 'Equipment', description: 'Metal barber chair in grey', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224715.jpeg' },
  { id: 26, name: 'Classic Noir Barbierstuhl', price: 1200.00, originalPrice: 1450.00, category: 'Equipment', description: 'Classic noir barber chair', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224550.jpeg' },
  { id: 27, name: 'Throne Barbierstuhl', price: 950.00, originalPrice: 1200.00, category: 'Equipment', description: 'Throne-style barber chair', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224648.jpeg' },
  { id: 28, name: 'Barbierstation', price: 2199.00, originalPrice: 2600.00, category: 'Equipment', description: 'Complete barber station setup', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_223024.jpeg' },
  { id: 29, name: 'Premium Barbierstuhl', price: 1550.00, originalPrice: 1750.00, category: 'Equipment', description: 'Premium quality barber chair', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224635.jpeg' },
  { id: 30, name: 'Waschsitz', price: 850.00, originalPrice: 1100.00, category: 'Equipment', description: 'Wash basin chair', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_222839.jpeg' },
  
  // Counters
  { id: 31, name: 'Big Small Counter', price: 1800.00, originalPrice: 2500.00, category: 'Equipment', description: 'Large counter for barbershop', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_222818.jpeg' },
  { id: 32, name: 'Small Counter', price: 1250.00, originalPrice: 1500.00, category: 'Equipment', description: 'Compact counter unit', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_222749.jpeg' },
  
  // Frames
  { id: 33, name: 'Compact Style – S', price: 369.00, originalPrice: 390.00, category: 'Frames', description: 'Small compact frame', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-01-at-6.06.03-PM.jpeg' },
  { id: 34, name: 'Compact Style – M', price: 379.00, originalPrice: 400.00, category: 'Frames', description: 'Medium compact frame', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250428_235948-1.jpeg' },
  { id: 35, name: 'Framed Elegance – M', price: 439.00, originalPrice: 460.00, category: 'Frames', description: 'Elegant medium frame', image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-01-at-6.05.01-PM.jpeg' }
]

const categories = ['All', 'Hair Care', 'Fragrance', 'Grooming', 'Services', 'Equipment', 'Frames']

export default function ProductsPage() {
  const { addToCart, cart } = useCart()
  const [showCart, setShowCart] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')

  const isInCart = (productId: number) => cart.some(item => item.id === productId)

  const filteredProducts = allProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-zuri-dark">
      <Navbar />
      
      {/* Header */}
      <div className="bg-zuri-gray border-b border-zuri-dark">
        <div className="container-custom py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center text-zuri-gold hover:text-white transition-colors duration-300">
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-serif text-zuri-gold">All Products</h1>
            <div className="text-zuri-light">
              {filteredProducts.length} products
            </div>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zuri-light w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-zuri-dark border-2 border-zuri-gold text-zuri-light placeholder-zuri-light/50 focus:outline-none focus:border-zuri-gold focus:ring-2 focus:ring-zuri-gold/20 transition-colors duration-300 rounded-xl"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-sm font-medium whitespace-nowrap transition-all duration-300 rounded-lg border-2 ${
                    selectedCategory === category
                      ? 'bg-zuri-gold text-zuri-dark border-zuri-gold shadow-lg'
                      : 'bg-zuri-dark text-zuri-light border-zuri-gold hover:text-zuri-gold hover:bg-zuri-gray'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.05 }}
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
                        <span className="text-sm line-through text-zuri-light/60">
                          CHF {product.originalPrice}
                        </span>
                        <span className="text-xl font-serif text-zuri-gold block">
                          CHF {product.price}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xl font-serif text-zuri-gold">
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
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                      isInCart(product.id)
                        ? 'bg-green-500 text-white cursor-default'
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

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-zuri-light text-lg">No products found matching your criteria.</p>
          </motion.div>
        )}
      </div>

      {/* Cart Notification */}
      <AnimatePresence>
        {showCart && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            className="fixed bottom-8 right-8 bg-zuri-gold text-zuri-dark px-6 py-4 rounded-xl shadow-2xl z-50"
          >
            <div className="flex items-center space-x-3">
              <ShoppingCart className="w-5 h-5" />
              <span className="font-medium">Product added to cart!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 