import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import AddAddressImage from "../asset/addaddress-bg.png";
import toast from "react-hot-toast";

import {
  getAddress,
  addAddress,
  updateAddress,
} from "../services/addressService";

function AddEditAddress() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  console.log("address ID:", id);

  // GET EXISTING ADDRESS
  useEffect(() => {
    const fetchAddress = async () => {
      if (!id) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          toast.error("Please login first");
          navigate("/login");
          return;
        }

        const data = await getAddress(token, id);

        const addressData = data.address;

        setName(addressData.name || "");
        setPhone(addressData.phone || "");
        setAddress(addressData.address || "");
        setCity(addressData.city || "");
        setState(addressData.state || "");
        setPincode(addressData.pincode || "");
      } catch (error) {
        console.error("Get address error:", error);
        toast.error(error.message);
      }
    };

    fetchAddress();
  }, [id, navigate]);

  // ADD / UPDATE ADDRESS
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !address || !city || !state || !pincode) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      const addressData = {
        name,
        phone,
        address,
        city,
        state,
        pincode,
      };

      // UPDATE ADDRESS
      if (id) {
        await updateAddress(token, id, addressData);

        toast.success("Address updated successfully");

        navigate("/address");

        return;
      }

      // ADD NEW ADDRESS
      await addAddress(token, addressData);

      toast.success("Address added successfully");

      navigate("/address");
    } catch (error) {
      console.error("Address error:", error);
      toast.error(error.message);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">

      {/* Background Image */}
      <img
        src={AddAddressImage}
        alt="Address background"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-black/60"></div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10">

        {/* Main Card */}
        <div
          className="
            w-full
            max-w-[650px]
            bg-[#111214]/95
            backdrop-blur-xl
            border
            border-white/10
            rounded-[22px]
            p-6
            sm:p-8
            md:p-10
            shadow-2xl
          "
        >

          {/* Header */}
          <div className="mb-8">

            <div className="flex items-center gap-3 mb-3">

              {/* Location Icon */}
              <div
                className="
                  w-11
                  h-11
                  rounded-xl
                  bg-[#d90416]/10
                  border
                  border-[#d90416]/20
                  flex
                  items-center
                  justify-center
                "
              >
                <svg
                  className="w-5 h-5 text-[#d90416]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M12 21s7-5.686 7-12A7 7 0 005 9c0 6.314 7 12 7 12z"
                  />
                  <circle
                    cx="12"
                    cy="9"
                    r="2.5"
                    strokeWidth="1.8"
                  />
                </svg>
              </div>

              <div>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">
                  <span className="text-[#d90416]">
                    {id ? "Edit" : "Add"}
                  </span>{" "}
                  Address
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {id
                    ? "Update your delivery address"
                    : "Add a new delivery address"}
                </p>
              </div>

            </div>

          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}
            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Full Name
              </label>

              <div className="relative">

                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M20 21a8 8 0 00-16 0M12 11a4 4 0 100-8 4 4 0 000 8z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter full name"
                  className="
                    w-full
                    h-[52px]
                    rounded-[12px]
                    border
                    border-[#333]
                    bg-[#181a1d]
                    pl-12
                    pr-4
                    text-white
                    text-sm
                    placeholder-gray-600
                    outline-none
                    focus:border-[#d90416]
                    transition
                  "
                />

              </div>

            </div>

            {/* Phone */}
            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Phone
              </label>

              <div className="relative">

                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M3 5a2 2 0 012-2h2.3a1 1 0 01.95.68l1.1 3.3a1 1 0 01-.27 1.05L7.7 9.42a16 16 0 006.88 6.88l1.39-1.38a1 1 0 011.05-.27l3.3 1.1a1 1 0 01.68.95V19a2 2 0 01-2 2h-1C10.27 21 3 13.73 3 5V5z"
                    />
                  </svg>
                </div>

                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="
                    w-full
                    h-[52px]
                    rounded-[12px]
                    border
                    border-[#333]
                    bg-[#181a1d]
                    pl-12
                    pr-4
                    text-white
                    text-sm
                    placeholder-gray-600
                    outline-none
                    focus:border-[#d90416]
                    transition
                  "
                />

              </div>

            </div>

            {/* Address */}
            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Address
              </label>

              <div className="relative">

                <div className="absolute left-4 top-4 text-gray-500">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.8"
                      d="M12 21s7-5.686 7-12A7 7 0 005 9c0 6.314 7 12 7 12z"
                    />
                    <circle
                      cx="12"
                      cy="9"
                      r="2.5"
                      strokeWidth="1.8"
                    />
                  </svg>
                </div>

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter address"
                  rows="3"
                  className="
                    w-full
                    rounded-[12px]
                    border
                    border-[#333]
                    bg-[#181a1d]
                    pl-12
                    pr-4
                    py-3
                    text-white
                    text-sm
                    placeholder-gray-600
                    outline-none
                    resize-none
                    focus:border-[#d90416]
                    transition
                  "
                />

              </div>

            </div>

            {/* City + State */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              {/* City */}
              <div>

                <label className="block text-gray-300 text-sm font-medium mb-2">
                  City
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city"
                  className="
                    w-full
                    h-[52px]
                    rounded-[12px]
                    border
                    border-[#333]
                    bg-[#181a1d]
                    px-4
                    text-white
                    text-sm
                    placeholder-gray-600
                    outline-none
                    focus:border-[#d90416]
                    transition
                  "
                />

              </div>

              {/* State */}
              <div>

                <label className="block text-gray-300 text-sm font-medium mb-2">
                  State
                </label>

                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="Enter state"
                  className="
                    w-full
                    h-[52px]
                    rounded-[12px]
                    border
                    border-[#333]
                    bg-[#181a1d]
                    px-4
                    text-white
                    text-sm
                    placeholder-gray-600
                    outline-none
                    focus:border-[#d90416]
                    transition
                  "
                />

              </div>

            </div>

            {/* Pincode */}
            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Pincode
              </label>

              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="Enter pincode"
                className="
                  w-full
                  h-[52px]
                  rounded-[12px]
                  border
                  border-[#333]
                  bg-[#181a1d]
                  px-4
                  text-white
                  text-sm
                  placeholder-gray-600
                  outline-none
                  focus:border-[#d90416]
                  transition
                "
              />

            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="
                w-full
                h-[52px]
                mt-3
                rounded-[12px]
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                text-[15px]
                font-semibold
                transition
                shadow-lg
                shadow-red-950/20
              "
            >
              {id ? "Update Address" : "Save Address"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
}

export default AddEditAddress;