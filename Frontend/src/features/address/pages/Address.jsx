import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import AddressImage from "../asset/Address-bg.png";
import toast from "react-hot-toast";

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
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const data = await getAddresses(token);

        setAddresses(data.addresses);
      } catch (error) {
        console.error("Get addresses error:", error);
        toast.error(error.message);
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
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      await deleteAddress(token, id);

      toast.success("Address deleted successfully");

      setAddresses((prevAddresses) =>
        prevAddresses.filter(
          (address) => address._id !== id
        )
      );

    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(error.message);
    }
  };


  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">

      {/* Background */}

      <img
        src={AddressImage}
        alt="Address background"
        className="absolute inset-0 w-full h-full object-fill"
      />

      {/* Dark Overlay */}

      <div className="absolute inset-0 bg-black/25"></div>


      {/* Main Container */}

      <div className="absolute inset-0 flex items-center justify-center">

        <div
          className="
            w-[70%]
            h-[82%]
            flex
            overflow-hidden
            rounded-[18px]
            shadow-2xl
          "
        >

          {/* ========================================= */}
          {/* LEFT SIDEBAR */}
          {/* ========================================= */}

          <div
            className="
              w-[28%]
              h-full
              bg-[#111214]
              px-5
              py-7
              flex
              flex-col
            "
          >

            {/* Profile */}

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                text-gray-300
                text-[14px]
                font-semibold
                hover:bg-white/5
                transition
              "
            >

              {/* Profile Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <circle
                  cx="12"
                  cy="8"
                  r="3.5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 20a7 7 0 0 1 14 0"
                />
              </svg>

              Profile

            </button>


            {/* Address - Active */}

            <button
              type="button"
              className="
                w-full
                h-[54px]
                rounded-[9px]
                bg-[#650810]
                flex
                items-center
                px-5
                mt-2
                text-white
                text-[14px]
                font-semibold
              "
            >

              {/* Location Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
                />

                <circle
                  cx="12"
                  cy="10"
                  r="2.5"
                />
              </svg>

              Address

            </button>


            {/* Change Password */}

            <button
              type="button"
              onClick={() => navigate("/change-password")}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                mt-2
                text-gray-300
                text-[14px]
                font-semibold
                hover:bg-white/5
                transition
              "
            >

              {/* Lock Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <rect
                  x="5"
                  y="10"
                  width="14"
                  height="10"
                  rx="2"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 10V7a4 4 0 0 1 8 0v3"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 14v2"
                />
              </svg>

              Change Password

            </button>


            {/* Settings */}

            <button
              type="button"
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                mt-2
                text-gray-300
                text-[14px]
                font-semibold
                bg-white/[0.02]
                hover:bg-white/5
                transition
              "
            >

              {/* Settings Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="3"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.05.05-1.7 1.7-.05-.05a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1.04 1.56V20h-2.4v-.2a1.7 1.7 0 0 0-1.04-1.56 1.7 1.7 0 0 0-1.88.34l-.05.05-1.7-1.7.05-.05A1.7 1.7 0 0 0 8.4 15a1.7 1.7 0 0 0-1.56-1.04H6.6v-2.4h.24A1.7 1.7 0 0 0 8.4 10a1.7 1.7 0 0 0-.34-1.88l-.05-.05 1.7-1.7.05.05a1.7 1.7 0 0 0 1.88.34A1.7 1.7 0 0 0 12.68 5.2V5h2.4v.2a1.7 1.7 0 0 0 1.04 1.56 1.7 1.7 0 0 0 1.88-.34l.05-.05 1.7 1.7-.05.05A1.7 1.7 0 0 0 19.4 10a1.7 1.7 0 0 0 1.56 1.04h.24v2.4h-.24A1.7 1.7 0 0 0 19.4 15Z"
                />
              </svg>

              Settings

            </button>


            {/* Logout */}

            <button
              type="button"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/", { replace: true });
              }}
              className="
                w-full
                h-[54px]
                rounded-[9px]
                flex
                items-center
                px-5
                mt-2
                text-gray-300
                text-[14px]
                font-semibold
                hover:bg-white/5
                transition
              "
            >

              {/* Logout Icon */}

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="w-5 h-5 mr-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 17l5-5-5-5"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 12H3"
                />

                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 19V5a2 2 0 0 0-2-2h-6"
                />
              </svg>

              Logout

            </button>

          </div>


          {/* ========================================= */}
          {/* RIGHT SIDE */}
          {/* ========================================= */}

          <div
            className="
              w-[72%]
              h-full
              bg-white
              relative
              px-10
              py-8
              overflow-y-auto
            "
          >

            {/* Header */}

            <div className="flex items-start justify-between">

              <div>

                 <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
                 <span className="text-black">My </span>
                 <span className="text-[#d90416]">Address</span>
               </h2>

                <p className="text-[11px] text-gray-500 mt-1">
                  Manage your delivery addresses
                </p>

              </div>


              {/* Add Address */}

              <button
                onClick={() => navigate("/address/add")}
                className="
                  h-[42px]
                  px-5
                  rounded-[7px]
                  bg-[#d90416]
                  hover:bg-[#b90312]
                  text-white
                  text-[12px]
                  font-semibold
                  transition
                "
              >
                + Add Address
              </button>

            </div>


            {/* Address List */}

            {addresses.length === 0 ? (

              /* Empty State */

              <div
                className="
                  mt-10
                  border
                  border-[#e1e1e1]
                  rounded-[12px]
                  bg-[#fafafa]
                  p-10
                  text-center
                "
              >

                {/* Location Icon */}

                <div
                  className="
                    mx-auto
                    w-[60px]
                    h-[60px]
                    rounded-full
                    bg-[#d90416]/10
                    flex
                    items-center
                    justify-center
                  "
                >

                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    className="w-7 h-7 text-[#d90416]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
                    />

                    <circle
                      cx="12"
                      cy="10"
                      r="2.5"
                    />
                  </svg>

                </div>

                <h2 className="text-[16px] font-semibold text-[#222] mt-4">
                  No addresses found
                </h2>

                <p className="text-gray-500 text-[11px] mt-2">
                  Add an address to make your delivery easier.
                </p>

                <button
                  onClick={() => navigate("/address/add")}
                  className="
                    mt-5
                    px-5
                    h-[40px]
                    rounded-[7px]
                    bg-[#d90416]
                    hover:bg-[#b90312]
                    text-white
                    text-[11px]
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
                  gap-4
                  mt-7
                "
              >

                {addresses.map((address) => (

                  <div
                    key={address._id}
                    className="
                      border
                      border-[#dedede]
                      rounded-[10px]
                      bg-white
                      p-5
                      hover:border-[#d90416]
                      transition
                    "
                  >

                    {/* Card Header */}

                    <div className="flex items-center justify-between">

                      <div className="flex items-center gap-3">

                        {/* Location Icon */}

                        <div
                          className="
                            w-[42px]
                            h-[42px]
                            rounded-full
                            bg-[#d90416]/10
                            flex
                            items-center
                            justify-center
                          "
                        >

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="w-5 h-5 text-[#d90416]"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"
                            />

                            <circle
                              cx="12"
                              cy="10"
                              r="2.5"
                            />
                          </svg>

                        </div>


                        <div>

                          <h3 className="text-[14px] font-semibold text-[#222]">
                            {address.name}
                          </h3>

                          <p className="text-gray-500 text-[10px] mt-1">
                            Home Address
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* Address Details */}

                    <div className="mt-5 space-y-2">

                      {/* Phone */}

                      <div className="flex text-[11px]">

                        <span className="text-gray-500 w-[70px]">
                          Phone
                        </span>

                        <span className="text-[#333]">
                          {address.phone}
                        </span>

                      </div>


                      {/* Address */}

                      <div className="flex text-[11px]">

                        <span className="text-gray-500 w-[70px]">
                          Address
                        </span>

                        <span className="text-[#333]">
                          {address.address}
                        </span>

                      </div>


                      {/* City */}

                      <div className="flex text-[11px]">

                        <span className="text-gray-500 w-[70px]">
                          City
                        </span>

                        <span className="text-[#333]">
                          {address.city}
                        </span>

                      </div>


                      {/* State */}

                      <div className="flex text-[11px]">

                        <span className="text-gray-500 w-[70px]">
                          State
                        </span>

                        <span className="text-[#333]">
                          {address.state}
                        </span>

                      </div>


                      {/* Pincode */}

                      <div className="flex text-[11px]">

                        <span className="text-gray-500 w-[70px]">
                          Pincode
                        </span>

                        <span className="text-[#333]">
                          {address.pincode}
                        </span>

                      </div>

                    </div>


                    {/* Divider */}

                    <div className="border-t border-[#e5e5e5] my-4"></div>


                    {/* Buttons */}

                    <div className="flex gap-3">

                      {/* Edit */}

                      <button
                        onClick={() =>
                          navigate(`/address/edit/${address._id}`)
                        }
                        className="
                          flex-1
                          h-[38px]
                          rounded-[7px]
                          border
                          border-[#d5d5d5]
                          hover:border-[#d90416]
                          hover:text-[#d90416]
                          text-gray-600
                          text-[11px]
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
                          h-[38px]
                          rounded-[7px]
                          bg-[#d90416]
                          hover:bg-[#b90312]
                          text-white
                          text-[11px]
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

    </div>
  );
}

export default Address;