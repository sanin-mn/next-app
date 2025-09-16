'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '../protected/page';
import { useAuth } from '../context/AuthContext';

function CartPageContent() {
  const { token } = useAuth();
  const router = useRouter();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/cart/view.php', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch cart.');
        }

        const data = await res.json();
        setCart(data.cart || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchCart();
    }
  }, [token]);

const handleCheckout = async () => {
  setCheckoutLoading(true);
  setCheckoutError(null);

  const formData = new URLSearchParams();
  formData.append('address', '123 Main St, Anytown, USA');
  formData.append('latitude', '40.712776');
  formData.append('longitude', '-74.005974');

  try {
    const res = await fetch('/api/checkout/checkout.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Bearer ${token}`,
      },
      body: formData.toString(),
    });

    const data = await res.json();
    if (res.ok) {
      alert('Purchase completed successfully!');
      router.push('/orders'); 
    } else {
      setCheckoutError(data.error || data.message || 'Checkout failed.');
    }
  } catch (err) {
    setCheckoutError('An error occurred during checkout.');
  } finally {
    setCheckoutLoading(false);
  }
};
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);

  if (loading) return <div className="p-8 text-center">Loading cart...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Your Cart</h1>
      {checkoutError && <p className="text-red-500 mb-4">{checkoutError}</p>}
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="flex items-center space-x-4 border-b pb-4">
                <img src={item.image} alt={item.product_name} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <p className="font-semibold">{item.product_name}</p>
                  <p className="text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <p className="text-lg font-bold">${(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-right">
            <h2 className="text-2xl font-bold">Total: ${total.toFixed(2)}</h2>
            <button
              onClick={handleCheckout}
              disabled={checkoutLoading || cart.length === 0}
              className="mt-4 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors disabled:bg-gray-400"
            >
              {checkoutLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function CartPage() {
  return (
    <ProtectedRoute>
      <CartPageContent />
    </ProtectedRoute>
  );
}