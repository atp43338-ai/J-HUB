import { motion } from "framer-motion";

function BrowseCollection({
  collectionItems,
  subCategory,
  setSubCategory,
  setCurrentPage,
}) {
  return (
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

          {collectionItems.map((item, index) => (

            <motion.button
              key={item.name}
              onClick={() => {
                setSubCategory(item.name);
                setCurrentPage(1);
              }}
              initial={{
                opacity: 0,
                scale: 0.7,
                y: 30,
              }}
              whileInView={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              transition={{
                duration: 0.6,
                delay: index * 0.15,
                ease: "easeOut",
              }}
              viewport={{ once: true }}
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

            </motion.button>

          ))}

        </div>

      </div>

    </section>
  );
}

export default BrowseCollection;