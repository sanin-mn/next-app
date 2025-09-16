// app/components/AddToCartButton.tsx

'use client';

import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function AddToCartButton({ productId }) {
  const { token, user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!user) {
      setMessage('Please log in to add items to your cart.');
      return;
    }

    setLoading(true);
    setMessage('');

    // Create a URL-encoded form data object
    const formData = new URLSearchParams();
    formData.append('product_id', productId);
    formData.append('quantity', '1'); // Assuming you're adding one item at a time

    try {
      const res = await fetch('/api/cart/add.php', {
        method: 'POST',
        // Set the Content-Type header to URL-encoded
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        // Send the URL-encoded string
        body: formData.toString(),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Product added to cart successfully!');
      } else {
        setMessage(data.error || data.message || 'Failed to add to cart.');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400"
      >
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
      {message && <p className="mt-4 text-sm">{message}</p>}
    </div>
  );
}