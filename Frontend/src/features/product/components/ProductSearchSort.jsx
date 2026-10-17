function ProductSearchSort({
  search,
  setSearch,
  setSearchParams,
  sort,
  setSort,
  setCurrentPage,
}) {
  return (
    <div className="flex flex-col md:flex-row gap-4 justify-between mb-4 md:mb-10">

      {/* Search */}
      <div className="flex w-full md:max-w-[650px]">

        <input
          type="text"
          value={search}
          onChange={(e) => {
            const val = e.target.value;
            setSearch(val);
            if (setSearchParams) {
              if (val.trim()) {
                setSearchParams({ search: val.trim() });
              } else {
                setSearchParams({});
              }
            }
            setCurrentPage(1);
          }}
          placeholder="Search jerseys..."
          className="
            w-full
            border
            border-gray-300
            rounded-l-lg
            px-3.5
            sm:px-5
            py-2.5
            sm:py-3
            text-sm
            sm:text-base
            outline-none
            focus:border-[#d90416]
          "
        />

        <button
          onClick={() => {
            setSearch("");
            if (setSearchParams) {
              setSearchParams({});
            }
            setCurrentPage(1);
          }}
          className="
            px-3.5
            sm:px-5
            py-2.5
            sm:py-3
            bg-gray-100
            border
            border-l-0
            border-gray-300
            rounded-r-lg
            text-xs
            sm:text-sm
            text-gray-600
            hover:text-[#d90416]
          "
        >
          Clear
        </button>

      </div>

      {/* Sort - Desktop */}
      <select
        value={sort}
        onChange={(e) => {
          setSort(e.target.value);
          setCurrentPage(1);
        }}
        className="
          hidden
          md:block
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