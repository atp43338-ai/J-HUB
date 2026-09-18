import { useState } from "react";
import { motion } from "framer-motion";
import HomeBackground from "../asset/home-bg.png";
import JerseyImage from "../asset/jersey-img.png";

function HeroSection() {
  const [jerseyMove, setJerseyMove] = useState({
    x: 0,
    y: 0,
  });

  return (
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
      <motion.img
        src={HomeBackground}
        alt="J-HUB Home"
        initial={{
          opacity: 0,
          scale: 1.08,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        transition={{
          duration: 1.5,
          ease: "easeOut",
        }}
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
      />

      {/* Jersey Image */}
      <motion.div
        initial={{
          opacity: 0,
          x: 100,
          scale: 0.85,
        }}
        animate={{
          opacity: 1,
          x: jerseyMove.x,
          scale: 1,
        }}
        transition={{
          opacity: {
            duration: 1,
            delay: 0.4,
          },
          x: {
            duration: 0.3,
            ease: "easeOut",
          },
          scale: {
            duration: 1.2,
            delay: 0.4,
            ease: "easeOut",
          },
        }}
        className="
          absolute
          right-[8%]
          top-1/2
          -translate-y-1/2
          z-10
        "
        style={{
          marginTop: jerseyMove.y,
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
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-20 h-full flex items-center">

        <div className="ml-[8%] max-w-[550px]">

          <motion.h1
            initial={{
              opacity: 0,
              x: -80,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.9,
              delay: 0.5,
              ease: "easeOut",
            }}
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mt-3"
          >
            Your Style.
            <br />
            <span className="text-[#d90416]">
              Your Game.
            </span>
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              x: -60,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.8,
              ease: "easeOut",
            }}
            className="mt-6 text-lg text-gray-300 max-w-[450px]"
          >
            Discover premium jerseys designed for your game and your style.
          </motion.p>

          <motion.a
            href="#shop"
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 1.1,
              ease: "easeOut",
            }}
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
          </motion.a>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;