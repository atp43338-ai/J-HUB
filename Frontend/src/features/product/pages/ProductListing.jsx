import { useEffect, useState } from "react";
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
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(
          currentPage,
          productsPerPage,
          search,
          sort,
          category,
          minPrice,
          maxPrice,
          brand,
        );

        setProducts(data.products);
        setTotalPages(data.totalPages);
        setTotalProducts(data.totalProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    search,
    sort,
    category,
    minPrice,
    maxPrice,
    brand,
  ]);

  const filteredProducts = subCategory
    ? products.filter((product) =>
        product.collection?.includes(subCategory)
      )
    : products;

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSubCategory("");
    setCurrentPage(1);
  };

  const collectionItems = [
    {
      name: "National",
      image: "/national-img.png",
    },
    {
      name: "Club",
      image: "/club-img.png",
    },
    {
      name: "Legends",
      image: "/legends-img.png",
    },
    {
      name: "New Season",
      image: "/new-img.png",
    },
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

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-gray-500">
                    No products available.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

                  {filteredProducts.map((product) => (
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