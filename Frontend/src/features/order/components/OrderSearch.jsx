function OrderSearch({
  search,
  setSearch,
  setCurrentPage,
}) {
  return (
    <div className="flex w-full lg:max-w-[650px]">
      <input
        type="text"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        placeholder="Search by Order ID..."
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
  );
}

export default OrderSearch;