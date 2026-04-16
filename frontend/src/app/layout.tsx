import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CartProvider } from '../context/CartContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Amazon Clone',
  description: 'A complete full stack Amazon clone built with Next.js and Prisma',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <CartProvider>
          <Navbar />
          <main className="flex-1 bg-amazon-background">
             {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
