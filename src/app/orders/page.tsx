'use client';

import { useEffect, useState } from 'react';
import ProtectedRoute from '../protected/page';
import { useAuth } from '../context/AuthContext';

function OrdersPageContent() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/orders/list.php', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch orders.');
        }

        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold mb-6">Your Orders</h1>
      {orders.length === 0 ? (
        <p>You have no past orders.</p>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="border rounded-lg p-6 shadow-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Order #{order.id}</h2>
                <span className="text-xl font-bold text-green-600">${order.total}</span>
              </div>
              <p className="text-gray-600 mb-2">Order placed on: {new Date(order.created_at).toLocaleDateString()}</p>
              <p className="text-gray-600 mb-4">Shipping to: {order.address}</p>
              
              <h3 className="text-lg font-medium mb-2">Items:</h3>
              <ul className="list-disc list-inside space-y-2">
                {order.items.map((item, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span>{item.product_name} x {item.quantity}</span>
                    <span>${(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersPageContent />
    </ProtectedRoute>
  );
}