# Zuri Barber and Beauty - Website

A sleek and modern website for Zuri Barber and Beauty, a premium barbershop brand in Zurich. Built with Next.js, TypeScript, TailwindCSS, and Framer Motion.

## Features

### 🎨 Design
- **Black & Gold Theme**: Premium black background with elegant gold accents
- **Responsive Design**: Fully responsive for desktop and mobile devices
- **Modern Typography**: Elegant serif fonts for headings, clean sans-serif for body text
- **Smooth Animations**: Framer Motion powered animations throughout

### 📱 Sections
1. **Hero Section**: Full-screen landing with CTA buttons for both locations
2. **Booking Section**: Two Zurich locations with Google Maps integration
3. **Products Section**: Mini shop with cart functionality
4. **About Section**: Company story, values, and team information
5. **Footer**: Social media links, contact info, and quick navigation

### 🚀 Technical Features
- **Loading Animation**: Custom barber pole spinner on initial load
- **Smooth Scrolling**: Navigation with smooth scroll behavior
- **Interactive Elements**: Hover effects and micro-interactions
- **Cart Functionality**: Mock shopping cart with notifications
- **Google Maps Integration**: Embedded maps for both locations

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS with custom design system
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Playfair Display, Inter)

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd zuri-barber-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
zuri-barber-website/
├── app/
│   ├── globals.css          # Global styles and TailwindCSS
│   ├── layout.tsx           # Root layout component
│   └── page.tsx             # Main page component
├── components/
│   ├── LoadingSpinner.tsx   # Initial loading animation
│   ├── Navbar.tsx           # Navigation component
│   ├── HeroSection.tsx      # Hero section with CTAs
│   ├── BookingSection.tsx   # Location booking section
│   ├── ProductsSection.tsx  # Product shop section
│   ├── AboutSection.tsx     # About and values section
│   └── Footer.tsx           # Footer component
├── tailwind.config.js       # TailwindCSS configuration
├── next.config.js           # Next.js configuration
├── package.json             # Dependencies and scripts
└── README.md               # This file
```

## Customization

### Colors
The design system uses custom colors defined in `tailwind.config.js`:
- `zuri-gold`: #D4AF37 (Primary accent)
- `zuri-dark`: #0A0A0A (Background)
- `zuri-gray`: #1A1A1A (Secondary background)
- `zuri-light`: #F5F5F5 (Text)

### Fonts
- **Serif**: Playfair Display (Headings)
- **Sans**: Inter (Body text)

### Animations
Custom animations are defined in `tailwind.config.js`:
- `fade-in`: Opacity animation
- `slide-up`: Slide up with opacity
- `barber-pole`: Rotating barber pole effect

## Features in Detail

### Loading Animation
- Custom barber pole spinner with rotating stripes
- Fade-in logo and loading text
- 2-second loading simulation

### Navigation
- Fixed navbar with scroll-based background
- Mobile-responsive hamburger menu
- Smooth scroll to sections

### Hero Section
- Full-screen design with gradient background
- Large typography with brand name
- Two CTA buttons for different locations
- Animated scroll indicator

### Booking Section
- Two location cards with contact info
- Google Maps embeds (placeholder URLs)
- Working hours and contact details
- Responsive grid layout

### Products Section
- Grid of product cards
- Interactive cart functionality
- Add to cart animations
- Cart notification system

### About Section
- Company story and values
- Team image placeholder
- Statistics display
- Animated value icons

### Footer
- Social media links
- Contact information
- Quick navigation links
- Business hours

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Performance

- Optimized images and animations
- Lazy loading for maps
- Efficient component structure
- Minimal bundle size

## Future Enhancements

- Real booking system integration
- E-commerce functionality
- Blog section
- Customer testimonials
- Gallery of work
- Online payment integration

## License

This project is created for Zuri Barber and Beauty. All rights reserved.

---

**Built with ❤️ for Zuri Barber and Beauty** 