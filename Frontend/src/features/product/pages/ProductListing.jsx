import { useEffect, useState } from "react";
import Navbar from "../../home/components/Navbar";
import { getProducts } from "../services/productService";

function ProductListing() {
  const [products, setProducts] = useState([]);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const [subCategory, setSubCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = subCategory
    ? products.filter((product) => product.collection === subCategory)
    : products;

    console.log(
  "Product Collections:",
  products.map((product) => ({
    name: product.name,
    collection: product.collection,
  }))
);

  const clearFilters = () => {
    setSearch("");
    setSort("");
    setCategory("");
    setBrand("");
    setMinPrice("");
    setMaxPrice("");
    setSubCategory("");
  };

  const collectionItems = [
    {
      name: "National",
      image: "/public/national-img.png",
    },
    {
      name: "Club",
      image: "/public/club-img.png",
    },
    {
      name: "Legends",
      image: "/public/legends-img.png",
    },
    {
      name: "New Season",
      image: "/public/new-img.png",
    },
  ];

  return (
    <div className="min-h-screen bg-white text-black">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white min-h-[520px]">

        <div className="max-w-[1400px] mx-auto min-h-[520px] px-6 md:px-10 flex items-center">

          {/* Left Content */}
          <div className="relative z-10 w-full lg:w-1/2 py-20">

            <p className="text-[#d90416] font-semibold tracking-[0.3em] text-sm uppercase">
              J-HUB Collection
            </p>

            <h1 className="mt-5 text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight">
              All Jerseys
            </h1>

            <p className="mt-6 max-w-xl text-gray-400 text-lg md:text-xl leading-relaxed">
              Find your favourite club, national team, legendary player and
              latest season jerseys all in one place.
            </p>

          </div>

          {/* Player Image */}
          <div className="absolute right-0 bottom-0 w-[55%] lg:w-[48%] h-full flex items-end justify-center">

            <img
              src="/public/hazard-img.png"
              alt="Football Player"
              className="h-full max-h-[520px] w-auto object-contain object-bottom"
            />

          </div>

        </div>
      </section>

      {/* Browse Collection */}
      <section className="bg-white py-14 px-6 md:px-10">

        <div className="max-w-[1400px] mx-auto">

          <div className="text-center mb-10">

            <p className="text-[#d90416] font-semibold tracking-widest text-sm uppercase">
              Explore
            </p>

            <h2 className="mt-2 text-3xl md:text-4xl font-extrabold !text-black">
              Browse Collection
            </h2>

          </div>

          {/* Round Collection Items */}
          <div className="flex justify-center gap-8 md:gap-14 flex-wrap">

            {collectionItems.map((item) => (

              <button
                key={item.name}
                onClick={() => setSubCategory(item.name)}
                className="group flex flex-col items-center"
              >

                <div
                  className={`
                    w-20
                    h-20
                    md:w-24
                    md:h-24
                    rounded-full
                    overflow-hidden
                    border-4
                    transition-all
                    duration-200
                    ${
                      subCategory === item.name
                        ? "border-[#d90416] scale-105"
                        : "border-gray-200 group-hover:border-[#d90416] group-hover:scale-105"
                    }
                  `}
                >

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />

                </div>

                <span
                  className={`
                    mt-4
                    text-sm
                    md:text-base
                    font-semibold
                    transition
                    ${
                      subCategory === item.name
                        ? "text-[#d90416]"
                        : "text-black"
                    }
                  `}
                >
                  {item.name}
                </span>

              </button>

            ))}

          </div>

        </div>

      </section>

      {/* Main Content */}
      <section className="pb-16 px-6 md:px-10">

        <div className="max-w-[1400px] mx-auto">

          {/* Search + Sort */}
          <div className="flex flex-col lg:flex-row gap-5 justify-between mb-10">

            {/* Search */}
            <div className="flex w-full lg:max-w-[650px]">

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => setSearch("")}
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
              onChange={(e) => setSort(e.target.value)}
              className="
                lg:w-[240px]
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                outline-none
                focus:border-[#d90416]
                bg-white
              "
            >
              <option value="">Sort By</option>

              <option value="priceLow">
                Price: Low to High
              </option>

              <option value="priceHigh">
                Price: High to Low
              </option>

              <option value="nameAZ">
                A - Z
              </option>

              <option value="nameZA">
                Z - A
              </option>

            </select>

          </div>

          {/* Products + Filters */}
          <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-10">

            {/* Filters */}
            <aside className="border border-gray-200 rounded-xl p-6 h-fit sticky top-24">

              <div className="flex items-center justify-between">

                <h2 className="text-xl font-bold !text-black">
                  Filters
                </h2>

                <button
                  onClick={clearFilters}
                  className="text-sm text-[#d90416] hover:underline"
                >
                  Clear All
                </button>

              </div>

              {/* Category */}
              <div className="mt-8">

                <h3 className="font-semibold">
                  Category
                </h3>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="
                    w-full
                    mt-3
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-[#d90416]
                  "
                >
                  <option value="">
                    All Categories
                  </option>

                  <option value="Unisex">
                    Unisex
                  </option>

                </select>

              </div>

              {/* Sub Category */}
              <div className="mt-8">

                <h3 className="font-semibold">
                  Collection
                </h3>

                <select
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  className="
                    mt-3
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-[#d90416]
                  "
                >

                  <option value="">
                    All Collections
                  </option>

                  <option value="Club">
                    Club
                  </option>

                  <option value="National">
                    National
                  </option>

                  <option value="Legends">
                    Legends
                  </option>

                  <option value="New Season">
                    New Season
                  </option>

                </select>

              </div>

              {/* Price */}
              <div className="mt-8">

                <h3 className="font-semibold">
                  Price Range
                </h3>

                <div className="flex gap-2 mt-3">

                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-3
                      py-2
                      outline-none
                      focus:border-[#d90416]
                    "
                  />

                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max"
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-lg
                      px-3
                      py-2
                      outline-none
                      focus:border-[#d90416]
                    "
                  />

                </div>

              </div>

              {/* Brand */}
              <div className="mt-8">

                <h3 className="font-semibold">
                  Brand
                </h3>

                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="
                    w-full
                    mt-3
                    border
                    border-gray-300
                    rounded-lg
                    px-3
                    py-2
                    outline-none
                    focus:border-[#d90416]
                  "
                >

                  <option value="">
                    All Brands
                  </option>

                  <option value="Adidas">
                    Adidas
                  </option>

                  <option value="Nike">
                    Nike
                  </option>

                  <option value="Puma">
                    Puma
                  </option>

                </select>

              </div>

            </aside>

            {/* Products */}
            <div>

              {/* Selected Collection */}
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
                    onClick={() => setSubCategory("")}
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

                    <div
                      key={product._id}
                      className="
                        bg-white
                        border
                        border-gray-200
                        rounded-xl
                        overflow-hidden
                        shadow-sm
                        hover:shadow-lg
                        transition
                      "
                    >

                      {/* Image */}
                      <div className="w-full">

                        <img
                          src={`http://localhost:5000${product.images?.[0]}`}
                          alt={product.name}
                          className="w-full h-auto object-contain"
                        />

                      </div>

                      {/* Details */}
                      <div className="p-5">

                        <h3 className="text-lg font-semibold">
                          {product.name}
                        </h3>

                        <p className="mt-2 text-xl font-bold">
                          ₹{product.price}
                        </p>

                        <button
                          className="
                            w-full
                            mt-5
                            py-3
                            rounded-lg
                            bg-[#d90416]
                            hover:bg-[#b90312]
                            text-white
                            font-semibold
                            transition
                          "
                        >
                          Buy Now
                        </button>

                      </div>

                    </div>

                  ))}

                </div>

              )}

              {/* Pagination */}
              <div className="flex justify-center items-center gap-3 mt-12">

                <button
                  className="
                    px-4
                    py-2
                    border
                    border-gray-300
                    rounded-lg
                    text-gray-400
                  "
                >
                  Previous
                </button>

                <button
                  className="
                    w-10
                    h-10
                    rounded-lg
                    bg-[#d90416]
                    text-white
                    font-semibold
                  "
                >
                  1
                </button>

                <button
                  className="
                    w-10
                    h-10
                    rounded-lg
                    border
                    border-gray-300
                  "
                >
                  2
                </button>

                <button
                  className="
                    w-10
                    h-10
                    rounded-lg
                    border
                    border-gray-300
                  "
                >
                  3
                </button>

                <button
                  className="
                    px-4
                    py-2
                    border
                    border-gray-300
                    rounded-lg
                  "
                >
                  Next
                </button>

              </div>

            </div>

          </div>

        </div>

      </section>

    </div>
  );
}

export default ProductListing;