"use client";

import { useEffect, useState } from "react";
import API from "../../../lib/api";
import Image from "next/image";
import { Star, CheckCircle } from "lucide-react";
import { Product } from "../../../components/ProductCard";
import { useCart } from "../../../context/CartContext";
import { useRouter } from "next/navigation";
import { getRealisticImage } from "../../../lib/getImage";

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { refreshCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/${params.id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Failed to fetch product details", error);
        setError("Backend not connected");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [params.id]);

  const handleAddToCart = async (redirect: boolean = false) => {
    const qtyStr = (document.getElementById('qty-select') as HTMLSelectElement)?.value || '1';
    setAdding(true);
    try {
      if (!product) return;
      await API.post("/cart/add", { productId: product.id, quantity: parseInt(qtyStr) });
      refreshCart();
      if (redirect) {
        router.push('/checkout');
      } else {
        setAdded(true);
        setTimeout(() => setAdded(false), 2000);
      }
    } catch (e) {
      console.error("Failed to add to cart", e);
      alert("Backend not connected");
    } finally {
      if (!redirect) setAdding(false);
    }
  };

  if (error) return <div className="p-10 font-bold max-w-screen-xl mx-auto text-red-500">{error}</div>;
  if (loading) return <div className="flex justify-center items-center py-40"><div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amazon-yellow border-opacity-70"></div></div>;
  if (!product) return <div className="p-10 font-bold max-w-screen-xl mx-auto text-red-500">Product not found.</div>;

  return (
    <div className="max-w-screen-xl mx-auto p-4 md:p-8 bg-white mt-4 rounded-md shadow-sm mb-10">
      <div className="flex flex-col md:flex-row gap-8">
        
        {/* Left Side - Image Carousel & Thumbnail */}
        <div className="w-full md:w-1/2 flex gap-4">
          <div className="flex flex-col gap-2">
            {product.images.map((img, i) => (
              <div 
                key={i} 
                onMouseEnter={() => setSelectedImage(i)}
                className={`w-16 h-16 border rounded cursor-pointer relative ${selectedImage === i ? 'border-orange-500 shadow-md ring-1 ring-orange-500' : 'border-gray-200 hover:border-orange-500'}`}
              >
                 <img src={getRealisticImage(product.title, img)} alt="" className="object-contain p-1 w-full h-full absolute top-0 left-0" />
              </div>
            ))}
          </div>

          <div className="relative flex-1 min-h-[400px]">
             {product.images[selectedImage] ? (
                <img src={getRealisticImage(product.title, product.images[selectedImage])} alt={product.title} className="object-contain p-4 w-full h-full absolute top-0 left-0" />
             ) : (
               <div className="w-full h-full bg-gray-100 flex items-center justify-center">No Image</div>
             )}
          </div>
        </div>

        {/* Middle - Product Info */}
        <div className="w-full md:w-[30%]">
           <h1 className="text-2xl font-medium tracking-tight mb-2">{product.title}</h1>
           <div className="flex text-amazon-yellow mb-2 gap-1 items-center border-b pb-2 border-gray-200">
             {Array(5).fill(0).map((_, i) => (
               <Star key={i} size={18} fill={i < 4 ? "#febd69" : "none"} color="#febd69" />
             ))}
             <span className="text-blue-500 text-sm ml-2 font-medium hover:text-orange-500 cursor-pointer">10,987 ratings</span>
           </div>

           <div className="my-3">
             <span className="text-sm align-top mr-1 font-semibold">$</span>
             <span className="text-3xl font-medium text-black">{Math.floor(product.price)}</span>
             <span className="text-sm align-top ml-[2px]">{((product.price % 1) * 100).toFixed(0).padStart(2, "0")}</span>
           </div>

           <div className="text-sm border-t border-gray-200 pt-4 mt-4 text-gray-700">
             <span className="font-bold">About this item:</span>
             <p className="mt-2 text-base leading-relaxed">{product.description}</p>
           </div>
        </div>

        {/* Right Side - Add to Cart / Checkout box */}
        <div className="w-full md:w-[20%] border border-gray-200 rounded-lg p-5">
           <div className="text-xl font-medium text-black mb-2">${product.price.toFixed(2)}</div>
           
           <div className="text-sm text-gray-500 mb-4">
             FREE Returns
             <p className="text-black font-semibold mt-1">FREE delivery <span className="font-bold">Tomorrow</span></p>
           </div>

           <div className="text-lg text-green-700 font-medium mb-4">
             In Stock
           </div>

           <select id="qty-select" className="w-full p-1 border border-gray-300 rounded mb-4 text-sm bg-gray-100 shadow-sm outline-none cursor-pointer">
             {Array(10).fill(0).map((_, i) => (
                <option key={i} value={i+1}>Qty: {i+1}</option>
             ))}
           </select>

           <div className="flex flex-col gap-2">
             <button disabled={adding || added} onClick={() => handleAddToCart(false)} className={`text-sm py-2 px-4 rounded-full shadow-sm ${added ? 'bg-green-100 border border-green-500 text-green-700' : 'btn-yellow'}`}>
                {adding ? 'Adding...' : added ? <div className="flex justify-center items-center"><CheckCircle size={16} className="mr-1"/> Added</div> : 'Add to Cart'}
             </button>
             <button onClick={() => handleAddToCart(true)} className="btn-orange text-sm py-2 px-4 rounded-full shadow-sm">Buy Now</button>
           </div>

           <div className="text-xs text-gray-500 mt-4 flex gap-2 flex-col">
             <div className="flex justify-between"><span>Ships from</span> <span className="text-gray-700">Amazon</span></div>
             <div className="flex justify-between"><span>Sold by</span> <span className="text-gray-700">Amazon</span></div>
             <div className="flex justify-between"><span>Returns</span> <span className="text-blue-500 hover:text-orange-500 cursor-pointer">Eligible for Return</span></div>
           </div>
        </div>
      </div>
    </div>
  );
}
