import { useNavigate } from "react-router";
import { getProductPricing } from "../../../utils/pricing";

function RelatedProducts({ products }) {
  const navigate = useNavigate();

  return (
    <section className="mt-16 border-t border-gray-200 pt-10">

      <h2 className="text-2xl md:text-3xl font-bold !text-black">
        Related Products
      </h2>

      {products?.length === 0 ? (
        <p className="mt-6 text-gray-500">
          No related products available.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {products?.map((product) => {
            const { sellingPrice, originalPrice, discount, hasDiscount } =
              getProductPricing(product);

            return (
              <div
                key={product._id}
                className="
                  bg-white
                  border
                  border-gray-200
                  rounded-xl
                  overflow-hidden
                  shadow-sm
                  hover:shadow-lg
                  transition
                "
              >

                <div className="relative w-full">
                  {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-[#d90416] text-white text-[11px] font-bold px-2 py-0.5 rounded-full z-10 shadow-sm tracking-wide">
                      {discount}% OFF
                    </div>
                  )}

                  <img
                    src={
                      product.images?.[0]?.startsWith("http")
                        ? product.images[0].replace("http://localhost:5000", "https://api.afsal.online")
                        : `https://api.afsal.online${product.images?.[0]}`
                    }
                    alt={product.name}
                    className="w-full h-auto object-contain"
                  />
                </div>

                <div className="p-4">

                  <h3 className="font-semibold text-black">
                    {product.name}
                  </h3>

                  {/* Price & Offer Display */}
                  <div className="mt-2">
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span className="text-lg font-bold text-gray-900">
                        ₹{sellingPrice}
                      </span>

                      {hasDiscount && originalPrice && originalPrice > sellingPrice && (
                        <>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{originalPrice}
                          </span>
                          <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1 py-0.2 rounded">
                            {discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                <button
                  type="button"
                  onClick={() =>
                    navigate(`/products/${product._id}`)
                  }
                  className="
                    w-full
                    mt-4
                    py-2
                    rounded-lg
                    bg-[#d90416]
                    hover:bg-[#b90312]
                    text-white
                    font-semibold
                    transition
                  "
                >
                  View Product
                </button>

              </div>
            </div>
          );
        })}

        </div>
      )}

    </section>
  );
}

export default RelatedProducts;