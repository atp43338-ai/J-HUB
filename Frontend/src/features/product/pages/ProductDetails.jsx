import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import toast from "react-hot-toast";

import Navbar from "../../home/components/Navbar";

import ProductImages from "../components/ProductImages";
import ProductInfo from "../components/ProductInfo";
import ProductHighlights from "../components/ProductHighlights";
import ProductReviews from "../components/ProductReviews";
import RelatedProducts from "../components/RelatedProducts";
import Footer from "../../home/components/Footer";

import {
  getProductById,
  getRelatedProducts,
} from "../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);

    // If ID is not yet ready, wait
    if (!id) {
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setFetchError(null);

      try {
        const data = await getProductById(id);

        // Backend returns { product: {...} }
        if (
          !data ||
          !data.product ||
          data.product.isBlocked ||
          !data.product.isListed
        ) {
          toast.error("Product is currently unavailable");
          navigate("/products", { replace: true });
          return;
        }

        setProduct(data.product);

        try {
          const relatedData = await getRelatedProducts(id);
          setRelatedProducts(relatedData?.products || []);
        } catch (relatedError) {
          console.error("Failed to fetch related products:", relatedError);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);

        // Only redirect to /products if backend explicitly returns 404 Not Found
        const isNotFound =
          error?.status === 404 ||
          error?.response?.status === 404 ||
          (typeof error?.message === "string" &&
            (error.message.includes("404") ||
              error.message.toLowerCase().includes("not found")));

        if (isNotFound) {
          toast.error("Product not found");
          navigate("/products", { replace: true });
        } else {
          // Keep user on the page and allow retry instead of prematurely kicking to Home
          setFetchError(error.message || "Failed to load product details");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24">
          <div className="w-12 h-12 border-4 border-[#d90416] border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-medium text-sm">
            Loading product details...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  if (fetchError && !product) {
    return (
      <div className="min-h-screen bg-white text-black flex flex-col justify-between">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Unable to load product
          </h2>
          <p className="text-gray-500 max-w-md mb-6 text-sm">
            {fetchError}
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-[#d90416] text-white rounded-lg font-semibold hover:bg-[#b90312] transition"
          >
            Retry
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Navbar */}
      <Navbar />

      {/* Page Content */}
      <div className="pt-22 ps-8">

        {/* Breadcrumb */}
        <div className="mb-7 text-gray-500">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="hover:text-black transition"
          >
            Home
          </button>

          {" / "}

          <button
            type="button"
            onClick={() => navigate("/products")}
            className="hover:text-black transition"
          >
            Products
          </button>

          {" / "}

          <span className="text-black font-semibold">
            {product.name}
          </span>
        </div>

        {/* Product Details */}
        <section className="px-6 md:px-10 pb-16">

          <div className="max-w-[1400px] mx-auto">

            {/* Product Image + Product Information */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              <ProductImages
                key={product._id}
                images={product.images}
              />

              <ProductInfo
                product={product}
              />

            </div>

            {/* Product Highlights */}
            <ProductHighlights
              product={product}
            />

            {/* Reviews */}
            <ProductReviews
              product={product}
            />

            {/* Related Products */}
            <RelatedProducts
              products={relatedProducts}
            />

          </div>

        </section>

      </div>

      <Footer />

    </div>
  );
}

export default ProductDetails;