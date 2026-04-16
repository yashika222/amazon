"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, MapPin } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const router = useRouter();
  const { cartCount } = useCart();
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim() && category === "All") {
      router.push("/");
      return;
    }
    
    const params = new URLSearchParams();
    const term = searchTerm.trim().toLowerCase();
    
    // Synonym mapping to fix "clothes" returning nothing (redirect to Fashion category mapping)
    if (["clothes", "clothing", "apparel", "wear", "shoes", "fashion", "garments"].includes(term) && category === "All") {
      params.append('category', 'Fashion');
    } else {
      if (term) params.append('search', searchTerm.trim());
      if (category !== "All") params.append('category', category);
    }
    
    router.push(`/?${params.toString()}`);
  };

  const handleCategoryNav = (cat: string) => {
    router.push(`/?category=${encodeURIComponent(cat)}`);
  };

  return (
    <header className="bg-amazon-nav text-white sticky top-0 z-50">
      {/* Top Nav */}
      <div className="flex items-center justify-between p-2 h-[60px]">
        {/* Logo */}
        <Link href="/" className="nav-link pt-2 flex items-center">
          <span className="text-2xl font-bold font-serif tracking-tighter">amazon</span>
          <span className="text-sm font-normal -mt-2 ml-[2px]">clone</span>
        </Link>

        {/* Address */}
        <Link href="/?modal=location" className="hidden sm:flex nav-link flex-col items-start px-2 cursor-pointer">
          <span className="text-xs text-gray-300 ml-5">Delivering to User</span>
          <div className="flex items-center font-bold text-sm">
            <MapPin size={16} className="mr-1" /> Update location
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="flex flex-1 mx-4 h-10 rounded-md overflow-hidden bg-white">
          <select 
             value={category}
             onChange={(e) => setCategory(e.target.value)}
             className="bg-gray-100 text-black px-2 border-r border-gray-300 outline-none w-16 md:w-auto text-sm cursor-pointer hover:bg-gray-200"
          >
            <option value="All">All</option>
            <option value="Electronics">Electronics</option>
            <option value="Fashion">Fashion</option>
            <option value="Home">Home</option>
            <option value="Books">Books</option>
            <option value="Toys">Toys</option>
          </select>
          <input 
            type="text" 
            placeholder="Search Amazon"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 text-black px-3 outline-none w-full"
          />
          <button type="submit" className="bg-amazon-yellow px-4 hover:bg-[#f3a847] flex items-center justify-center transition-colors object-contain cursor-pointer text-black">
            <Search size={20} />
          </button>
        </form>

        {/* Right Nav Options */}
        <div className="flex items-center gap-2">
          <Link href="/?modal=signin" className="hidden md:flex nav-link flex-col items-start px-2 cursor-pointer">
            <span className="text-xs">Hello, sign in</span>
            <span className="text-sm font-bold">Account & Lists</span>
          </Link>

          <Link href="/orders" className="hidden md:flex nav-link flex-col items-start px-2 cursor-pointer">
            <span className="text-xs">Returns</span>
            <span className="text-sm font-bold">& Orders</span>
          </Link>

          <Link href="/cart" className="nav-link flex items-end relative px-2">
            <div className="relative flex items-center">
              <ShoppingCart size={32} />
              <span className="absolute -top-1 left-4 text-amazon-yellow font-bold text-center w-full">{cartCount}</span>
            </div>
            <span className="text-sm font-bold hidden md:inline ml-1 mt-3">Cart</span>
          </Link>
        </div>
      </div>

      {/* Bottom Nav */}
      <div className="bg-amazon-light_blue flex items-center p-2 text-sm gap-4 overflow-x-auto whitespace-nowrap hide-scroll">
        <span className="nav-link font-bold px-2 cursor-pointer" onClick={() => router.push('/')}>☰ All</span>
        <span className="nav-link px-2 cursor-pointer" onClick={() => router.push('/?category=Electronics')}>Today&apos;s Deals</span>
        <span className="nav-link px-2 cursor-pointer" onClick={() => router.push('/customer-service')}>Customer Service</span>
        <span className="nav-link px-2 cursor-pointer" onClick={() => router.push('/registry')}>Registry</span>
        <span className="nav-link px-2 cursor-pointer" onClick={() => router.push('/gift-cards')}>Gift Cards</span>
        <span className="nav-link px-2 cursor-pointer" onClick={() => router.push('/sell')}>Sell</span>
        {/* Dynamic categories linking */}
        <span className="nav-link px-2 cursor-pointer" onClick={() => handleCategoryNav("Electronics")}>Electronics</span>
        <span className="nav-link px-2 cursor-pointer" onClick={() => handleCategoryNav("Fashion")}>Fashion</span>
      </div>
    </header>
  );
}
