function OrderSearchSort({
  search,
  setSearch,
  sort,
  setSort,
  setCurrentPage,
}) {
  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between mb-5">

      {/* Search */}
      <div className="flex w-full lg:max-w-[600px]">

        <input
          type="text"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          placeholder="Search by Order ID, name or email..."
          className="w-full px-4 py-3 border border-gray-300 rounded-l-lg outline-none focus:border-[#d90416]"
        />

        <button
          type="button"
          onClick={() => {
            setSearch("");
            setCurrentPage(1);
          }}
          className="px-5 py-3 bg-gray-200 text-black rounded-r-lg hover:bg-gray-300 transition"
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
        className="w-full lg:w-56 px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-[#d90416]"
      >
        <option value="">
          Sort By
        </option>

        <option value="dateDesc">
          Date: Newest First
        </option>

        <option value="dateAsc">
          Date: Oldest First
        </option>

        <option value="amountHigh">
          Amount: High to Low
        </option>

        <option value="amountLow">
          Amount: Low to High
        </option>
      </select>

    </div>
  );
}

export default OrderSearchSort;