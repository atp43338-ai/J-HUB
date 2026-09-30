import { motion } from "framer-motion";

function ProductHero() {
  return (
    <section className="relative overflow-hidden bg-black text-white min-h-[735px]">

      {/* Background Red Glow */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 0.25, scale: 1 }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="
          absolute
          right-[15%]
          top-[15%]
          w-[450px]
          h-[450px]
          bg-[#d90416]
          rounded-full
          blur-[150px]
        "
      />

      <div className="max-w-[1400px] mx-auto min-h-[520px] px-6 md:px-10 flex items-center">

        {/* Left Content */}
        <motion.div
          initial={{
            opacity: 0,
            x: -100,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="relative z-10 w-full lg:w-1/2 py-20"
        >

          {/* Small Label */}
          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="
              text-[#d90416]
              font-semibold
              tracking-[0.3em]
              text-sm
              uppercase
            "
          >
            J-HUB Collection
          </motion.p>

          {/* Heading */}
          <motion.h1
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.35,
              ease: "easeOut",
            }}
            className="
              mt-5
              text-5xl
              md:text-6xl
              lg:text-7xl
              font-extrabold
              leading-tight
              !text-white
            "
          >
            All Jerseys
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{
              opacity: 0,
              y: 40,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.5,
              ease: "easeOut",
            }}
            className="
              mt-6
              max-w-xl
              text-gray-400
              text-lg
              md:text-xl
              leading-relaxed
            "
          >
            Find your favourite club, national team, legendary player and
            latest season jerseys all in one place.
          </motion.p>

        </motion.div>

        {/* Player Image */}
        <motion.div
          initial={{
            opacity: 0,
            x: 150,
            scale: 0.85,
          }}
          animate={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          transition={{
            duration: 1.2,
            delay: 0.2,
            ease: "easeOut",
          }}
          className="
            absolute
            right-0
            bottom-0
            w-[55%]
            lg:w-[48%]
            h-full
            flex
            items-end
            justify-center
          "
        >

          {/* Player Glow */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.7,
            }}
            animate={{
              opacity: 0.3,
              scale: 1,
            }}
            transition={{
              duration: 1.5,
              delay: 0.5,
            }}
            className="
              absolute
              bottom-[10%]
              w-[350px]
              h-[350px]
              bg-[#d90416]
              rounded-full
              blur-[100px]
            "
          />

          {/* Player */}
          <motion.img
            src="/hazard-img.png"
            alt="Football Player"
            initial={{
              opacity: 0,
              y: 50,
            }}
            animate={{
              opacity: 1,
              y: [0, -10, 0],
            }}
            transition={{
              opacity: {
                duration: 0.8,
                delay: 0.5,
              },
              y: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            className="
              relative
              z-10
              h-full
              max-h-[600px]
              w-auto
              object-contain
            "
          />

        </motion.div>

      </div>
    </section>
  );
}

export default ProductHero;