function ProductSearchSort({
  search,
  setSearch,
  sort,
  setSort,
  setCurrentPage,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-5 justify-between mb-10">

      {/* Search */}
      <div className="flex w-full lg:max-w-[650px]">

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search jerseys..."
          className="
            w-full
            border
            border-gray-300
            rounded-l-lg
            px-5
            py-3
            outline-none
            focus:border-[#d90416]
          "
        />

        <button
          onClick={() => {
            setSearch("");
            setCurrentPage(1);
          }}
          className="
            px-5
            py-3
            bg-gray-100
            border
            border-l-0
            border-gray-300
            rounded-r-lg
            text-gray-600
            hover:text-[#d90416]
          "
        >
          Clear
        </button>

      </div>

      {/* Sort */}
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setCurrentPage(1);
        }}
        className="
          border
          border-gray-300
          rounded-lg
          px-4
          py-3
          outline-none
          focus:border-[#d90416]
        "
      >
        <option value="">Sort By</option>
        <option value="priceLow">Price: Low to High</option>
        <option value="priceHigh">Price: High to Low</option>
        <option value="nameAZ">Name: A-Z</option>
        <option value="nameZA">Name: Z-A</option>
      </select>

    </div>
  );
}

export default ProductSearchSort;