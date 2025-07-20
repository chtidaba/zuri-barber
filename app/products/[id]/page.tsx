'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, ShoppingCart, Check, Star, Truck, Shield, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import Navbar from '@/components/Navbar'
import { useCart } from '@/components/CartContext'

// Product data with enhanced descriptions
const productDatabase = {
  // Hair Care Products
  1: {
    id: 1,
    name: 'Cantu Creme',
    price: 12.00,
    category: 'Hair Care',
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Die-Cantu-Kokosnuss-Locken-Creme.jpeg',
    description: 'Premium hair cream for styling and conditioning',
    longDescription: 'Cantu Coconut Curling Cream is a rich, moisturizing hair cream that defines curls while providing long-lasting hydration. Made with natural coconut oil and shea butter, this cream helps reduce frizz and adds shine to curly and coily hair textures. Perfect for wash-and-go styles, twist-outs, and braid-outs.',
    features: [
      'Natural coconut oil and shea butter',
      'Defines curls without crunch',
      'Reduces frizz and adds shine',
      'Suitable for all curl types',
      'No parabens or sulfates'
    ],
    benefits: [
      'Long-lasting moisture',
      'Defined, bouncy curls',
      'Reduced frizz',
      'Natural ingredients',
      'Suitable for daily use'
    ],
    usage: 'Apply to damp hair, starting from ends to roots. Use a small amount and add more as needed. Style as desired.',
    ingredients: 'Water, Coconut Oil, Shea Butter, Glycerin, Fragrance, Preservatives'
  },
  2: {
    id: 2,
    name: 'SKALA',
    price: 25.00,
    category: 'Hair Care',
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/SKALA.jpeg',
    description: 'Professional hair styling product',
    longDescription: 'SKALA is a premium professional hair styling product designed for barbers and stylists. This versatile styling cream provides excellent hold and shine while maintaining natural movement. Perfect for creating textured looks, pompadours, and modern quiffs.',
    features: [
      'Professional-grade hold',
      'Natural shine finish',
      'Easy to wash out',
      'Suitable for all hair types',
      'Long-lasting style'
    ],
    benefits: [
      'Strong hold without stiffness',
      'Natural-looking finish',
      'Easy application',
      'Versatile styling options',
      'Professional results'
    ],
    usage: 'Apply to towel-dried hair and style as desired. For stronger hold, apply to dry hair.',
    ingredients: 'Petroleum, Beeswax, Fragrance, Preservatives'
  },
  3: {
    id: 3,
    name: 'Satin Schlafhaube',
    price: 9.90,
    category: 'Hair Care',
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Black.jpeg',
    description: 'Satin sleep cap for hair protection',
    longDescription: 'Protect your hair while you sleep with this premium satin sleep cap. Made from high-quality satin fabric, it prevents hair breakage, reduces frizz, and maintains your hairstyle overnight. Perfect for all hair types, especially curly and textured hair.',
    features: [
      'Premium satin fabric',
      'Elastic band for secure fit',
      'Prevents hair breakage',
      'Reduces frizz',
      'Maintains hairstyles'
    ],
    benefits: [
      'Protects hair while sleeping',
      'Reduces morning frizz',
      'Maintains curl definition',
      'Prevents split ends',
      'Comfortable to wear'
    ],
    usage: 'Place over your hair before bed. Ensure it covers all hair and fits securely.',
    ingredients: '100% Satin Polyester'
  },
  4: {
    id: 4,
    name: 'Volume Powder',
    price: 15.00,
    category: 'Hair Care',
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Hair-Volume-Powder.jpeg',
    description: 'Texturizing powder for volume and hold',
    longDescription: 'This volumizing hair powder adds instant lift and texture to your hair. Perfect for creating volume at the roots, adding grip for updos, and creating textured, matte finishes. Ideal for fine hair that needs extra body and hold.',
    features: [
      'Instant volume boost',
      'Matte finish',
      'Easy to apply',
      'Long-lasting hold',
      'Suitable for all hair types'
    ],
    benefits: [
      'Adds instant volume',
      'Creates texture',
      'Provides grip for styling',
      'Matte, natural finish',
      'Easy to wash out'
    ],
    usage: 'Sprinkle at the roots and work through hair. Style as desired.',
    ingredients: 'Silica, Rice Starch, Fragrance'
  },
  5: {
    id: 5,
    name: 'Bold Impact – S',
    price: 479.00,
    originalPrice: 500.00,
    category: 'Hair Care',
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-01-at-6.04.07-PM.jpeg',
    description: 'Premium styling product for bold looks',
    longDescription: 'Bold Impact is a premium hair styling product designed for creating dramatic, bold hairstyles. This high-performance styling cream provides maximum hold while maintaining natural movement and shine. Perfect for creating statement looks and runway-worthy styles.',
    features: [
      'Maximum hold',
      'Natural shine finish',
      'Professional-grade formula',
      'Suitable for all hair types',
      'Long-lasting style'
    ],
    benefits: [
      'Creates bold, dramatic looks',
      'Strong, flexible hold',
      'Natural shine',
      'Professional results',
      'Versatile styling options'
    ],
    usage: 'Apply to damp or dry hair. Use more for stronger hold, less for natural movement.',
    ingredients: 'Petroleum, Beeswax, Fragrance, Preservatives'
  },
  6: {
    id: 6,
    name: 'Cologne (Baccarat Rouge)',
    price: 12.00,
    category: 'Fragrance',
    image: 'https://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213350.jpeg',
    description: 'Luxury cologne fragrance',
    longDescription: 'Inspired by the luxurious Baccarat Rouge 540, this premium cologne features a sophisticated blend of saffron, ambergris, and cedarwood. A unisex fragrance that exudes elegance and sophistication, perfect for the modern gentleman.',
    features: [
      'Luxury fragrance',
      'Unisex appeal',
      'Long-lasting scent',
      'Sophisticated blend',
      'Elegant packaging'
    ],
    benefits: [
      'Confidence-boosting scent',
      'Long-lasting fragrance',
      'Suitable for any occasion',
      'Sophisticated aroma',
      'Compliment-worthy'
    ],
    usage: 'Apply to pulse points: wrists, neck, and behind ears. Reapply as needed.',
    ingredients: 'Alcohol, Fragrance, Saffron, Ambergris, Cedarwood'
  },
  7: {
    id: 7,
    name: 'Sheen Spray',
    price: 20.00,
    category: 'Hair Care',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_132032.jpeg',
    description: 'Shine and hold spray',
    longDescription: 'Professional shine spray that adds lustrous shine and light hold to your hair. Perfect for finishing touches, adding gloss to styled hair, and creating that salon-perfect shine. Ideal for all hair types and styles.',
    features: [
      'High-shine finish',
      'Light hold',
      'Non-sticky formula',
      'Suitable for all hair types',
      'Professional results'
    ],
    benefits: [
      'Adds instant shine',
      'Lightweight hold',
      'Non-greasy finish',
      'Easy to apply',
      'Salon-quality results'
    ],
    usage: 'Spray evenly over styled hair from 8-10 inches away. Use sparingly for natural shine.',
    ingredients: 'Water, Alcohol, Silicone, Fragrance, Preservatives'
  },
  8: {
    id: 8,
    name: 'Olive Oil Mousse',
    price: 15.00,
    category: 'Hair Care',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_132102.jpeg',
    description: 'Nourishing hair mousse',
    longDescription: 'Rich olive oil mousse that provides moisture and volume while styling. This nourishing formula contains natural olive oil extracts that condition hair while providing flexible hold and natural movement.',
    features: [
      'Natural olive oil extracts',
      'Moisturizing formula',
      'Flexible hold',
      'Volume boost',
      'Natural ingredients'
    ],
    benefits: [
      'Deeply moisturizes hair',
      'Adds natural volume',
      'Flexible, natural hold',
      'Reduces frizz',
      'Nourishes while styling'
    ],
    usage: 'Apply to damp hair, starting from roots. Style as desired for volume and hold.',
    ingredients: 'Water, Olive Oil, Glycerin, Fragrance, Preservatives'
  },
  9: {
    id: 9,
    name: 'Oud Royal Aftershave',
    price: 25.00,
    category: 'Grooming',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213051.jpeg',
    description: 'Premium aftershave with oud fragrance',
    longDescription: 'Luxury aftershave featuring the rare and precious oud fragrance. This sophisticated blend soothes the skin after shaving while leaving a lasting, masculine scent. Perfect for the gentleman who appreciates fine fragrances.',
    features: [
      'Rare oud fragrance',
      'Skin soothing formula',
      'Long-lasting scent',
      'Alcohol-free',
      'Premium packaging'
    ],
    benefits: [
      'Soothes post-shave skin',
      'Luxurious oud scent',
      'Long-lasting fragrance',
      'Gentle on skin',
      'Sophisticated appeal'
    ],
    usage: 'Apply to clean, dry skin after shaving. Avoid eyes and broken skin.',
    ingredients: 'Water, Glycerin, Oud Extract, Aloe Vera, Fragrance'
  },
  10: {
    id: 10,
    name: 'Matte Pomade',
    price: 15.00,
    category: 'Hair Care',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_132128.jpeg',
    description: 'Matte finish hair pomade',
    longDescription: 'Professional matte pomade that provides strong hold with a natural, matte finish. Perfect for creating textured looks, quiffs, and modern hairstyles without the shine of traditional pomades.',
    features: [
      'Matte finish',
      'Strong hold',
      'Natural appearance',
      'Easy to wash out',
      'Suitable for all hair types'
    ],
    benefits: [
      'Natural, matte finish',
      'Strong, flexible hold',
      'No greasy residue',
      'Easy application',
      'Versatile styling'
    ],
    usage: 'Apply to dry hair and style as desired. Use more for stronger hold.',
    ingredients: 'Petroleum, Beeswax, Clay, Fragrance'
  },
  11: {
    id: 11,
    name: 'Clay Pomade',
    price: 15.00,
    category: 'Hair Care',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213008.jpeg',
    description: 'Natural clay-based pomade',
    longDescription: 'Natural clay pomade that provides excellent hold and texture while being gentle on hair. Made with natural clay extracts, this pomade creates defined, textured looks with a matte finish.',
    features: [
      'Natural clay formula',
      'Matte finish',
      'Strong hold',
      'Easy to wash out',
      'Natural ingredients'
    ],
    benefits: [
      'Natural ingredients',
      'Defined texture',
      'Strong hold',
      'Matte finish',
      'Gentle on hair'
    ],
    usage: 'Apply to dry hair and work through for desired texture and hold.',
    ingredients: 'Natural Clay, Beeswax, Coconut Oil, Fragrance'
  },
  12: {
    id: 12,
    name: 'Cologne Spray (Baccarat Rouge 540)',
    price: 25.00,
    category: 'Fragrance',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_212843.jpeg',
    description: 'Luxury cologne spray',
    longDescription: 'Premium cologne spray inspired by the iconic Baccarat Rouge 540. This sophisticated fragrance features notes of saffron, ambergris, and cedarwood, creating a luxurious scent that lasts throughout the day.',
    features: [
      'Luxury fragrance',
      'Long-lasting scent',
      'Sophisticated blend',
      'Elegant packaging',
      'Unisex appeal'
    ],
    benefits: [
      'Long-lasting fragrance',
      'Sophisticated scent',
      'Confidence booster',
      'Suitable for any occasion',
      'Compliment-worthy'
    ],
    usage: 'Spray on pulse points: wrists, neck, and behind ears. Reapply as needed.',
    ingredients: 'Alcohol, Fragrance, Saffron, Ambergris, Cedarwood'
  },
  13: {
    id: 13,
    name: 'Shine \'n Jam',
    price: 15.00,
    category: 'Hair Care',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_212936.jpeg',
    description: 'Shine and hold gel',
    longDescription: 'Professional shine gel that provides both hold and high-gloss shine. Perfect for creating sleek, polished looks, defined curls, and styles that need both structure and shine.',
    features: [
      'High-shine finish',
      'Strong hold',
      'Defines curls',
      'Sleek styling',
      'Professional results'
    ],
    benefits: [
      'High-gloss shine',
      'Strong, flexible hold',
      'Defines curls',
      'Sleek finish',
      'Professional styling'
    ],
    usage: 'Apply to damp hair and style as desired. Use more for stronger hold and shine.',
    ingredients: 'Water, PVP, Glycerin, Fragrance, Preservatives'
  },
  14: {
    id: 14,
    name: 'RedOne Red',
    price: 15.00,
    category: 'Hair Care',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_213008.jpeg',
    description: 'Red hair styling product',
    longDescription: 'Specialized styling product for red hair that enhances natural red tones while providing excellent hold and shine. Formulated to complement red hair colors and maintain vibrant tones.',
    features: [
      'Red hair enhancement',
      'Strong hold',
      'Natural shine',
      'Color-safe formula',
      'Vibrant results'
    ],
    benefits: [
      'Enhances red tones',
      'Strong hold',
      'Natural shine',
      'Color-safe',
      'Vibrant styling'
    ],
    usage: 'Apply to damp or dry hair and style as desired.',
    ingredients: 'Petroleum, Beeswax, Color Enhancers, Fragrance'
  },
  15: {
    id: 15,
    name: 'RedOne Black',
    price: 15.00,
    category: 'Hair Care',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/06/Photoroom_20250601_215833.jpeg',
    description: 'Black hair styling product',
    longDescription: 'Specialized styling product for black hair that provides excellent hold and shine while maintaining the natural beauty of black hair. Perfect for creating defined styles and maintaining hair health.',
    features: [
      'Black hair optimization',
      'Strong hold',
      'Natural shine',
      'Hair health focus',
      'Defined styling'
    ],
    benefits: [
      'Optimized for black hair',
      'Strong hold',
      'Natural shine',
      'Hair health',
      'Defined styles'
    ],
    usage: 'Apply to damp or dry hair and style as desired.',
    ingredients: 'Petroleum, Beeswax, Natural Oils, Fragrance'
  },
  
  // Services
  16: {
    id: 16,
    name: 'The Royal Treatment',
    price: 250.00,
    category: 'Services',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-10.jpg',
    description: 'Premium grooming service package',
    longDescription: 'Our most luxurious grooming experience, The Royal Treatment includes a premium haircut, hot towel treatment, beard trim and shape, facial treatment, and finishing touches. Perfect for special occasions or when you want the ultimate grooming experience.',
    features: [
      'Premium haircut and styling',
      'Hot towel treatment',
      'Beard trim and shape',
      'Facial treatment',
      'Finishing touches'
    ],
    benefits: [
      'Complete grooming experience',
      'Professional results',
      'Relaxing treatment',
      'Special occasion ready',
      'Premium service'
    ],
    usage: 'Book appointment online or call to schedule. Allow 90 minutes for complete service.',
    ingredients: 'Professional grooming services'
  },
  17: {
    id: 17,
    name: 'The Executive Cut',
    price: 150.00,
    category: 'Services',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-14-1.jpg',
    description: 'Executive haircut and styling',
    longDescription: 'Professional haircut and styling service designed for the modern executive. Includes consultation, precision cutting, styling, and finishing touches. Perfect for maintaining a professional appearance.',
    features: [
      'Professional consultation',
      'Precision cutting',
      'Professional styling',
      'Finishing touches',
      'Style advice'
    ],
    benefits: [
      'Professional appearance',
      'Precision results',
      'Style consultation',
      'Executive ready',
      'Quality service'
    ],
    usage: 'Book appointment online or call to schedule. Allow 60 minutes for service.',
    ingredients: 'Professional haircut and styling services'
  },
  18: {
    id: 18,
    name: 'Stempelkarte',
    price: 0.00,
    category: 'Services',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-18.jpg',
    description: 'Loyalty card for services',
    longDescription: 'Our loyalty program card that tracks your visits and rewards you for your loyalty. Earn stamps with each service and receive discounts on future visits. A great way to save while maintaining your style.',
    features: [
      'Loyalty tracking',
      'Reward system',
      'Discount benefits',
      'Easy tracking',
      'Customer appreciation'
    ],
    benefits: [
      'Save money on services',
      'Track your visits',
      'Earn rewards',
      'Customer appreciation',
      'Loyalty benefits'
    ],
    usage: 'Present card at each visit to earn stamps. Redeem for discounts.',
    ingredients: 'Loyalty program service'
  },
  19: {
    id: 19,
    name: 'E-Gutschein',
    price: 50.00,
    category: 'Services',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-17.jpg',
    description: 'Digital gift certificate',
    longDescription: 'Digital gift certificate perfect for gifting grooming services to friends and family. Can be used for any service or product in our salon. A thoughtful gift for the gentleman who appreciates quality grooming.',
    features: [
      'Digital delivery',
      'Flexible use',
      'Perfect gift',
      'Easy redemption',
      'No expiration'
    ],
    benefits: [
      'Perfect gift option',
      'Flexible spending',
      'Digital convenience',
      'No expiration',
      'Easy to use'
    ],
    usage: 'Purchase online and send to recipient. Redeem for any service or product.',
    ingredients: 'Digital gift certificate service'
  },
  
  // Barber Chairs
  20: {
    id: 20,
    name: 'Barbierstuhl in Mattgrau',
    price: 1200.00,
    originalPrice: 1350.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-6.jpg',
    description: 'Premium barber chair in matte gray',
    longDescription: 'Professional barber chair in elegant matte gray finish. Features hydraulic lift, reclining back, comfortable padding, and smooth operation. Perfect for professional barbershops and home use.',
    features: [
      'Hydraulic lift system',
      'Reclining back',
      'Comfortable padding',
      'Matte gray finish',
      'Smooth operation'
    ],
    benefits: [
      'Professional quality',
      'Comfortable for clients',
      'Durable construction',
      'Easy to operate',
      'Elegant appearance'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Steel frame, hydraulic system, premium padding, matte gray finish'
  },
  21: {
    id: 21,
    name: 'Barberstuhl in Dunkelbraun',
    price: 800.00,
    originalPrice: 1000.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-7.jpg',
    description: 'Classic barber chair in dark brown',
    longDescription: 'Classic barber chair in rich dark brown finish. Features traditional styling with modern comfort, hydraulic lift, and premium materials. Perfect for creating an authentic barbershop atmosphere.',
    features: [
      'Classic design',
      'Hydraulic lift',
      'Dark brown finish',
      'Comfortable seating',
      'Traditional styling'
    ],
    benefits: [
      'Authentic appearance',
      'Comfortable seating',
      'Durable construction',
      'Classic styling',
      'Professional quality'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Steel frame, hydraulic system, premium leather, dark brown finish'
  },
  22: {
    id: 22,
    name: 'Moderner Barberstuhl',
    price: 800.00,
    originalPrice: 1000.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-19.jpg',
    description: 'Modern design barber chair',
    longDescription: 'Contemporary barber chair with sleek modern design. Features clean lines, comfortable padding, hydraulic lift, and premium materials. Perfect for modern barbershops and contemporary spaces.',
    features: [
      'Modern design',
      'Hydraulic lift',
      'Comfortable padding',
      'Clean lines',
      'Premium materials'
    ],
    benefits: [
      'Contemporary styling',
      'Comfortable seating',
      'Professional quality',
      'Modern appearance',
      'Durable construction'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Steel frame, hydraulic system, premium padding, modern finish'
  },
  23: {
    id: 23,
    name: 'Barberstuhl in Antikbraun',
    price: 750.00,
    originalPrice: 1000.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Image-20.jpg',
    description: 'Antique style barber chair',
    longDescription: 'Antique-style barber chair with vintage appeal and modern comfort. Features classic design elements, hydraulic lift, and premium materials. Perfect for creating a nostalgic barbershop atmosphere.',
    features: [
      'Antique styling',
      'Hydraulic lift',
      'Vintage appeal',
      'Comfortable seating',
      'Classic design'
    ],
    benefits: [
      'Vintage appearance',
      'Comfortable seating',
      'Durable construction',
      'Nostalgic appeal',
      'Professional quality'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Steel frame, hydraulic system, premium leather, antique brown finish'
  },
  24: {
    id: 24,
    name: 'Schwarzer Barbierstuhl',
    price: 800.00,
    originalPrice: 1100.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224738.jpeg',
    description: 'Black professional barber chair',
    longDescription: 'Professional black barber chair with sleek design and premium features. Features hydraulic lift, comfortable padding, and elegant black finish. Perfect for modern barbershops.',
    features: [
      'Black finish',
      'Hydraulic lift',
      'Comfortable padding',
      'Professional design',
      'Smooth operation'
    ],
    benefits: [
      'Professional appearance',
      'Comfortable seating',
      'Durable construction',
      'Elegant styling',
      'Easy operation'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Steel frame, hydraulic system, premium padding, black finish'
  },
  25: {
    id: 25,
    name: 'Grey Metal Barbierstuhl',
    price: 950.00,
    originalPrice: 1200.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224715.jpeg',
    description: 'Metal barber chair in grey',
    longDescription: 'Modern metal barber chair in elegant grey finish. Features industrial design, hydraulic lift, and premium metal construction. Perfect for contemporary barbershops with industrial aesthetic.',
    features: [
      'Metal construction',
      'Grey finish',
      'Hydraulic lift',
      'Industrial design',
      'Durable materials'
    ],
    benefits: [
      'Industrial aesthetic',
      'Durable construction',
      'Modern appearance',
      'Professional quality',
      'Easy maintenance'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Metal frame, hydraulic system, premium padding, grey finish'
  },
  26: {
    id: 26,
    name: 'Classic Noir Barbierstuhl',
    price: 1200.00,
    originalPrice: 1450.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224550.jpeg',
    description: 'Classic noir barber chair',
    longDescription: 'Classic noir barber chair with timeless design and premium features. Features elegant black finish, hydraulic lift, and luxurious comfort. Perfect for upscale barbershops.',
    features: [
      'Classic noir design',
      'Hydraulic lift',
      'Luxurious comfort',
      'Elegant finish',
      'Premium materials'
    ],
    benefits: [
      'Timeless design',
      'Luxurious comfort',
      'Professional quality',
      'Elegant appearance',
      'Durable construction'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Steel frame, hydraulic system, premium leather, noir finish'
  },
  27: {
    id: 27,
    name: 'Throne Barbierstuhl',
    price: 950.00,
    originalPrice: 1200.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224648.jpeg',
    description: 'Throne-style barber chair',
    longDescription: 'Throne-style barber chair with regal design and premium comfort. Features elevated seating, hydraulic lift, and luxurious materials. Perfect for creating a premium barbershop experience.',
    features: [
      'Throne-style design',
      'Hydraulic lift',
      'Elevated seating',
      'Luxurious materials',
      'Premium comfort'
    ],
    benefits: [
      'Regal appearance',
      'Premium comfort',
      'Professional quality',
      'Luxurious experience',
      'Durable construction'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Steel frame, hydraulic system, premium materials, throne design'
  },
  28: {
    id: 28,
    name: 'Barbierstation',
    price: 2199.00,
    originalPrice: 2600.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_223024.jpeg',
    description: 'Complete barber station setup',
    longDescription: 'Complete barber station with chair, mirror, storage, and all necessary equipment. Features professional-grade materials, comprehensive storage, and complete setup for barbershop operations.',
    features: [
      'Complete setup',
      'Professional chair',
      'Mirror included',
      'Storage compartments',
      'Professional quality'
    ],
    benefits: [
      'Complete solution',
      'Professional setup',
      'Comprehensive storage',
      'Ready to use',
      'Professional quality'
    ],
    usage: 'Install according to manufacturer instructions. Complete setup for barbershop operations.',
    ingredients: 'Professional barber chair, mirror, storage units, complete station setup'
  },
  29: {
    id: 29,
    name: 'Premium Barbierstuhl',
    price: 1550.00,
    originalPrice: 1750.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_224635.jpeg',
    description: 'Premium quality barber chair',
    longDescription: 'Premium barber chair with the highest quality materials and features. Features luxury comfort, hydraulic lift, premium materials, and exceptional craftsmanship. Perfect for upscale barbershops.',
    features: [
      'Premium materials',
      'Hydraulic lift',
      'Luxury comfort',
      'Exceptional craftsmanship',
      'Professional quality'
    ],
    benefits: [
      'Luxury comfort',
      'Premium quality',
      'Professional appearance',
      'Durable construction',
      'Exceptional service'
    ],
    usage: 'Install according to manufacturer instructions. Regular maintenance recommended.',
    ingredients: 'Premium steel frame, hydraulic system, luxury materials, premium finish'
  },
  30: {
    id: 30,
    name: 'Waschsitz',
    price: 850.00,
    originalPrice: 1100.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_222839.jpeg',
    description: 'Wash basin chair',
    longDescription: 'Professional wash basin chair for hair washing services. Features comfortable reclining position, adjustable height, and professional design. Perfect for hair washing and treatment services.',
    features: [
      'Reclining design',
      'Adjustable height',
      'Comfortable padding',
      'Professional design',
      'Easy operation'
    ],
    benefits: [
      'Comfortable washing',
      'Professional service',
      'Easy operation',
      'Durable construction',
      'Professional quality'
    ],
    usage: 'Install according to manufacturer instructions. Use for hair washing services.',
    ingredients: 'Steel frame, hydraulic system, premium padding, professional design'
  },
  
  // Counters
  31: {
    id: 31,
    name: 'Big Small Counter',
    price: 1800.00,
    originalPrice: 2500.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_222818.jpeg',
    description: 'Large counter for barbershop',
    longDescription: 'Large professional counter unit for barbershop operations. Features ample storage, professional design, and durable construction. Perfect for organizing tools and products in a professional setting.',
    features: [
      'Large size',
      'Ample storage',
      'Professional design',
      'Durable construction',
      'Organized workspace'
    ],
    benefits: [
      'Organized workspace',
      'Professional appearance',
      'Ample storage',
      'Durable construction',
      'Professional quality'
    ],
    usage: 'Install according to manufacturer instructions. Organize tools and products.',
    ingredients: 'Steel frame, storage compartments, professional finish, durable materials'
  },
  32: {
    id: 32,
    name: 'Small Counter',
    price: 1250.00,
    originalPrice: 1500.00,
    category: 'Equipment',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250530_222749.jpeg',
    description: 'Compact counter unit',
    longDescription: 'Compact counter unit perfect for smaller barbershops or limited spaces. Features efficient storage, professional design, and space-saving construction. Ideal for organizing essential tools and products.',
    features: [
      'Compact design',
      'Efficient storage',
      'Professional appearance',
      'Space-saving',
      'Durable construction'
    ],
    benefits: [
      'Space efficient',
      'Professional appearance',
      'Organized storage',
      'Durable construction',
      'Professional quality'
    ],
    usage: 'Install according to manufacturer instructions. Organize essential tools and products.',
    ingredients: 'Steel frame, storage compartments, professional finish, compact design'
  },
  
  // Frames
  33: {
    id: 33,
    name: 'Compact Style – S',
    price: 369.00,
    originalPrice: 390.00,
    category: 'Frames',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-01-at-6.06.03-PM.jpeg',
    description: 'Small compact frame',
    longDescription: 'Small compact frame perfect for smaller spaces or minimalist designs. Features elegant styling, quality materials, and professional appearance. Ideal for creating a refined barbershop atmosphere.',
    features: [
      'Compact size',
      'Elegant design',
      'Quality materials',
      'Professional appearance',
      'Easy installation'
    ],
    benefits: [
      'Space efficient',
      'Elegant appearance',
      'Professional quality',
      'Easy installation',
      'Refined atmosphere'
    ],
    usage: 'Install according to manufacturer instructions. Mount securely to wall.',
    ingredients: 'Quality materials, elegant design, compact construction, professional finish'
  },
  34: {
    id: 34,
    name: 'Compact Style – M',
    price: 379.00,
    originalPrice: 400.00,
    category: 'Frames',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/Photoroom_20250428_235948-1.jpeg',
    description: 'Medium compact frame',
    longDescription: 'Medium compact frame with balanced proportions and elegant design. Features quality materials, professional appearance, and versatile styling. Perfect for medium-sized barbershops.',
    features: [
      'Medium size',
      'Balanced proportions',
      'Elegant design',
      'Quality materials',
      'Professional appearance'
    ],
    benefits: [
      'Balanced design',
      'Professional appearance',
      'Quality materials',
      'Versatile styling',
      'Professional quality'
    ],
    usage: 'Install according to manufacturer instructions. Mount securely to wall.',
    ingredients: 'Quality materials, elegant design, medium construction, professional finish'
  },
  35: {
    id: 35,
    name: 'Framed Elegance – M',
    price: 439.00,
    originalPrice: 460.00,
    category: 'Frames',
    image: 'http://xn--zribarberandbeauty-m6b.com/wp-content/uploads/2025/05/WhatsApp-Image-2025-05-01-at-6.05.01-PM.jpeg',
    description: 'Elegant medium frame',
    longDescription: 'Elegant medium frame with sophisticated design and premium materials. Features refined styling, quality construction, and professional appearance. Perfect for upscale barbershops.',
    features: [
      'Elegant design',
      'Medium size',
      'Premium materials',
      'Sophisticated styling',
      'Professional appearance'
    ],
    benefits: [
      'Elegant appearance',
      'Professional quality',
      'Premium materials',
      'Sophisticated design',
      'Professional atmosphere'
    ],
    usage: 'Install according to manufacturer instructions. Mount securely to wall.',
    ingredients: 'Premium materials, elegant design, sophisticated construction, professional finish'
  }
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCart, setShowCart] = useState(false)
  const { addToCart, cart } = useCart()

  const isInCart = (productId: number) => cart.some(item => item.id === productId)

  useEffect(() => {
    const productId = parseInt(params.id)
    const productData = productDatabase[productId as keyof typeof productDatabase]
    
    if (productData) {
      setProduct(productData)
    }
    setLoading(false)
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-zuri-dark flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-zuri-gold animate-spin" />
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-zuri-dark">
        <Navbar />
        <div className="container-custom py-12 text-center">
          <h1 className="text-2xl text-zuri-gold mb-4">Product not found</h1>
          <Link href="/products" className="text-zuri-light hover:text-zuri-gold">
            Back to Products
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zuri-dark">
      <Navbar />
      
      <div className="container-custom py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/products" className="flex items-center text-zuri-gold hover:text-white transition-colors duration-300">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Products
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square bg-zuri-gray rounded-xl overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* Header */}
            <div>
              <span className="text-zuri-light text-sm uppercase tracking-wide">
                {product.category}
              </span>
              <h1 className="text-4xl font-serif text-zuri-gold mt-2 mb-4">
                {product.name}
              </h1>
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-zuri-gold fill-current" />
                  ))}
                  <span className="text-zuri-light ml-2">(4.9/5)</span>
                </div>
                <span className="text-zuri-light">•</span>
                <span className="text-zuri-light">Premium Quality</span>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-4">
              {product.originalPrice ? (
                <>
                  <span className="text-3xl font-serif text-zuri-gold">
                    CHF {product.price}
                  </span>
                  <span className="text-xl line-through text-zuri-light/60">
                    CHF {product.originalPrice}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded text-sm">
                    Save CHF {(product.originalPrice - product.price).toFixed(2)}
                  </span>
                </>
              ) : (
                <span className="text-3xl font-serif text-zuri-gold">
                  CHF {product.price}
                </span>
              )}
            </div>

            {/* Quick Add to Cart */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (product) {
                  addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
                  setShowCart(true)
                  setTimeout(() => setShowCart(false), 2000)
                }
              }}
              disabled={isInCart(product.id)}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg ${
                isInCart(product.id)
                  ? 'bg-green-500 text-white cursor-default shadow-green-500/50'
                  : 'bg-gradient-to-r from-zuri-gold to-yellow-500 text-zuri-dark hover:from-yellow-400 hover:to-zuri-gold hover:shadow-zuri-gold/50 hover:scale-105'
              }`}
            >
              {isInCart(product.id) ? (
                <span className="flex items-center justify-center">
                  <Check className="w-5 h-5 mr-2" />
                  Added to Cart
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Add to Cart
                </span>
              )}
            </motion.button>

            {/* Description */}
            <div>
              <h3 className="text-xl font-serif text-zuri-gold mb-4">Description</h3>
              <p className="text-zuri-light leading-relaxed">
                {product.longDescription}
              </p>
            </div>

            {/* Features */}
            <div>
              <h3 className="text-xl font-serif text-zuri-gold mb-4">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-center text-zuri-light">
                    <Check className="w-5 h-5 text-zuri-gold mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            {/* Benefits */}
            <div>
              <h3 className="text-xl font-serif text-zuri-gold mb-4">Benefits</h3>
              <ul className="space-y-2">
                {product.benefits.map((benefit: string, index: number) => (
                  <li key={index} className="flex items-center text-zuri-light">
                    <Check className="w-5 h-5 text-zuri-gold mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Usage */}
            <div>
              <h3 className="text-xl font-serif text-zuri-gold mb-4">How to Use</h3>
              <p className="text-zuri-light leading-relaxed">
                {product.usage}
              </p>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-xl font-serif text-zuri-gold mb-4">Ingredients</h3>
              <p className="text-zuri-light leading-relaxed">
                {product.ingredients}
              </p>
            </div>

            {/* Add to Cart */}
            <div className="pt-6">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  if (product) {
                    addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
                    setShowCart(true)
                    setTimeout(() => setShowCart(false), 2000)
                  }
                }}
                disabled={isInCart(product.id)}
                className={`w-full py-6 px-8 rounded-2xl font-bold text-xl transition-all duration-300 shadow-2xl ${
                  isInCart(product.id)
                    ? 'bg-green-500 text-white cursor-default shadow-green-500/50'
                    : 'bg-gradient-to-r from-zuri-gold to-yellow-500 text-zuri-dark hover:from-yellow-400 hover:to-zuri-gold hover:shadow-zuri-gold/50 hover:scale-105'
                }`}
              >
                {isInCart(product.id) ? (
                  <span className="flex items-center justify-center">
                    <Check className="w-6 h-6 mr-3" />
                    Successfully Added to Cart
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 mr-3" />
                    Add to Cart
                  </span>
                )}
              </motion.button>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t border-zuri-gray">
              <div className="flex items-center text-zuri-light">
                <Truck className="w-5 h-5 text-zuri-gold mr-3" />
                <span className="text-sm">Free shipping</span>
              </div>
              <div className="flex items-center text-zuri-light">
                <Shield className="w-5 h-5 text-zuri-gold mr-3" />
                <span className="text-sm">30-day returns</span>
              </div>
              <div className="flex items-center text-zuri-light">
                <Check className="w-5 h-5 text-zuri-gold mr-3" />
                <span className="text-sm">Authentic product</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Cart Notification */}
      {showCart && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-8 right-8 bg-zuri-gold text-zuri-dark px-6 py-4 rounded-xl shadow-2xl z-50"
        >
          <div className="flex items-center space-x-3">
            <Check className="w-5 h-5" />
            <span className="font-medium">Added to cart!</span>
          </div>
        </motion.div>
      )}
    </div>
  )
} 
 