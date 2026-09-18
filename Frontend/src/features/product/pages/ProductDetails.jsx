import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import Navbar from "../../home/components/Navbar";

import ProductImages from "../components/ProductImages";
import ProductInfo from "../components/ProductInfo";
import ProductHighlights from "../components/ProductHighlights";
import ProductReviews from "../components/ProductReviews";
import RelatedProducts from "../components/RelatedProducts";
import Footer from "../../home/components/Footer";

import { getProductById } from "../services/productService";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);

        // Backend returns { product: {...} }
        if (
          !data.product ||
          data.product.isBlocked ||
          !data.product.isListed
        ) {
          navigate("/products");
          return;
        }

        setProduct(data.product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
        navigate("/products");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
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
              products={[]}
            />

          </div>

        </section>

        

      </div>
      <Footer/>

    </div>
  );
}

export default ProductDetails;