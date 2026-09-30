function CheckoutItems({ items }) {
  return (
    <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-bold !text-black">
          Order Items
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Review the products in your order.
        </p>
      </div>

      {/* Items */}
      <div className="space-y-5">

        {items?.map((item) => {
          const itemTotal =
            item.price * item.quantity;

          return (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row gap-5 border-b border-gray-100 pb-5 last:border-b-0 last:pb-0"
            >
              {/* Image */}
              <div className="w-full sm:w-28 h-28 bg-gray-50 rounded-lg overflow-hidden flex-shrink-0">
                <img
                  src={
                    item.image?.startsWith("http")
                      ? item.image
                      : `http://localhost:5000${item.image}`
                  }
                  alt={item.name}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1">

                <h3 className="text-lg font-semibold text-black">
                  {item.name}
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  Size: {item.size}
                </p>

                <p className="text-sm text-gray-500">
                  Quantity: {item.quantity}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Unit Price: ₹
                  {item.price.toLocaleString("en-IN")}
                </p>

              </div>

              {/* Item Total */}
              <div className="sm:text-right">
                <p className="text-sm text-gray-500">
                  Item Total
                </p>

                <p className="text-lg font-bold text-black mt-1">
                  ₹{itemTotal.toLocaleString("en-IN")}
                </p>
              </div>

            </div>
          );
        })}

      </div>

      {/* Empty */}
      {(!items || items.length === 0) && (
        <div className="py-10 text-center">
          <p className="text-gray-500">
            No items in your order.
          </p>
        </div>
      )}

    </section>
  );
}

export default CheckoutItems;