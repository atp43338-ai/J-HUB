import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { getProducts } from "../../product/services/productService";
import { useNavigate } from "react-router";

function FeaturedProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data.products);
      } catch (error) {
        console.error(error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <section
      id="shop"
      className="py-24 px-1 md:px-4 bg-white"
    >
      <div className="max-w-[1400px] mx-auto">

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.8,
            ease: "easeOut",
          }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold !text-black">
            Featured Jerseys
          </h2>

          <p className="mt-3 text-gray-500">
            Explore our latest jersey collection
          </p>
        </motion.div>

        {/* Products */}
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-4 gap-8">

          {products.slice(0, 4).map((product, index) => {

            const direction = index % 2 === 0 ? -100 : 100;

            return (
              <motion.div
                key={product._id}
                initial={{
                  opacity: 0,
                  x: direction,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.15,
                  ease: "easeOut",
                }}
                viewport={{ once: true }}
                whileHover={{
                  y: -8,
                }}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-xl
                  transition-shadow
                  max-w-[250px]
                  mx-auto
                  w-full
                "
              >

                {/* Product Image */}
                <div
                  className="
                    w-full
                    overflow-hidden
                    cursor-pointer
                  "
                  onClick={() =>
                    navigate(`/products/${product._id}`)
                  }
                >
                  <motion.img
                    src={`http://localhost:5000${product.images?.[0]}`}
                    alt={product.name}
                    whileHover={{
                      scale: 1.08,
                    }}
                    transition={{
                      duration: 0.5,
                    }}
                    className="
                      w-full
                      h-full
                      object-contain
                    "
                  />
                </div>

                {/* Product Details */}
                <div className="p-5">

                  <h3 className="text-lg font-semibold text-black">
                    {product.name}
                  </h3>

                  <p className="mt-2 text-xl font-bold text-black">
                    ₹{product.price}
                  </p>

                  {/* Buy Now */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/products/${product._id}`)
                    }
                    className="
                      mt-4
                      w-full
                      py-2
                      rounded-lg
                      bg-black
                      hover:bg-[#b90312]
                      text-white
                      font-semibold
                      transition
                      duration-300
                    "
                  >
                    Buy Now
                  </button>

                  {/* Add to Cart */}
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/products/${product._id}`)
                    }
                    className="
                      mt-3
                      w-full
                      py-2
                      rounded-lg
                      bg-[#d90416]
                      hover:bg-[#b90312]
                      text-white
                      font-semibold
                      transition
                      duration-300
                    "
                  >
                    Add to Cart
                  </button>

                </div>

              </motion.div>
            );
          })}

        </div>

        {/* View All Products */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            delay: 0.7,
          }}
          viewport={{ once: true }}
          className="flex justify-center mt-12"
        >
          <a
            href="/products"
            className="
              px-8
              py-3
              rounded-lg
              border-2
              border-[#d90416]
              text-[#d90416]
              hover:bg-[#d90416]
              hover:text-white
              font-semibold
              transition
              duration-300
            "
          >
            View All Products
          </a>
        </motion.div>

      </div>
    </section>
  );
}

export default FeaturedProducts;