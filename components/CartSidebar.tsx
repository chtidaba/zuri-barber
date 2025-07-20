import { useCart } from './CartContext'
import { X, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function CartSidebar({ open, onClose }: { open: boolean, onClose: () => void }) {
  const { cart, removeFromCart, updateQuantity } = useCart()
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className={`fixed top-0 right-0 h-full w-96 bg-zuri-dark shadow-2xl z-50 transform transition-transform duration-300 ${open ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex items-center justify-between p-6 border-b border-zuri-gold">
        <h2 className="text-2xl font-serif text-zuri-gold">Your Cart</h2>
        <button onClick={onClose}><X className="w-6 h-6 text-zuri-gold" /></button>
      </div>
      <div className="p-6 flex-1 overflow-y-auto">
        {cart.length === 0 ? (
          <div className="text-zuri-light text-center mt-16">Your cart is empty.</div>
        ) : (
          <div className="space-y-6">
            {cart.map(item => (
              <div key={item.id} className="flex items-center gap-4 border-b border-zuri-gray pb-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
                <div className="flex-1">
                  <div className="text-zuri-gold font-semibold">{item.name}</div>
                  <div className="text-zuri-light">CHF {item.price} x </div>
                  <input type="number" min={1} value={item.quantity} onChange={e => updateQuantity(item.id, Number(e.target.value))} className="w-16 px-2 py-1 rounded bg-zuri-gray text-zuri-gold border border-zuri-gold mt-1" />
                </div>
                <button onClick={() => removeFromCart(item.id)}><Trash2 className="w-5 h-5 text-red-500" /></button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="p-6 border-t border-zuri-gold">
        <div className="flex justify-between text-lg text-zuri-gold mb-4">
          <span>Total</span>
          <span>CHF {total.toFixed(2)}</span>
        </div>
        <Link href="/checkout" className="block w-full text-center bg-zuri-gold text-zuri-dark font-bold py-3 rounded-xl hover:bg-white transition-all duration-200 disabled:opacity-50" tabIndex={cart.length === 0 ? -1 : 0} aria-disabled={cart.length === 0} style={{ pointerEvents: cart.length === 0 ? 'none' : 'auto' }}>
          Proceed to Checkout
        </Link>
      </div>
    </div>
  )
} 