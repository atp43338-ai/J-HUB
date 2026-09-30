function OrderPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-6">

      {/* Previous */}
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage((prev) => prev - 1)
        }
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Previous
      </button>

      {/* Pages */}
      {Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          type="button"
          onClick={() => setCurrentPage(page)}
          className={`w-10 h-10 rounded-lg text-sm font-medium ${
            currentPage === page
              ? "bg-[#d90416] text-white"
              : "border border-gray-300 text-black hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next */}
      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage((prev) => prev + 1)
        }
        className="px-4 py-2 border border-gray-300 rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
      >
        Next
      </button>

    </div>
  );
}

export default OrderPagination;