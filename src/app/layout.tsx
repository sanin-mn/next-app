import './globals.css';
import { AuthProvider } from './context/AuthContext';
import Navbar from '../app/components/Navbar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}