"use client";

import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });

  useEffect(() => {
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
    fetchCart();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post("/orders", formData);
      router.push(`/order-confirmation/${res.data.id}`);
    } catch (error) {
       console.error("Failed to place order", error);
       alert("Failed to place order. Backend not connected or server error.");
    }
  };

  if (error) return <div className="p-10 font-bold max-w-screen-xl mx-auto text-red-500">{error}</div>;
  if (loading) return <div className="p-10 font-bold max-w-screen-xl mx-auto">Loading checkout...</div>;
  if (!cart || cart.items.length === 0) return <div className="p-10 font-bold max-w-screen-xl mx-auto text-red-500">Cart is empty! Head back to home.</div>;

  const subtotal = cart.items.reduce((acc: number, item: any) => acc + (item.product.price * item.quantity), 0);

  return (
    <div className="bg-white min-h-screen">
      {/* Checkout Navbar */}
      <header className="flex items-center justify-center p-4 bg-gray-100 border-b">
         <span className="text-3xl font-bold font-serif -mt-2">amazon</span>
         <span className="text-2xl font-light text-gray-500 ml-4">Checkout</span>
      </header>

      <main className="max-w-screen-lg mx-auto p-4 md:grid md:grid-cols-3 gap-8 mt-4">
        
        {/* Left Side: Address Form */}
        <div className="md:col-span-2">
            <h2 className="text-2xl font-bold mb-4 text-[#c45500]">1. Shipping address</h2>
            <form id="checkout-form" onSubmit={handlePlaceOrder} className="flex flex-col gap-4 border p-6 rounded-md bg-gray-50 shadow-sm">
               <div>
                  <label className="block text-sm font-bold mb-1">Full name</label>
                  <input required name="fullName" value={formData.fullName} onChange={handleInputChange} type="text" className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-amazon-yellow" />
               </div>
               <div>
                  <label className="block text-sm font-bold mb-1">Address</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Street address or P.O. Box" className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-amazon-yellow mb-2" />
               </div>
               <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">City</label>
                    <input required name="city" value={formData.city} onChange={handleInputChange} type="text" className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-amazon-yellow" />
                 </div>
                 <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">State</label>
                    <input required name="state" value={formData.state} onChange={handleInputChange} type="text" className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-amazon-yellow" />
                 </div>
               </div>
               <div className="flex gap-4">
                 <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">ZIP / Pincode</label>
                    <input required name="pincode" value={formData.pincode} onChange={handleInputChange} type="text" className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-amazon-yellow" />
                 </div>
                 <div className="flex-1">
                    <label className="block text-sm font-bold mb-1">Phone number</label>
                    <input required name="phone" value={formData.phone} onChange={handleInputChange} type="text" className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:ring-1 focus:ring-amazon-yellow" />
                 </div>
               </div>
            </form>

            <h2 className="text-2xl font-bold mt-8 mb-4 border-t pt-4 text-gray-500">2. Payment method</h2>
            <div className="border border-gray-300 p-4 rounded-md bg-gray-50 text-sm">
              Standard Amazon Demo - No payment required for this clone. Default test card applied.
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4 border-t pt-4 text-gray-500">3. Review items and shipping</h2>
            <div className="border border-gray-300 p-4 rounded-md">
               {cart.items.map((item: any) => (
                 <div key={item.id} className="flex mb-4 last:mb-0">
                    <div className="font-bold text-sm text-gray-700 w-1/4">Delivery: Tomorrow</div>
                    <div className="w-3/4">
                       <span className="font-bold">{item.product.title}</span><br />
                       <span className="text-red-700 font-bold">${item.product.price}</span> - Quantity: {item.quantity}
                    </div>
                 </div>
               ))}
            </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="md:col-span-1 mt-6 md:mt-0">
           <div className="border border-gray-300 rounded-md p-5 sticky top-24 shadow-sm bg-white">
              <button type="submit" form="checkout-form" className="btn-yellow w-full rounded-md shadow-sm mb-4">
                 Place your order
              </button>
              
              <p className="text-xs text-gray-500 text-center mb-4 border-b pb-4">
                 By placing your order, you agree to Amazon Clone's privacy notice and conditions of use.
              </p>

              <h3 className="font-bold text-lg mb-2">Order Summary</h3>
              <div className="text-sm flex justify-between mb-1">
                <span>Items:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="text-sm flex justify-between mb-1 border-b pb-2">
                <span>Shipping & handling:</span>
                <span>$0.00</span>
              </div>
              <div className="text-xl font-bold text-[#b12704] flex justify-between mt-2">
                <span>Order Total:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}
