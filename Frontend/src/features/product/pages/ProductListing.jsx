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

  return (
    <div className="min-h-screen bg-white text-black">
      <Navbar />

      <ProductHero />

      <BrowseCollection
        collectionItems={collectionItems}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        setCurrentPage={setCurrentPage}
      />

      <section className="pb-16 px-6 md:px-10">
        <div className="max-w-[1400px] mx-auto">

          <ProductSearchSort
            search={search}
            setSearch={setSearch}
            setSearchParams={setSearchParams}
            sort={sort}
            setSort={setSort}
            setCurrentPage={setCurrentPage}
          />

          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

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