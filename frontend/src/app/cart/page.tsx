"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Product } from "../../components/ProductCard";
import { useCart } from "../../context/CartContext";
import { getRealisticImage } from "../../lib/getImage";

interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  quantity: number;
  product: Product;
}

interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { refreshCart } = useCart();

  const fetchCart = async () => {
    try {
      const res = await API.get("/cart");
      setCart(res.data);
    } catch (error) {
      console.error("Failed to fetch cart", error);
      setError("Backend not connected");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    try {
      if (newQuantity <= 0) {
        await removeItem(cartItemId);
        return;
      }
      await API.put("/cart/update", { cartItemId, quantity: newQuantity });
      fetchCart();
      refreshCart();
    } catch (error) {
      console.error("Error updating quantity", error);
      alert("Backend not connected");
    }
  };

  const removeItem = async (cartItemId: string) => {
    try {
      await API.delete("/cart/remove", { data: { cartItemId } });
      fetchCart();
      refreshCart();
    } catch (error) {
      console.error("Error removing item", error);
      alert("Backend not connected");
    }
  };

  if (error) return <div className="p-10 font-bold max-w-screen-xl mx-auto text-red-500">{error}</div>;
  if (loading) return <div className="p-10 font-bold max-w-screen-xl mx-auto">Loading cart...</div>;

  const cartItems = cart?.items || [];
  const subtotal = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const count = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="lg:flex max-w-screen-2xl mx-auto md:p-4 gap-4">
        
        {/* Left - Cart Items */}
        <div className="flex-grow m-4 md:m-0 shadow-sm rounded-sm">
          <div className="flex flex-col p-5 bg-white mb-5 rounded-sm">
             <h1 className="text-3xl border-b pb-4 mb-4 font-normal">Shopping Cart</h1>
             {cartItems.length === 0 && (
                <div className="p-5">
                   <h2 className="text-xl font-medium mb-2">Your Amazon Cart is empty.</h2>
                   <Link href="/" className="text-blue-500 hover:text-orange-500 hover:underline">Shop today&apos;s deals</Link>
                </div>
             )}

             {cartItems.map((item, i) => (
                <div key={item.id} className={`flex flex-col md:flex-row gap-6 p-4 ${i !== cartItems.length - 1 ? 'border-b border-gray-200' : ''}`}>
                  {/* Image */}
                  <div className="relative w-full md:w-48 h-48">
                     {item.product.images[0] ? (
                        <img src={getRealisticImage(item.product.title, item.product.images[0])} alt={item.product.title} className="object-contain w-full h-full absolute top-0 left-0" />
                     ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
                     )}
                  </div>
                  
                  {/* Info */}
                  <div className="flex-1 flex flex-col pt-1">
                     <p className="text-lg md:text-xl font-medium text-black line-clamp-2 md:w-3/4 mb-1">
                       <Link href={`/product/${item.productId}`} className="hover:text-orange-500 hover:underline">{item.product.title}</Link>
                     </p>
                     <p className="text-sm text-green-700 font-medium mb-1">In Stock</p>
                     <div className="flex items-center gap-4 text-xs mt-2 font-medium">
                       <select 
                         className="p-1 px-2 border border-gray-300 rounded-md shadow-sm outline-none bg-gray-100 hover:bg-gray-200 cursor-pointer"
                         value={item.quantity}
                         onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                       >
                         {Array(10).fill(0).map((_, idx) => (
                           <option key={idx} value={idx + 1}>Qty: {idx + 1}</option>
                         ))}
                       </select>
                       <span className="text-gray-300">|</span>
                       <button onClick={() => removeItem(item.id)} className="text-blue-500 hover:underline hover:text-orange-500">Delete</button>
                       <span className="text-gray-300">|</span>
                       <button className="text-blue-500 hover:underline hover:text-orange-500">Save for later</button>
                     </div>
                  </div>

                  {/* Price */}
                  <div className="hidden md:flex flex-col items-end">
                     <span className="text-lg font-bold">${item.product.price.toFixed(2)}</span>
                  </div>
                </div>
             ))}

             {cartItems.length > 0 && (
               <div className="flex justify-end pt-4 font-normal text-lg">
                 Subtotal ({count} items): <span className="font-bold ml-2">${subtotal.toFixed(2)}</span>
               </div>
             )}
          </div>
        </div>

        {/* Right - Total & Checkout */}
        <div className="flex flex-col bg-white p-5 shadow-sm rounded-sm mb-5 h-min m-4 md:m-0 w-full lg:w-80 border border-gray-200">
           {cartItems.length > 0 ? (
             <>
               <div className="flex items-center gap-2 text-sm text-green-700 mb-4">
                 <span className="p-1 bg-green-700 text-white rounded-full text-xs h-4 w-4 flex items-center justify-center">✓</span>
                 Your order qualifies for FREE Shipping.
               </div>
               <h2 className="text-lg font-normal whitespace-nowrap mb-4">
                 Subtotal ({count} items): <span className="font-bold ml-1">${subtotal.toFixed(2)}</span>
               </h2>
               <button 
                 disabled={cartItems.length === 0} 
                 onClick={() => router.push('/checkout')}
                 className="btn-yellow w-full rounded-md py-2 shadow-md">
                 Proceed to Checkout
               </button>
             </>
           ) : (
             <h2 className="text-lg">No items in your cart.</h2>
           )}
        </div>
      </main>
    </div>
  );
}
