"use client";
import { useCart } from '@/components/CartContext';
import Navbar from '@/components/Navbar';
import { Check, MapPin } from 'lucide-react';
import Link from 'next/link';
import { useState, useRef } from 'react';

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const [fields, setFields] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    addressSearch: '',
    street: '',
    streetNumber: '',
    zip: '',
    city: '',
    country: '',
    notes: '',
  });
  const [touched, setTouched] = useState<{[k: string]: boolean}>({});
  const [addressSuggestions, setAddressSuggestions] = useState<any[]>([]);
  const [addressLoading, setAddressLoading] = useState(false);
  const addressTimeout = useRef<NodeJS.Timeout | null>(null);

  const errors = {
    firstName: !fields.firstName ? 'First name is required' : '',
    lastName: !fields.lastName ? 'Last name is required' : '',
    email: !fields.email ? 'Email is required' : !validateEmail(fields.email) ? 'Invalid email' : '',
    phone: !fields.phone ? 'Phone is required' : '',
    street: !fields.street ? 'Street is required' : '',
    streetNumber: !fields.streetNumber ? 'Number is required' : '',
    zip: !fields.zip ? 'ZIP code is required' : '',
    city: !fields.city ? 'City is required' : '',
    country: !fields.country ? 'Country is required' : '',
    addressCH: fields.country && fields.country !== 'Switzerland' ? 'Address must be in Switzerland' : '',
  };
  const isValid = Object.values(errors).every(e => !e);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFields(f => ({ ...f, [e.target.name]: e.target.value }));
    if (e.target.name === 'addressSearch') {
      if (addressTimeout.current) clearTimeout(addressTimeout.current);
      const value = e.target.value;
      setAddressLoading(true);
      addressTimeout.current = setTimeout(async () => {
        if (value.length < 3) {
          setAddressSuggestions([]);
          setAddressLoading(false);
          return;
        }
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&countrycodes=ch&q=${encodeURIComponent(value)}`);
        const data = await res.json();
        setAddressSuggestions(data);
        setAddressLoading(false);
      }, 400);
    }
  }
  function handleBlur(e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setTouched(t => ({ ...t, [e.target.name]: true }));
  }
  function handleSuggestionClick(suggestion: any) {
    const address = suggestion.address || {};
    setFields(f => ({
      ...f,
      addressSearch: suggestion.display_name,
      street: address.road || '',
      streetNumber: address.house_number || '',
      zip: address.postcode || '',
      city: address.city || address.town || address.village || '',
      country: address.country || '',
    }));
    setAddressSuggestions([]);
  }

  return (
    <div className="min-h-screen bg-zuri-dark">
      <Navbar />
      <div className="container-custom py-12">
        <h1 className="text-4xl font-serif text-zuri-gold mb-12 text-center tracking-tight">Checkout</h1>
        {cart.length === 0 ? (
          <div className="text-center text-zuri-light text-xl py-24">
            Your cart is empty.<br />
            <Link href="/products" className="text-zuri-gold underline">Continue Shopping</Link>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto bg-zuri-gray/90 rounded-2xl p-10 shadow-2xl flex flex-col md:flex-row gap-12">
            {/* Order Summary */}
            <div className="md:w-1/2 w-full">
              <h2 className="text-2xl font-serif text-zuri-gold mb-6 text-center md:text-left">Order Summary</h2>
              <ul className="divide-y divide-zuri-dark mb-8">
                {cart.map(item => (
                  <li key={item.id} className="flex items-center gap-4 py-5">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover shadow-lg border-2 border-zuri-gold/20" />
                    <div className="flex-1">
                      <div className="text-zuri-gold font-semibold text-lg">{item.name}</div>
                      <div className="text-zuri-light text-sm">CHF {item.price} x {item.quantity}</div>
                    </div>
                    <div className="text-zuri-gold font-bold text-lg">CHF {(item.price * item.quantity).toFixed(2)}</div>
                  </li>
                ))}
              </ul>
              <div className="flex justify-between text-xl font-bold text-zuri-gold mb-8 border-t border-zuri-gold pt-6">
                <span>Total</span>
                <span>CHF {total.toFixed(2)}</span>
              </div>
            </div>
            {/* Customer Info Form */}
            <div className="md:w-1/2 w-full">
              <h2 className="text-2xl font-serif text-zuri-gold mb-6 text-center md:text-left">Your Information</h2>
              <form className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="col-span-1">
                  <label className="block text-zuri-gold mb-2 font-medium">First Name</label>
                  <input
                    name="firstName"
                    value={fields.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.firstName && touched.firstName ? 'border-red-400' : 'border-zuri-gold'}`}
                  />
                  {touched.firstName && errors.firstName && <div className="text-red-400 text-xs mt-1 font-medium">{errors.firstName}</div>}
                </div>
                <div className="col-span-1">
                  <label className="block text-zuri-gold mb-2 font-medium">Last Name</label>
                  <input
                    name="lastName"
                    value={fields.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.lastName && touched.lastName ? 'border-red-400' : 'border-zuri-gold'}`}
                  />
                  {touched.lastName && errors.lastName && <div className="text-red-400 text-xs mt-1 font-medium">{errors.lastName}</div>}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-zuri-gold mb-2 font-medium">Email</label>
                  <input
                    name="email"
                    value={fields.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.email && touched.email ? 'border-red-400' : 'border-zuri-gold'}`}
                  />
                  {touched.email && errors.email && <div className="text-red-400 text-xs mt-1 font-medium">{errors.email}</div>}
                </div>
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-zuri-gold mb-2 font-medium">Phone</label>
                  <input
                    name="phone"
                    value={fields.phone}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.phone && touched.phone ? 'border-red-400' : 'border-zuri-gold'}`}
                  />
                  {touched.phone && errors.phone && <div className="text-red-400 text-xs mt-1 font-medium">{errors.phone}</div>}
                </div>
                {/* Adresse détaillée avec autocomplétion */}
                <div className="col-span-1 md:col-span-2 relative">
                  <label className="block text-zuri-gold mb-2 font-medium flex items-center gap-2"><MapPin className="w-5 h-5" /> Address (Switzerland only)</label>
                  <input
                    name="addressSearch"
                    autoComplete="off"
                    value={fields.addressSearch}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.street && touched.street ? 'border-red-400' : 'border-zuri-gold'}`}
                    placeholder="Start typing your address..."
                  />
                  {addressLoading && <div className="absolute left-0 right-0 bg-zuri-dark text-zuri-gold text-sm px-4 py-2 rounded-b-lg shadow-lg z-20">Searching...</div>}
                  {addressSuggestions.length > 0 && (
                    <ul className="absolute left-0 right-0 bg-zuri-dark border border-zuri-gold rounded-b-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                      {addressSuggestions.map((s, idx) => (
                        <li
                          key={s.place_id}
                          className="px-4 py-2 hover:bg-zuri-gold/20 cursor-pointer text-zuri-light text-sm"
                          onMouseDown={() => handleSuggestionClick(s)}
                        >
                          {s.display_name}
                        </li>
                      ))}
                    </ul>
                  )}
                  {touched.street && errors.addressCH && <div className="text-red-400 text-xs mt-1 font-medium">{errors.addressCH}</div>}
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-zuri-gold mb-2 font-medium">Street</label>
                    <input
                      name="street"
                      value={fields.street}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.street && touched.street ? 'border-red-400' : 'border-zuri-gold'}`}
                    />
                    {touched.street && errors.street && <div className="text-red-400 text-xs mt-1 font-medium">{errors.street}</div>}
                  </div>
                  <div>
                    <label className="block text-zuri-gold mb-2 font-medium">Number</label>
                    <input
                      name="streetNumber"
                      value={fields.streetNumber}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.streetNumber && touched.streetNumber ? 'border-red-400' : 'border-zuri-gold'}`}
                    />
                    {touched.streetNumber && errors.streetNumber && <div className="text-red-400 text-xs mt-1 font-medium">{errors.streetNumber}</div>}
                  </div>
                </div>
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-zuri-gold mb-2 font-medium">ZIP</label>
                    <input
                      name="zip"
                      value={fields.zip}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.zip && touched.zip ? 'border-red-400' : 'border-zuri-gold'}`}
                    />
                    {touched.zip && errors.zip && <div className="text-red-400 text-xs mt-1 font-medium">{errors.zip}</div>}
                  </div>
                  <div>
                    <label className="block text-zuri-gold mb-2 font-medium">City</label>
                    <input
                      name="city"
                      value={fields.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.city && touched.city ? 'border-red-400' : 'border-zuri-gold'}`}
                    />
                    {touched.city && errors.city && <div className="text-red-400 text-xs mt-1 font-medium">{errors.city}</div>}
                  </div>
                  <div>
                    <label className="block text-zuri-gold mb-2 font-medium">Country</label>
                    <input
                      name="country"
                      value={fields.country}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all ${errors.country && touched.country ? 'border-red-400' : 'border-zuri-gold'}`}
                    />
                    {touched.country && errors.country && <div className="text-red-400 text-xs mt-1 font-medium">{errors.country}</div>}
                  </div>
                </div>
                {/* Notes optionnelles */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-zuri-gold mb-2 font-medium">Notes (optional)</label>
                  <textarea
                    name="notes"
                    value={fields.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-5 py-3 rounded-lg bg-zuri-dark text-zuri-light border-2 border-zuri-gold focus:outline-none focus:ring-2 focus:ring-zuri-gold/30 transition-all"
                    rows={2}
                  />
                </div>
              </form>
              <button
                className="w-full py-5 rounded-2xl bg-gradient-to-r from-zuri-gold to-yellow-400 text-zuri-dark font-extrabold text-xl shadow-lg hover:from-yellow-400 hover:to-zuri-gold transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
                disabled={!isValid}
                onClick={() => alert('Payment coming soon!')}
              >
                <Check className="w-7 h-7" />
                Pay Now
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 