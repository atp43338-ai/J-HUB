function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 lg:px-20 py-16">

        {/* Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Logo & Description */}
          <div className="lg:col-span-2">
            <h2 className="text-3xl font-extrabold">
              <span className="text-[#d90416]">J</span>
              <span className="text-white"> - HUB</span>
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

            {/* Copyright */}
            <p className="text-sm text-gray-500">
              © 2026 J-HUB. All rights reserved.
            </p>

            {/* Legal Links */}
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
  );
}

export default Footer;