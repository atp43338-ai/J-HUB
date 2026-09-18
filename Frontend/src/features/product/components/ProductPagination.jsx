function ProductPagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  return (
    <div className="flex justify-center items-center gap-3 mt-12">

      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={currentPage === 1}
        className="
          px-4
          py-2
          border
          border-gray-300
          rounded-lg
          text-gray-400
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        Previous
      </button>

      {Array.from(
        { length: totalPages },
        (_, index) => index + 1
      ).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`
            w-10
            h-10
            rounded-lg
            font-semibold
            ${
              currentPage === page
                ? "bg-[#d90416] text-white"
                : "border border-gray-300"
            }
          `}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="
          px-4
          py-2
          border
          border-gray-300
          rounded-lg
          disabled:opacity-50
          disabled:cursor-not-allowed
        "
      >
        Next
      </button>

    </div>
  );
}

export default ProductPagination;