import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, CheckCircle } from "lucide-react";
import API from "../lib/api";
import { useCart } from "../context/CartContext";
import { getRealisticImage } from "../lib/getImage";

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  currency?: string;
  rating?: number;
  images: string[];
}

export default function ProductCard({
  id,
  title,
  price,
  rating = 4.5,
  images,
}: Product) {
  const { refreshCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const fullStars = Math.floor(rating);

  const addToCart = async () => {
    setAdding(true);
    try {
      await API.post("/cart/add", { productId: id, quantity: 1 });
      refreshCart();
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    } catch (e) {
      console.error("Failed to add to cart", e);
      alert("Backend not connected");
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="bg-white flex flex-col z-30 p-5 w-full m-2 shadow-sm rounded-sm transition-transform hover:shadow-lg relative min-h-[400px]">
      <div className="absolute top-2 right-2 text-xs text-gray-500 italic">Sponsored</div>

      <div className="mb-2">
        <h4 className="font-semibold text-lg line-clamp-2">{title}</h4>
      </div>
      
      <div className="flex text-amazon-yellow mb-2">
        {Array(5)
          .fill(0)
          .map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < Math.floor(rating) ? "#febd69" : "none"}
              color="#febd69"
            />
          ))}
        <span className="text-blue-500 text-xs ml-2 mt-1 hover:text-orange-500 cursor-pointer hover:underline">12,345</span>
      </div>

      <div className="mb-4">
        <span className="text-xs align-top">$</span>
        <span className="text-2xl font-bold">{Math.floor(price)}</span>
        <span className="text-xs align-top">
          {((price % 1) * 100).toFixed(0).padStart(2, "0")}
        </span>
      </div>

      <Link href={`/product/${id}`} className="flex justify-center mb-5 flex-1 relative min-h-[200px]">
        {images && images.length > 0 ? (
          <img
            src={getRealisticImage(title, images[0])}
            alt={title}
            className="object-contain w-full h-full absolute top-0 left-0"
          />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">No Image</div>
        )}
      </Link>

      <button disabled={adding || added} onClick={addToCart} className={`mt-auto mb-2 text-sm w-full font-medium py-2 px-4 rounded-full shadow-sm transition-colors border ${added ? 'bg-green-100 border-green-500 text-green-700' : 'bg-[#ffd814] hover:bg-[#f7ca00] text-[#0f1111] border-[#fcd200]'}`}>
        {adding ? 'Adding...' : added ? <div className="flex justify-center items-center"><CheckCircle size={16} className="mr-1"/> Added</div> : 'Add to Cart'}
      </button>

      {/* Prime logo mockup */}
      <div className="flex items-center text-xs text-gray-500 font-bold mt-2">
        <img src="https://links.papareact.com/fdw" alt="Prime" className="w-12 mr-2" />
        FREE Delivery by Tomorrow
      </div>
    </div>
  );
}
