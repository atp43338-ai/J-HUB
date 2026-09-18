import { motion } from "framer-motion";

function ContactSection() {
  return (
    <>
      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-[650px] bg-white text-black flex items-center px-6 md:px-10 lg:px-20 py-20"
      >
        <div className="max-w-[1400px] w-full mx-auto">

          {/* Heading */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="mb-12"
          >
            <p className="text-[#d90416] font-semibold tracking-widest text-sm uppercase">
              Contact Us
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold !text-black">
              Let's Talk.
              <br />
              <span className="text-[#d90416]">
                We're Here to Help.
              </span>
            </h2>
          </motion.div>

          {/* Contact Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="
                bg-gray-50
                border
                border-gray-200
                rounded-2xl
                p-6
                md:p-8
                shadow-sm
              "
            >
              <form className="space-y-6">

                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Name
                  </label>

                  <input
                    type="text"
                    placeholder="Enter your name"
                    className="
                      w-full
                      bg-white
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-4
                      text-black
                      placeholder-gray-400
                      outline-none
                      focus:border-[#d90416]
                      focus:ring-1
                      focus:ring-[#d90416]
                      transition
                    "
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Email
                  </label>

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="
                      w-full
                      bg-white
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-4
                      text-black
                      placeholder-gray-400
                      outline-none
                      focus:border-[#d90416]
                      focus:ring-1
                      focus:ring-[#d90416]
                      transition
                    "
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-black mb-2">
                    Message
                  </label>

                  <textarea
                    rows="5"
                    placeholder="Write your message..."
                    className="
                      w-full
                      bg-white
                      border
                      border-gray-300
                      rounded-lg
                      px-4
                      py-4
                      text-black
                      placeholder-gray-400
                      outline-none
                      focus:border-[#d90416]
                      focus:ring-1
                      focus:ring-[#d90416]
                      resize-none
                      transition
                    "
                  />
                </div>

                {/* Button */}
                <button
                  type="submit"
                  className="
                    px-8
                    py-4
                    bg-black
                    hover:bg-[#d90416]
                    text-white
                    font-semibold
                    rounded-lg
                    transition
                    duration-300
                  "
                >
                  Send Message
                </button>

              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.9,
                delay: 0.2,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
              className="flex flex-col justify-center"
            >

              <h3 className="text-2xl md:text-3xl font-bold text-black">
                Get in Touch
              </h3>

              <p className="mt-4 text-gray-600 leading-7 max-w-[500px]">
                Have a question about our jerseys, orders, delivery, or anything
                else? Send us a message and our team will be happy to help.
              </p>

              {/* Email */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.4,
                }}
                viewport={{ once: true }}
                className="mt-10 pl-5"
              >
                <p className="text-sm text-gray-500">
                  Email
                </p>

                <p className="mt-2 text-lg font-semibold text-black">
                  support@jhub.com
                </p>
              </motion.div>

              {/* Phone */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.55,
                }}
                viewport={{ once: true }}
                className="mt-6 pl-5"
              >
                <p className="text-sm text-gray-500">
                  Phone
                </p>

                <p className="mt-2 text-lg font-semibold text-black">
                  +91 98765 43210
                </p>
              </motion.div>

              {/* Address */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.7,
                }}
                viewport={{ once: true }}
                className="mt-6 pl-5"
              >
                <p className="text-sm text-gray-500">
                  Address
                </p>

                <p className="mt-2 text-lg font-semibold text-black">
                  Kerala, India
                </p>
              </motion.div>

            </motion.div>

          </div>

        </div>
      </section>
    </>
  );
}

export default ContactSection;