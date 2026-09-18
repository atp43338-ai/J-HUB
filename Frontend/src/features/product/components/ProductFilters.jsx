function ProductFilters({
  category,
  setCategory,
  subCategory,
  setSubCategory,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  brand,
  setBrand,
  setCurrentPage,
  clearFilters,
}) {
  return (
    <aside className="border border-gray-200 rounded-xl p-6 h-fit sticky top-24">

      <div className="flex items-center justify-between">

        <h2 className="text-xl font-bold !text-black">
          Filters
        </h2>

        <button
          onClick={clearFilters}
          className="text-sm text-[#d90416] hover:underline"
        >
          Clear All
        </button>

      </div>

      {/* Category */}
      <div className="mt-8">

        <h3 className="font-semibold">
          Category
        </h3>

        <select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="
            w-full
            mt-3
            border
            border-gray-300
            rounded-lg
            px-3
            py-2
            outline-none
            focus:border-[#d90416]
          "
        >
          <option value="">
            All Categories
          </option>

          <option value="Unisex">
            Unisex
          </option>
        </select>

      </div>

      {/* Collection */}
      <div className="mt-8">

        <h3 className="font-semibold">
          Collection
        </h3>

        <select
          value={subCategory}
          onChange={(e) => {
            setSubCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="
            mt-3
            border
            border-gray-300
            rounded-lg
            px-3
            py-2
            outline-none
            focus:border-[#d90416]
          "
        >
          <option value="">
            All Collections
          </option>

          <option value="Club">
            Club
          </option>

          <option value="National">
            National
          </option>

          <option value="Legends">
            Legends
          </option>

          <option value="New Season">
            New Season
          </option>
        </select>

      </div>

      {/* Price */}
      <div className="mt-8">

        <h3 className="font-semibold">
          Price Range
        </h3>

        <div className="flex gap-2 mt-3">

          <input
            type="number"
            value={minPrice}
            onChange={(e) => {
              setMinPrice(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Min"
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-3
              py-2
              outline-none
              focus:border-[#d90416]
            "
          />

          <input
            type="number"
            value={maxPrice}
            onChange={(e) => {
              setMaxPrice(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Max"
            className="
              w-full
              border
              border-gray-300
              rounded-lg
              px-3
              py-2
              outline-none
              focus:border-[#d90416]
            "
          />

        </div>

      </div>

      {/* Brand */}
      <div className="mt-8">

        <h3 className="font-semibold">
          Brand
        </h3>

        <select
          value={brand}
          onChange={(e) => {
           setBrand(e.target.value);
           setCurrentPage(1);
           }}
          className="
            w-full
            mt-3
            border
            border-gray-300
            rounded-lg
            px-3
            py-2
            outline-none
            focus:border-[#d90416]
          "
        >
          <option value="">
            All Brands
          </option>

          <option value="Adidas">
            Adidas
          </option>

          <option value="Nike">
            Nike
          </option>

          <option value="Puma">
            Puma
          </option>
        </select>

      </div>

    </aside>
  );
}

export default ProductFilters;