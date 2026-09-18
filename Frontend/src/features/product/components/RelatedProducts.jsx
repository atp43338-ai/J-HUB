function RelatedProducts({ products }) {
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

          {products?.map((product) => (
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

              <img
                src={`http://localhost:5000${product.images?.[0]}`}
                alt={product.name}
                className="w-full h-64 object-contain"
              />

              <div className="p-4">

                <h3 className="font-semibold text-black">
                  {product.name}
                </h3>

                <p className="mt-2 text-lg font-bold text-black">
                  ₹{product.price}
                </p>

                <button
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
          ))}

        </div>
      )}

    </section>
  );
}

export default RelatedProducts;