import JerseyImage from "../asset/jersey-img.png";
import { motion } from "framer-motion";

function AboutSection() {
  return (
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

            {/* About Label */}
            <motion.p
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-[#d90416] font-semibold tracking-widest text-sm uppercase"
            >
              About J-HUB
            </motion.p>

            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.15,
              }}
              viewport={{ once: true }}
              className="mt-4 text-4xl md:text-5xl lg:text-6xl font-extrabold !text-black leading-tight"
            >
              Built for the Game.
              <br />
              <span className="text-[#d90416]">
                Made for Your Style.
              </span>
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.7,
                delay: 0.3,
              }}
              viewport={{ once: true }}
              className="mt-6 text-gray-600 text-base md:text-lg leading-8 max-w-[600px]"
            >
              J-HUB is a modern online jersey store built for football fans
              and sports lovers. We bring together stylish, comfortable, and
              quality jerseys from popular clubs and teams, making it easy
              to find your perfect match.
            </motion.p>

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-10">

              {/* Premium Jerseys */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.45,
                }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-lg bg-[#d90416] text-white flex items-center justify-center text-xl">
                  ⚽
                </div>

                <h3 className="mt-4 font-bold text-black">
                  Premium Jerseys
                </h3>

                <p className="mt-2 text-sm text-gray-500 leading-6">
                  Quality jerseys for every fan.
                </p>
              </motion.div>

              {/* Fast Delivery */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.6,
                }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-lg bg-[#d90416] text-white flex items-center justify-center text-xl">
                  🚚
                </div>

                <h3 className="mt-4 font-bold text-black">
                  Fast Delivery
                </h3>

                <p className="mt-2 text-sm text-gray-500 leading-6">
                  Get your favourite jersey delivered to your door.
                </p>
              </motion.div>

              {/* Secure Shopping */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.75,
                }}
                viewport={{ once: true }}
              >
                <div className="w-12 h-12 rounded-lg bg-[#d90416] text-white flex items-center justify-center text-xl">
                  🔒
                </div>

                <h3 className="mt-4 font-bold text-black">
                  Secure Shopping
                </h3>

                <p className="mt-2 text-sm text-gray-500 leading-6">
                  Safe and simple online shopping experience.
                </p>
              </motion.div>

            </div>

          </div>

          {/* Right Image */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
            }}
            whileInView={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 1,
              delay: 0.3,
              ease: "easeOut",
            }}
            viewport={{ once: true }}
            className="flex justify-center lg:justify-end"
          >

            <div className="relative w-full max-w-[520px]">

              <img
                src={JerseyImage}
                alt="J-HUB Jersey"
                className="
                  w-full
                  h-[450px]
                  object-contain
                  hover:shadow-lg
                  hover:scale-105
                  transition-transform
                  duration-500
                "
              />

            </div>

          </motion.div>

        </div>

      </div>
    </section>
  );
}

export default AboutSection;