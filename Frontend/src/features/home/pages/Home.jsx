import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { getProducts } from "../../product/services/productService";
import HomeBackground from "../asset/home-bg.png";
import JerseyImage from "../asset/jersey-img.png";

function Home() {
  const [products, setProducts] = useState([]);

  const [jerseyMove, setJerseyMove] = useState({
    x: 0,
    y: 0,
  });

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



  return (
    <div className="w-full bg-white text-black">

      {/* Navbar */}
      <Navbar />

      {/* Home Section */}
      <section
        id="home"
        className="
          relative
          left-1/2
          -translate-x-1/2
          w-screen
          h-screen
          overflow-hidden
        "
        onMouseMove={(e) => {
          const x = (e.clientX / window.innerWidth - 0.5) * 20;
          const y = (e.clientY / window.innerHeight - 0.5) * 20;

          setJerseyMove({
            x,
            y,
          });
        }}
      >

        {/* Background Image */}
        <img
          src={HomeBackground}
          alt="J-HUB Home"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
          "
        />

        {/* Jersey Image */}
        <div
          className="
            absolute
            right-[8%]
            top-1/2
            -translate-y-1/2
            z-10
            transition-transform
            duration-300
            ease-out
          "
          style={{
            transform: `translate(${jerseyMove.x}px, ${jerseyMove.y}px)`,
          }}
        >
          <img
            src={JerseyImage}
            alt="J-HUB Jersey"
            className="
              w-[350px]
              md:w-[450px]
              lg:w-[550px]
              object-contain
            "
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex items-center">

          <div className="ml-[8%] max-w-[550px]">

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mt-3">
              Your Style.
              <br />
              <span className="text-[#d90416]">
                Your Game.
              </span>
            </h1>

            <p className="mt-6 text-lg text-gray-300 max-w-[450px]">
              Discover premium jerseys designed for your game and your style.
            </p>

            <a
              href="#shop"
              className="
                inline-block
                mt-8
                px-8
                py-4
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                font-semibold
                rounded-[10px]
                transition
              "
            >
              Shop Now
            </a>

          </div>

        </div>

      </section>

      {/* Shop Section */}
      <section id="shop" className="py-24 px-2 md:px-4 bg-white">
  <div className="max-w-[1400px] mx-auto">

    {/* Title */}
    <div className="text-center mb-12">
      <h2 className="text-4xl md:text-5xl font-extrabold text-black">
        Featured Jerseys
      </h2>

      <p className="mt-3 text-gray-500">
        Explore our latest jersey collection
      </p>
    </div>

    {/* Products */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">

      {products.slice(0, 8).map((product) => (
  <div
    key={product._id}
    className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition max-w-[300px] mx-auto w-full"
  >

    {/* Product Image */}
    <div className="w-full">
      <img
        src={`http://localhost:5000${product.images?.[0]}`}
        alt={product.name}
        className="w-full h-full object-contain"
      />
    </div>

    {/* Product Details */}
    <div className="p-5">

      <h3 className="text-lg font-semibold text-black">
        {product.name}
      </h3>

      <p className="mt-2 text-xl font-bold text-black">
        ₹{product.price}
      </p>

      <button
        className="w-full mt-5 py-3 rounded-lg bg-[#d90416] hover:bg-[#b90312] text-white font-semibold transition"
      >
        Buy Now
      </button>

    </div>

  </div>
))}

    </div>

    {/* View All Products */}
    <div className="flex justify-center mt-12">
      <a
        href="/products"
        className="px-8 py-3 rounded-lg border-2 border-[#d90416] text-[#d90416] hover:bg-[#d90416] hover:text-white font-semibold transition"
      >
        View All Products
      </a>
    </div>

  </div>
</section>

      {/* About Section */}
<section
  id="about"
  className="
    min-h-[600px]
    bg-white
    flex
    items-center
    px-6
    md:px-10
    lg:px-20
  "
>
  <div className="max-w-[1400px] w-full mx-auto">

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

      {/* Left Content */}
      <div>

        <p className="text-[#d90416] font-semibold tracking-widest text-sm uppercase">
          About J-HUB
        </p>

        <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold !text-black leading-tight">
  Built for the Game.
  <br />
  <span className="text-[#d90416]">
    Made for Your Style.
  </span>
</h2>

        <p className="mt-6 text-gray-600 text-base md:text-lg leading-8 max-w-[600px]">
          J-HUB is a modern online jersey store built for football fans
          and sports lovers. We bring together stylish, comfortable, and
          quality jerseys from popular clubs and teams, making it easy
          to find your perfect match.
        </p>

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">

          {/* Premium Jerseys */}
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#d90416] text-white flex items-center justify-center text-xl">
              ⚽
            </div>

            <h3 className="mt-4 font-bold text-black">
              Premium Jerseys
            </h3>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              Quality jerseys for every fan.
            </p>
          </div>

          {/* Fast Delivery */}
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#d90416] text-white flex items-center justify-center text-xl">
              🚚
            </div>

            <h3 className="mt-4 font-bold text-black">
              Fast Delivery
            </h3>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              Get your favourite jersey delivered to your door.
            </p>
          </div>

          {/* Secure Shopping */}
          <div>
            <div className="w-12 h-12 rounded-lg bg-[#d90416] text-white flex items-center justify-center text-xl">
              🔒
            </div>

            <h3 className="mt-4 font-bold text-black">
              Secure Shopping
            </h3>

            <p className="mt-2 text-sm text-gray-500 leading-6">
              Safe and simple online shopping experience.
            </p>
          </div>

        </div>

      </div>

      {/* Right Image */}
      <div className="flex justify-center lg:justify-end">

        <div className="relative w-full max-w-[520px]">

          <img
            src={JerseyImage}
            alt="J-HUB Jersey"
            className="w-full h-[450px] object-contain"
          />

        </div>

      </div>

    </div>

  </div>
</section>

      {/* Contact Section */}
<section
  id="contact"
  className="min-h-[650px] bg-black text-white flex items-center px-6 md:px-10 lg:px-20 py-20"
>
  <div className="max-w-[1400px] w-full mx-auto">

    {/* Heading */}
    <div className="mb-12">
      <p className="text-[#d90416] font-semibold tracking-widest text-sm uppercase">
        Contact Us
      </p>

      <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold text-white">
        Let's Talk.
        <br />
        <span className="text-[#d90416]">
          We're Here to Help.
        </span>
      </h2>
    </div>

    {/* Contact Content */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

      {/* Contact Form */}
      <div>

        <form className="space-y-6">

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Name
            </label>

            <input
              type="text"
              placeholder="Enter your name"
              className="
                w-full
                bg-[#111111]
                border
                border-gray-700
                rounded-lg
                px-4
                py-4
                text-white
                placeholder-gray-500
                outline-none
                focus:border-[#d90416]
              "
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="
                w-full
                bg-[#111111]
                border
                border-gray-700
                rounded-lg
                px-4
                py-4
                text-white
                placeholder-gray-500
                outline-none
                focus:border-[#d90416]
              "
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Message
            </label>

            <textarea
              rows="5"
              placeholder="Write your message..."
              className="
                w-full
                bg-[#111111]
                border
                border-gray-700
                rounded-lg
                px-4
                py-4
                text-white
                placeholder-gray-500
                outline-none
                focus:border-[#d90416]
                resize-none
              "
            />
          </div>

          {/* Button */}
          <button
            type="submit"
            className="
              px-8
              py-4
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              font-semibold
              rounded-lg
              transition
            "
          >
            Send Message
          </button>

        </form>

      </div>

      {/* Contact Information */}
      <div className="flex flex-col justify-center">

        <h3 className="text-2xl md:text-3xl font-bold text-white">
          Get in Touch
        </h3>

        <p className="mt-4 text-gray-400 leading-7 max-w-[500px]">
          Have a question about our jerseys, orders, delivery, or anything
          else? Send us a message and our team will be happy to help.
        </p>

        {/* Email */}
        <div className="mt-10">
          <p className="text-sm text-gray-500">
            Email
          </p>

          <p className="mt-2 text-lg text-white">
            support@jhub.com
          </p>
        </div>

        {/* Phone */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Phone
          </p>

          <p className="mt-2 text-lg text-white">
            +91 98765 43210
          </p>
        </div>

        {/* Address */}
        <div className="mt-6">
          <p className="text-sm text-gray-500">
            Address
          </p>

          <p className="mt-2 text-lg text-white">
            Kerala, India
          </p>
        </div>

      </div>

    </div>

  </div>
</section>

      {/* Footer */}
<footer className="bg-black text-white">

  <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20 py-16">

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

      {/* Logo & Description */}
      <div className="lg:col-span-2">

        <h2 className="text-3xl font-extrabold">
          J - <span className="text-[#d90416]">HUB</span>
        </h2>

        <p className="mt-5 text-gray-400 leading-7 max-w-[450px]">
          Your destination for premium football jerseys.
          Find your favourite club jerseys and bring your game
          to the next level.
        </p>

      </div>

      {/* Quick Links */}
      <div>

        <h3 className="text-lg font-bold text-white">
          Quick Links
        </h3>

        <div className="mt-5 flex flex-col gap-3">

          <a
            href="#home"
            className="text-gray-400 hover:text-[#d90416] transition"
          >
            Home
          </a>

          <a
            href="#shop"
            className="text-gray-400 hover:text-[#d90416] transition"
          >
            Shop
          </a>

          <a
            href="#about"
            className="text-gray-400 hover:text-[#d90416] transition"
          >
            About Us
          </a>

          <a
            href="#contact"
            className="text-gray-400 hover:text-[#d90416] transition"
          >
            Contact Us
          </a>

        </div>

      </div>

      {/* Contact */}
      <div>

        <h3 className="text-lg font-bold text-white">
          Contact
        </h3>

        <div className="mt-5 space-y-3">

          <p className="text-gray-400">
            support@jhub.com
          </p>

          <p className="text-gray-400">
            +91 98765 43210
          </p>

          <p className="text-gray-400">
            Kerala, India
          </p>

        </div>

      </div>

    </div>

    {/* Divider */}
    <div className="border-t border-gray-800 mt-12 pt-8">

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">

        <p className="text-sm text-gray-500">
          © 2026 J-HUB. All rights reserved.
        </p>

        <div className="flex gap-6">

          <a
            href="#"
            className="text-sm text-gray-500 hover:text-white transition"
          >
            Privacy Policy
          </a>

          <a
            href="#"
            className="text-sm text-gray-500 hover:text-white transition"
          >
            Terms & Conditions
          </a>

        </div>

      </div>

    </div>

  </div>

</footer>

    </div>
  );
}

export default Home;