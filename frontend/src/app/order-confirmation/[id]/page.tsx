"use client";

import { useEffect, useState } from "react";
import API from "../../../lib/api";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${params.id}`);
        setOrder(res.data);
      } catch (error) {
        console.error("Failed to fetch order", error);
        setError("Backend not connected");
      }
    };
    fetchOrder();
  }, [params.id]);

  if (error) return <div className="p-10 font-bold max-w-screen-xl mx-auto text-red-500">{error}</div>;
  if (!order) return <div className="p-10 font-bold max-w-screen-xl mx-auto">Loading confirmation...</div>;

  return (
    <div className="max-w-screen-md mx-auto p-4 md:p-8 mt-10">
      <div className="border-2 border-green-500 bg-white p-8 rounded-lg shadow-sm">
        <div className="flex items-center text-green-600 mb-6 border-b pb-4 border-green-100">
           <CheckCircle size={48} className="mr-4" />
           <h1 className="text-2xl font-bold">Order placed, thank you!</h1>
        </div>

        <div className="mb-4 text-gray-800">
            <span className="font-bold">Confirmation will be sent to your email.</span>
        </div>

        <div className="bg-gray-100 p-4 rounded-md mb-6 border">
           <h2 className="font-bold border-b pb-2 mb-2 border-gray-300">Order Information</h2>
           <p className="text-sm mb-1"><span className="font-bold">Order ID:</span> {order.id}</p>
           <p className="text-sm mb-1"><span className="font-bold">Total Amount:</span> ${order.totalAmount.toFixed(2)}</p>
           <p className="text-sm mb-1"><span className="font-bold">Shipping Address:</span> {order.address}, {order.city}, {order.state} {order.pincode}</p>
        </div>

        <div className="mb-8">
           <h2 className="font-bold mb-4">Items Ordered:</h2>
           <ul className="space-y-4">
             {order.items.map((item: any) => (
               <li key={item.id} className="flex justify-between items-center bg-gray-50 p-2 rounded border">
                 <div className="flex flex-col">
                   <span className="font-semibold">{item.product.title}</span>
                   <span className="text-sm text-gray-500">Qty: {item.quantity}</span>
                 </div>
                 <span className="font-bold text-red-700">${item.price.toFixed(2)}</span>
               </li>
             ))}
           </ul>
        </div>

        <div className="flex justify-center">
            <Link href="/" className="btn-yellow px-8 rounded-md decoration-transparent mt-4 inline-block text-center shadow-lg">
               Continue Shopping
            </Link>
        </div>
      </div>
    </div>
  );
}
