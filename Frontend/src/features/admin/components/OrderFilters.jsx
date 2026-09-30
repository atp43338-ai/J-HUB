function OrderFilters({
  status,
  setStatus,
  setCurrentPage,
  clearFilters,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-6">

      {/* Status */}
      <select
        value={status}
        onChange={(e) => {
          setStatus(e.target.value);
          setCurrentPage(1);
        }}
        className="w-full sm:w-56 px-4 py-3 border border-gray-300 rounded-lg bg-white outline-none focus:border-[#d90416]"
      >
        <option value="">
          All Status
        </option>

        <option value="Pending">
          Pending
        </option>

        <option value="Shipped">
          Shipped
        </option>

        <option value="Out for Delivery">
          Out for Delivery
        </option>

        <option value="Delivered">
          Delivered
        </option>

        <option value="Cancelled">
          Cancelled
        </option>
      </select>

      {/* Clear */}
      <button
        type="button"
        onClick={clearFilters}
        className="px-5 py-3 border border-gray-300 rounded-lg text-black hover:bg-gray-100 transition"
      >
        Clear Filters
      </button>

    </div>
  );
}

export default OrderFilters;