"use client";

import { useEffect, useState, Suspense } from "react";
import API from "../lib/api";
import { useSearchParams } from "next/navigation";
import HeroBanner from "../components/HeroBanner";
import ProductCard, { Product } from "../components/ProductCard";

function HomeContent() {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");
  const categoryParam = searchParams.get("category");

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let url = "/products";
        const queryParams = [];
        if (search) queryParams.push(`search=${encodeURIComponent(search)}`);
        if (categoryParam) queryParams.push(`category=${encodeURIComponent(categoryParam)}`);
        if (queryParams.length > 0) url += "?" + queryParams.join("&");

        const res = await API.get(url);
        setProducts(res.data);
      } catch (error) {
        console.error("Failed to fetch products", error);
        setError("Backend not connected");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, categoryParam]);

  // If there's a search or category query, don't group, just list them all
  const isFiltering = !!search || !!categoryParam;

  if (error) {
    return (
      <div className="max-w-[1500px] mx-auto pb-10 flex flex-col items-center pt-20">
        <h1 className="text-3xl font-bold text-red-600 mb-4">Error</h1>
        <p className="text-xl">{error}</p>
      </div>
    );
  }

  // Group products by category when there is no filter
  const categorizedProducts: Record<string, Product[]> = {};
  if (!isFiltering) {
    products.forEach((p) => {
      // Assuming 'category' relationship was expanded in the API returning p.category.name 
      // If our current API just returned categoryId, we can just guess or map if category isn't there
      const catName = (p as any).category?.name || "Other";
      if (!categorizedProducts[catName]) categorizedProducts[catName] = [];
      categorizedProducts[catName].push(p);
    });
  }

  return (
    <div className="max-w-[1500px] mx-auto pb-10">
      {!isFiltering && <HeroBanner />}

      <div className={`mx-auto ${isFiltering ? 'mt-8 px-4' : '-mt-12 md:-mt-36 lg:-mt-52 xl:-mt-72 z-30 relative px-4 gap-4'}`}>
        
        {loading ? (
          <div className="flex justify-center items-center py-40">
             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-amazon-yellow border-opacity-70"></div>
          </div>
        ) : (
          <>
            {isFiltering ? (
              <div>
                 <h2 className="text-xl font-bold mb-4">Results for "{search || categoryParam}"</h2>
                 {products.length === 0 ? (
                    <p className="text-center bg-white p-10 font-bold m-4 h-64 flex items-center justify-center shadow-sm">No products found.</p>
                 ) : (
                    <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {products.map((p) => <ProductCard key={p.id} {...p} />)}
                    </div>
                 )}
              </div>
            ) : (
              // Amazon UI specific generic lane rendering
              <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                 {/* Top slice generic rendering. For Amazon effect, we put items inside cards or render arrays */}
                 {products.slice(0, 4).map((product) => (
                    <ProductCard key={product.id} {...product} />
                  ))}

                 <img
                   className="col-span-full my-4 shadow-md w-full rounded-sm"
                   src="https://links.papareact.com/dyz"
                   alt="Banner"
                 />

                 {/* Group the rest by Categories */}
                 <div className="col-span-full mt-4 space-y-8">
                   {Object.entries(categorizedProducts).map(([cat, prods]) => (
                     <div key={cat} className="bg-transparent">
                        <h2 className="text-2xl font-bold bg-white p-4 pb-2 border-b-2 shadow-sm rounded-t-sm border-gray-200">
                          Discover in {cat}
                        </h2>
                        <div className="grid grid-flow-row-dense grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-100 mt-2">
                           {prods.map(p => <ProductCard key={p.id} {...p} />)}
                        </div>
                     </div>
                   ))}
                 </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// NextJS App router demands suspense for useSearchParams
export default function Home() {
  return (
    <Suspense fallback={<div className="flex justify-center p-20 animate-pulse font-bold">Loading Storefront...</div>}>
      <HomeContent />
    </Suspense>
  )
}
