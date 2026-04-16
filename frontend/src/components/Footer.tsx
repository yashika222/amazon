"use client";

import Link from "next/link";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-amazon-nav mt-auto text-white">
      {/* Back to top button */}
      <div 
        onClick={scrollToTop} 
        className="bg-[#37475A] hover:bg-[#485769] w-full py-4 text-center text-sm font-medium cursor-pointer transition-colors"
      >
        Back to top
      </div>

      <div className="max-w-screen-xl mx-auto py-10 px-4 md:px-10 lg:px-20 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="flex flex-col gap-2">
          <h3 className="font-bold mb-2">Get to Know Us</h3>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Careers</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Blog</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">About Amazon</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Investor Relations</Link>
        </div>
        
        <div className="flex flex-col gap-2">
          <h3 className="font-bold mb-2">Make Money with Us</h3>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Sell products on Amazon</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Sell on Amazon Business</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Become an Affiliate</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Advertise Your Products</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold mb-2">Amazon Payment Products</h3>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Amazon Business Card</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Shop with Points</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Reload Your Balance</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Amazon Currency Converter</Link>
        </div>

        <div className="flex flex-col gap-2">
          <h3 className="font-bold mb-2">Let Us Help You</h3>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Amazon and COVID-19</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Your Account</Link>
          <Link href="/orders" className="text-sm text-gray-300 hover:underline">Your Orders</Link>
          <Link href="#" className="text-sm text-gray-300 hover:underline">Shipping Rates & Policies</Link>
          <Link href="/customer-service" className="text-sm text-gray-300 hover:underline">Help</Link>
        </div>
      </div>

      <div className="border-t border-gray-600/50 py-8 flex flex-col items-center justify-center">
        <Link href="/" className="mb-4">
          <span className="text-2xl font-bold font-serif tracking-tighter">amazon</span>
          <span className="text-sm font-normal -mt-2 ml-[2px]">clone</span>
        </Link>
        <div className="flex text-xs text-gray-300 gap-4 mb-2">
           <Link href="#" className="hover:underline">Conditions of Use</Link>
           <Link href="#" className="hover:underline">Privacy Notice</Link>
           <Link href="#" className="hover:underline">Consumer Health Data Privacy Disclosure</Link>
           <Link href="#" className="hover:underline">Your Ads Privacy Choices</Link>
        </div>
        <p className="text-xs text-gray-300">© 2026, Amazon Clone. This is a portfolio project.</p>
      </div>
    </footer>
  );
}
