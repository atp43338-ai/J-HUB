import { motion } from "framer-motion";

function ProductReviews({ product }) {
  return (
    <div className="mt-12 border-t border-gray-200 pt-10">

      {/* Heading */}
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.6,
          ease: "easeOut",
        }}
        viewport={{ once: true }}
        className="text-2xl font-bold !text-black"
      >
        Customer Reviews
      </motion.h2>

      {/* Rating Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{
          duration: 0.7,
          delay: 0.15,
          ease: "easeOut",
        }}
        viewport={{ once: true }}
        className="mt-5 flex items-center gap-4"
      >

        <div className="text-3xl font-bold text-black">
          0.0
        </div>

        <div>
          <div className="text-yellow-500 text-lg">
            ★★★★★
          </div>

          <p className="text-sm text-gray-500">
            Based on 0 reviews
          </p>
        </div>

      </motion.div>

      {/* No Reviews */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.3,
          ease: "easeOut",
        }}
        viewport={{ once: true }}
        className="mt-8 border border-gray-200 rounded-lg p-6 text-center"
      >

        <p className="text-gray-500">
          No reviews yet.
        </p>

        <p className="mt-2 text-sm text-gray-400">
          Be the first to review this product.
        </p>

      </motion.div>

    </div>
  );
}

export default ProductReviews;