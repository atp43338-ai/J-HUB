import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import Navbar from "../../home/components/Navbar";
import ProductHero from "../components/ProductHero";
import BrowseCollection from "../components/BrowseCollection";
import ProductSearchSort from "../components/ProductSearchSort";
import ProductFilters from "../components/ProductFilters";
import ProductCard from "../components/ProductCard";
import ProductPagination from "../components/ProductPagination";
import { getProducts } from "../services/productService";
import Footer from "../../home/components/Footer";

function ProductListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || searchParams.get("q") || "";

  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState(searchQuery);
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const productsPerPage = 6;

  // Synchronize URL search param with local search state
  useEffect(() => {
    setSearch(searchQuery);
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(
          currentPage,
          productsPerPage,
          searchQuery || search,
          sort,
          category,
          minPrice,
          maxPrice,
          brand,
          subCategory
        );

        setProducts(data.products || []);
        setTotalPages(data.totalPages || 1);
        setTotalProducts(data.totalProducts || 0);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    searchQuery,
    search,
    sort,
    category,
    minPrice,
    maxPrice,
    brand,
    subCategory,
  ]);

  const clearFilters = () => {
    setSearch("");
    setSearchParams({});
    setSort("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSubCategory("");
    setCurrentPage(1);
  };

  const collectionItems = [
    { name: "National", image: "/national-img.png" },
    { name: "Club", image: "/club-img.png" },
    { name: "Legends", image: "/legends-img.png" },
    { name: "New Season", image: "/new-img.png" },
  ];

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const activeFilterCount = [category, subCategory, minPrice, maxPrice, brand, sort].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-white text-black overflow-x-hidden">
      <Navbar />

      <ProductHero />

      <BrowseCollection
        collectionItems={collectionItems}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        setCurrentPage={setCurrentPage}
      />

      <section className="pb-16 px-3 sm:px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">

          <ProductSearchSort
            search={search}
            setSearch={setSearch}
            setSearchParams={setSearchParams}
            sort={sort}
            setSort={setSort}
            setCurrentPage={setCurrentPage}
          />

          {/* Mobile Filter & Sort Bar */}
          <div className="md:hidden mb-5 flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-black text-white rounded-xl text-xs sm:text-sm font-semibold shadow-sm active:scale-95 transition"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 text-[#d90416]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span>Filter &amp; Sort</span>
              {activeFilterCount > 0 && (
                <span className="bg-[#d90416] text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold ml-1">
                  {activeFilterCount}
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={clearFilters}
                className="text-xs text-[#d90416] font-semibold px-3 py-2.5 border border-red-200 rounded-xl hover:bg-red-50 transition"
              >
                Clear
              </button>
            )}
          </div>

          {/* Mobile Filter Slide-Over Drawer */}
          {isMobileFilterOpen && (
            <div className="fixed inset-0 z-50 md:hidden flex justify-end">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/50 transition-opacity"
                onClick={() => setIsMobileFilterOpen(false)}
              />

              {/* Drawer Container */}
              <div className="relative w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col z-10">
                {/* Drawer Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-bold text-gray-900">
                      Filter &amp; Sort
                    </h2>
                    {activeFilterCount > 0 && (
                      <span className="bg-[#d90416] text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                        {activeFilterCount}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    {activeFilterCount > 0 && (
                      <button
                        type="button"
                        onClick={clearFilters}
                        className="text-xs text-[#d90416] font-semibold hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => setIsMobileFilterOpen(false)}
                      className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:text-black font-semibold"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                {/* Drawer Body */}
                <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-left">
                  {/* Sort By */}
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5">
                      Sort By
                    </h3>
                    <select
                      value={sort}
                      onChange={(e) => {
                        setSort(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#d90416]"
                    >
                      <option value="">Default</option>
                      <option value="priceLow">Price: Low to High</option>
                      <option value="priceHigh">Price: High to Low</option>
                      <option value="nameAZ">Name: A-Z</option>
                      <option value="nameZA">Name: Z-A</option>
                    </select>
                  </div>

                  {/* Category */}
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5">
                      Category
                    </h3>
                    <select
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#d90416]"
                    >
                      <option value="">All Categories</option>
                      <option value="Unisex">Unisex</option>
                    </select>
                  </div>

                  {/* Collection */}
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5">
                      Collection
                    </h3>
                    <select
                      value={subCategory}
                      onChange={(e) => {
                        setSubCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#d90416]"
                    >
                      <option value="">All Collections</option>
                      <option value="Club">Club</option>
                      <option value="National">National</option>
                      <option value="Legends">Legends</option>
                      <option value="New Season">New Season</option>
                    </select>
                  </div>

                  {/* Price Range */}
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5">
                      Price Range
                    </h3>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={minPrice}
                        onChange={(e) => {
                          setMinPrice(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Min ₹"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#d90416]"
                      />
                      <input
                        type="number"
                        value={maxPrice}
                        onChange={(e) => {
                          setMaxPrice(e.target.value);
                          setCurrentPage(1);
                        }}
                        placeholder="Max ₹"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#d90416]"
                      />
                    </div>
                  </div>

                  {/* Brand */}
                  <div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 mb-1.5">
                      Brand
                    </h3>
                    <select
                      value={brand}
                      onChange={(e) => {
                        setBrand(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 text-xs sm:text-sm outline-none focus:border-[#d90416]"
                    >
                      <option value="">All Brands</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Nike">Nike</option>
                      <option value="Puma">Puma</option>
                    </select>
                  </div>
                </div>

                {/* Drawer Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                  <button
                    type="button"
                    onClick={() => setIsMobileFilterOpen(false)}
                    className="w-full py-2.5 bg-[#d90416] hover:bg-[#b90312] text-white font-semibold rounded-xl text-xs sm:text-sm transition shadow-sm"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-[240px_1fr] gap-8 lg:gap-10">

            <div className="hidden md:block">
              <ProductFilters
                category={category}
                setCategory={setCategory}
                subCategory={subCategory}
                setSubCategory={setSubCategory}
                minPrice={minPrice}
                setMinPrice={setMinPrice}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                brand={brand}
                setBrand={setBrand}
                setCurrentPage={setCurrentPage}
                clearFilters={clearFilters}
              />
            </div>

            <div>

              {subCategory && (
                <div className="flex items-center justify-between mb-6">

                  <div>
                    <p className="text-sm text-gray-500">
                      Collection
                    </p>

                    <h2 className="text-2xl font-bold !text-black">
                      {subCategory} Jerseys
                    </h2>
                  </div>

                  <button
                    onClick={() => {
                      setSubCategory("");
                      setCurrentPage(1);
                    }}
                    className="text-sm text-[#d90416] hover:underline"
                  >
                    Clear
                  </button>

                </div>
              )}

              {products.length === 0 ? (
                <div className="text-center py-16 px-6 bg-gray-50 rounded-2xl border border-gray-100 max-w-lg mx-auto my-6">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-50 text-[#d90416] flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-4.35-4.35m2.35-5.65a8 8 0 1 1-16 0 8 8 0 0 1 16 0Z"
                      />
                    </svg>
                  </div>
                  {searchQuery || search ? (
                    <>
                      <h3 className="text-base font-bold text-gray-900 mb-1.5">
                        No products found
                      </h3>
                      <p className="text-xs text-gray-500 mb-5 leading-relaxed">
                        No products found matching <span className="font-semibold text-gray-800">"{searchQuery || search}"</span>. Try checking your spelling or use different keywords.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearch("");
                          setSearchParams({});
                          setCurrentPage(1);
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#d90416] hover:bg-[#b90312] text-white text-xs font-semibold transition shadow-sm inline-flex items-center gap-1.5"
                      >
                        Clear Search
                      </button>
                    </>
                  ) : (
                    <p className="text-gray-500 text-sm">
                      No products available.
                    </p>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">

                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={product}
                    />
                  ))}

                </div>
              )}

              <ProductPagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
              />

            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProductListing;