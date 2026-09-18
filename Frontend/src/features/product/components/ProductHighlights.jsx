import { motion } from "framer-motion";

function ProductHighlights({ product }) {
  return (
    <div className="mt-10">

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
        Product Highlights
      </motion.h2>

      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          viewport={{ once: true }}
          className="border border-gray-200 rounded-lg p-4"
        >
          <p className="text-sm text-gray-500">
            Brand
          </p>
          <p className="mt-1 font-semibold text-black">
            {product.brand}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="border border-gray-200 rounded-lg p-4"
        >
          <p className="text-sm text-gray-500">
            Collection
          </p>
          <p className="mt-1 font-semibold text-black">
            {product.collection}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="border border-gray-200 rounded-lg p-4"
        >
          <p className="text-sm text-gray-500">
            Category
          </p>
          <p className="mt-1 font-semibold text-black">
            {product.category}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
          className="border border-gray-200 rounded-lg p-4"
        >
          <p className="text-sm text-gray-500">
            Available Sizes
          </p>
          <p className="mt-1 font-semibold text-black">
            {product.sizes?.join(", ")}
          </p>
        </motion.div>

      </div>

    </div>
  );
}

export default ProductHighlights;