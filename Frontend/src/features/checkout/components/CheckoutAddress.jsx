
import { useNavigate } from "react-router";

function CheckoutAddress({
  addresses,
  selectedAddress,
  setSelectedAddress,
  checkoutItems,
  addressLoading,
}) {
  const navigate = useNavigate();

  // Add address
  const handleAddAddress = () => {
    navigate("/address/add", {
      state: {
        fromCheckout: true,
        checkoutItems,
      },
    });
  };

  // Edit address
  const handleEditAddress = (e, addressId) => {
    e.stopPropagation();

    navigate(`/address/edit/${addressId}`, {
      state: {
        fromCheckout: true,
        checkoutItems,
      },
    });
  };

  return (
    <section className="rounded-xl p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold !text-black">
          Delivery Address
        </h2>

        <button
          type="button"
          onClick={handleAddAddress}
          className="bg-[#d90416] hover:bg-red-700 px-4 py-2 rounded-lg text-sm font-medium text-white"
        >
          + Add Address
        </button>
      </div>

      {/* LOADING */}
      {addressLoading ? (
        <p className="text-gray-500">
          Loading addresses...
        </p>
      ) : addresses.length === 0 ? (
        /* NO ADDRESS */
        <div className="border border-zinc-300 rounded-lg p-6 text-center">
          <p className="text-gray-500 mb-4">
            No address found.
          </p>

          <button
            type="button"
            onClick={handleAddAddress}
            className="bg-[#d90416] hover:bg-red-700 text-white px-5 py-2 rounded-lg"
          >
            Add Your First Address
          </button>
        </div>
      ) : (
        /* ADDRESS LIST */
        <div className="space-y-4">
          {addresses.map((address) => (
            <div
              key={address._id}
              onClick={() => setSelectedAddress(address._id)}
              className={`border rounded-lg p-5 cursor-pointer transition ${
                selectedAddress === address._id
                  ? "border-[#d90416] bg-red-50"
                  : "border-zinc-300"
              }`}
            >
              <div className="flex justify-between gap-4">
                <div className="flex gap-4">
                  <input
                    type="radio"
                    name="deliveryAddress"
                    checked={selectedAddress === address._id}
                    onChange={() =>
                      setSelectedAddress(address._id)
                    }
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 accent-[#d90416]"
                  />

                  <div>
                    <div className="flex items-center gap-3 mb-2 !text-black">
                      <h3 className="font-semibold">
                        {address.name}
                      </h3>

                      {address.isDefault && (
                        <span className="text-xs bg-[#d90416] text-white px-2 py-1 rounded">
                          Default
                        </span>
                      )}
                    </div>

                    <p className="!text-black">
                      {address.address}
                    </p>

                    <p className="text-gray-600">
                      {address.city}, {address.state}
                    </p>

                    <p className="text-gray-600">
                      PIN: {address.pincode}
                    </p>

                    <p className="text-gray-600">
                      Phone: {address.phone}
                    </p>
                  </div>
                </div>

                {/* EDIT */}
                <button
                  type="button"
                  onClick={(e) =>
                    handleEditAddress(e, address._id)
                  }
                  className="text-red-500 hover:text-red-700 text-sm"
                >
                  Edit
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CheckoutAddress;
