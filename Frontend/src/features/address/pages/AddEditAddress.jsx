import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router";
import AddAddressImage from "../asset/addaddress-bg.png";

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
      // Add page aanenkil fetch venda
      if (!id) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          alert("Please login first");
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
        alert(error.message);
      }
    };

    fetchAddress();
  }, [id, navigate]);


  // ADD / UPDATE ADDRESS
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !phone || !address || !city || !state || !pincode) {
      alert("Please fill all fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first");
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

        alert("Address updated successfully");

        navigate("/address");

        return;


      }

      // ADD NEW ADDRESS
      await addAddress(token, addressData);

      alert("Address added successfully");

      navigate("/address");

    } catch (error) {
      console.error("Address error:", error);
      alert(error.message);
    }
  };


  return (
    <div className="relative min-h-screen overflow-hidden text-white">

      {/* Background Image */}

      <img
        src={AddAddressImage}
        alt="Address background"
        className="fixed inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}

      <div className="fixed inset-0 bg-black/40"></div>


      {/* Main Content */}

      <div className="relative z-10 min-h-screen flex items-center justify-center px-5 py-10">

        {/* Form Card */}

        <div
          className="
            w-full
            max-w-[650px]
            bg-[#111214]/90
            backdrop-blur-md
            border
            border-[#333]
            rounded-[25px]
            p-6
            sm:p-8
            md:p-10
            shadow-2xl
          "
        >

          {/* Heading */}

          <div className="text-center mb-8">

            <h1 className="text-3xl sm:text-4xl font-bold text-white">
              <span className="text-[#d90416]">
                {id ? "Edit" : "Add"}
              </span>{" "}
              Address
            </h1>

            <p className="text-gray-400 text-sm sm:text-base mt-2">
              {id
                ? "Update your delivery address"
                : "Add a new delivery address"}
            </p>

          </div>


          {/* Form */}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Full Name */}

            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Full Name
              </label>

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
                  border-[#444]
                  bg-[#181a1d]/90
                  px-4
                  text-white
                  text-sm
                  placeholder-gray-500
                  outline-none
                  focus:border-[#d90416]
                  transition
                "
              />

            </div>


            {/* Phone */}

            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Phone
              </label>

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
                  border-[#444]
                  bg-[#181a1d]/90
                  px-4
                  text-white
                  text-sm
                  placeholder-gray-500
                  outline-none
                  focus:border-[#d90416]
                  transition
                "
              />

            </div>


            {/* Address */}

            <div>

              <label className="block text-gray-300 text-sm font-medium mb-2">
                Address
              </label>

              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter address"
                rows="3"
                className="
                  w-full
                  rounded-[12px]
                  border
                  border-[#444]
                  bg-[#181a1d]/90
                  px-4
                  py-3
                  text-white
                  text-sm
                  placeholder-gray-500
                  outline-none
                  resize-none
                  focus:border-[#d90416]
                  transition
                "
              />

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
                    border-[#444]
                    bg-[#181a1d]/90
                    px-4
                    text-white
                    text-sm
                    placeholder-gray-500
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
                    border-[#444]
                    bg-[#181a1d]/90
                    px-4
                    text-white
                    text-sm
                    placeholder-gray-500
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
                  border-[#444]
                  bg-[#181a1d]/90
                  px-4
                  text-white
                  text-sm
                  placeholder-gray-500
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