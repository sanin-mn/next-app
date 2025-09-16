'use client';

import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-800 p-4 text-white flex justify-between">
      <div className="flex space-x-4">
        <Link href="/">
          <div className="hover:underline">Products</div>
        </Link>
        {user && (
          <>
            <Link href="/cart">
              <div className="hover:underline">Cart</div>
            </Link>
            <Link href="/orders">
              <div className="hover:underline">Orders</div>
            </Link>
          </>
        )}
      </div>
      <div>
        {user ? (
          <button onClick={logout} className="hover:underline">
            Logout
          </button>
        ) : (
          <Link href="/login">
            <div className="hover:underline">Login</div>
          </Link>
        )}
      </div>
    </nav>
  );
}