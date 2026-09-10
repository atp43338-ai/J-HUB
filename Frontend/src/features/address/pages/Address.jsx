import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AddressImage from "../asset/Address-bg.png";

import { getAddresses, deleteAddress } from "../services/addressService";

function Address() {
  const [addresses, setAddresses] = useState([]);

  const navigate = useNavigate();

  // GET ADDRESSES

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
          navigate("/login");
          return;
        }

        const data = await getAddresses(token);

        setAddresses(data.addresses);
      } catch (error) {
        console.error("Get addresses error:", error);
        alert(error.message);
      }
    };

    fetchAddresses();
  }, [navigate]);


  // DELETE ADDRESS
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await deleteAddress(token, id);

      alert("Address deleted successfully");

      // Remove deleted address from UI

      setAddresses((prevAddresses) =>
        prevAddresses.filter(
          (address) => address._id !== id
        )
      );

    } catch (error) {
      console.error("Delete address error:", error);
      alert(error.message);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Background Image */}

      <img
        src={AddressImage}
        alt="Address background"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}

      <div className="fixed inset-0 bg-black/40"></div>


      {/* Main Content */}

      <div className="relative z-10 w-full min-h-screen px-5 py-8 sm:px-8 md:px-12 lg:px-16">

        {/* Header */}

        <div className="w-full">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5 mb-10">

            {/* Title */}

            <div>
              <h1 className="text-3xl sm:text-4xl font-bold">
                <span className="text-[#d90416]">My</span>{" "}
                Addresses
              </h1>

              <p className="text-gray-400 text-sm sm:text-base mt-2">
                Manage your delivery addresses
              </p>
            </div>


            {/* Add Address */}

            <button
              onClick={() => navigate("/address/add")}
              className="
                w-full
                sm:w-auto
                px-6
                h-[48px]
                rounded-[12px]
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                text-sm
                font-semibold
                transition
              "
            >
              + Add New Address
            </button>

          </div>


          {/* Address List */}

          {addresses.length === 0 ? (

            /* Empty State */

            <div
              className="
                border
                border-[#333]
                rounded-[20px]
                bg-[#181a1d]/90
                p-10
                text-center
              "
            >

              <div className="text-5xl mb-4">
                📍
              </div>

              <h2 className="text-xl font-semibold">
                No addresses found
              </h2>

              <p className="text-gray-400 text-sm mt-2">
                Add an address to make your delivery easier.
              </p>

              <button
                onClick={() => navigate("/address/add")}
                className="
                  mt-6
                  px-6
                  h-[45px]
                  rounded-[12px]
                  bg-[#d90416]
                  hover:bg-[#b90312]
                  text-white
                  text-sm
                  font-semibold
                "
              >
                Add Address
              </button>

            </div>

          ) : (

            /* Address Cards */

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                gap-6
              "
            >

              {addresses.map((address) => (

                <div
                  key={address._id}
                  className="
                    bg-[#181a1d]/90
                    border
                    border-[#333]
                    hover:border-[#d90416]
                    rounded-[20px]
                    p-6
                    transition
                  "
                >

                  {/* Card Header */}

                  <div className="flex items-center justify-between mb-5">

                    <div className="flex items-center gap-3">

                      {/* Location Icon */}

                      <div
                        className="
                          w-[45px]
                          h-[45px]
                          rounded-full
                          bg-[#d90416]/15
                          flex
                          items-center
                          justify-center
                          text-xl
                        "
                      >
                        📍
                      </div>

                      <div>

                        <h3 className="text-lg font-semibold">
                          {address.name}
                        </h3>

                        <p className="text-gray-400 text-sm">
                          Home Address
                        </p>

                      </div>

                    </div>

                  </div>


                  {/* Address Details */}

                  <div className="space-y-3 text-sm">

                    {/* Phone */}

                    <div className="flex gap-3">

                      <span className="text-gray-500 w-[70px]">
                        Phone
                      </span>

                      <span className="text-gray-200">
                        {address.phone}
                      </span>

                    </div>


                    {/* Address */}

                    <div className="flex gap-3">

                      <span className="text-gray-500 w-[70px]">
                        Address
                      </span>

                      <span className="text-gray-200">
                        {address.address}
                      </span>

                    </div>


                    {/* City */}

                    <div className="flex gap-3">

                      <span className="text-gray-500 w-[70px]">
                        City
                      </span>

                      <span className="text-gray-200">
                        {address.city}
                      </span>

                    </div>


                    {/* State */}

                    <div className="flex gap-3">

                      <span className="text-gray-500 w-[70px]">
                        State
                      </span>

                      <span className="text-gray-200">
                        {address.state}
                      </span>

                    </div>


                    {/* Pincode */}

                    <div className="flex gap-3">

                      <span className="text-gray-500 w-[70px]">
                        Pincode
                      </span>

                      <span className="text-gray-200">
                        {address.pincode}
                      </span>

                    </div>

                  </div>


                  {/* Divider */}

                  <div className="border-t border-[#333] my-5"></div>


                  {/* Buttons */}

                  <div className="flex gap-3">

                    {/* Edit */}

                    <button
                      onClick={() =>
                        navigate(`/address/edit/${address._id}`)
                      }
                      className="
                        flex-1
                        h-[44px]
                        rounded-[10px]
                        border
                        border-[#444]
                        hover:border-[#d90416]
                        hover:text-[#d90416]
                        text-gray-300
                        text-sm
                        font-semibold
                        transition
                      "
                    >
                      Edit
                    </button>


                    {/* Delete */}

                    <button
                      onClick={() =>
                        handleDelete(address._id)
                      }
                      className="
                        flex-1
                        h-[44px]
                        rounded-[10px]
                        bg-[#d90416]
                        hover:bg-[#b90312]
                        text-white
                        text-sm
                        font-semibold
                        transition
                      "
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}

export default Address;