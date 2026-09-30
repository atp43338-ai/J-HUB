import { useEffect, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router";

import toast from "react-hot-toast";

import {
  getAddress,
  addAddress,
  updateAddress,
} from "../services/addressService";

function AddEditAddress() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  const token = localStorage.getItem("token");

  // -----------------------------------
  // Check if coming from checkout
  // -----------------------------------
  const fromCheckout = location.state?.fromCheckout;

  const checkoutItems = location.state?.checkoutItems || [];

  // -----------------------------------
  // Form state
  // -----------------------------------
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");

  const [isDefault, setIsDefault] = useState(false);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // -----------------------------------
  // Fetch address when editing
  // -----------------------------------
  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchAddress = async () => {
      try {
        setPageLoading(true);

        const data = await getAddress(token, id);

        const addressData = data.address;

        if (!addressData) {
          toast.error("Address not found");
          navigate("/address");
          return;
        }

        setName(addressData.name || "");
        setPhone(addressData.phone || "");
        setAddress(addressData.address || "");
        setCity(addressData.city || "");
        setState(addressData.state || "");
        setPincode(addressData.pincode || "");

        setIsDefault(addressData.isDefault || false);
      } catch (error) {
        console.error(error);
        toast.error(error.message || "Failed to fetch address");
        navigate("/address");
      } finally {
        setPageLoading(false);
      }
    };

    fetchAddress();
  }, [id, token, navigate]);

  // -----------------------------------
  // Submit form
  // -----------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    // -----------------------------------
    // Validation
    // -----------------------------------

    if (!name.trim()) {
      toast.error("Please enter name");
      return;
    }

    if (!phone.trim()) {
      toast.error("Please enter phone number");
      return;
    }

    if (!address.trim()) {
      toast.error("Please enter address");
      return;
    }

    if (!city.trim()) {
      toast.error("Please enter city");
      return;
    }

    if (!state.trim()) {
      toast.error("Please enter state");
      return;
    }

    if (!pincode.trim()) {
      toast.error("Please enter pincode");
      return;
    }

    // -----------------------------------
    // Address data
    // -----------------------------------

    const addressData = {
      name: name.trim(),
      phone: phone.trim(),
      address: address.trim(),
      city: city.trim(),
      state: state.trim(),
      pincode: pincode.trim(),
      isDefault,
    };

    try {
      setLoading(true);

      // -----------------------------------
      // UPDATE
      // -----------------------------------

      if (id) {
        await updateAddress(token, id, addressData);

        toast.success("Address updated successfully");

        // Return to checkout
        if (fromCheckout) {
          navigate("/checkout", {
            state: {
              items: checkoutItems,
            },
          });
        } else {
          navigate("/address");
        }

        return;
      }

      // -----------------------------------
      // ADD
      // -----------------------------------

      await addAddress(token, addressData);

      toast.success("Address added successfully");

      // Return to checkout
      if (fromCheckout) {
        navigate("/checkout", {
          state: {
            items: checkoutItems,
          },
        });
      } else {
        navigate("/address");
      }
    } catch (error) {
      console.error(error);

      toast.error(
        error.message || "Failed to save address"
      );
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p className="text-gray-400">
          Loading address...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-2xl bg-zinc-900 rounded-2xl p-8 shadow-xl">

        {/* TITLE */}

        <h1 className="text-2xl font-bold mb-2">
          {id ? "Edit Address" : "Add Address"}
        </h1>

        <p className="text-gray-400 mb-8">
          {id
            ? "Update your delivery address"
            : "Add a new delivery address"}
        </p>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* NAME */}

          <div>
            <label className="block text-sm mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Enter your name"
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="block text-sm mb-2">
              Phone
            </label>

            <input
              type="text"
              value={phone}
              onChange={(e) =>
                setPhone(e.target.value)
              }
              placeholder="Enter phone number"
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />
          </div>

          {/* ADDRESS */}

          <div>
            <label className="block text-sm mb-2">
              Address
            </label>

            <textarea
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Enter your address"
              rows="4"
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-[#d90416] resize-none"
            />
          </div>

          {/* CITY */}

          <div>
            <label className="block text-sm mb-2">
              City
            </label>

            <input
              type="text"
              value={city}
              onChange={(e) =>
                setCity(e.target.value)
              }
              placeholder="Enter city"
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />
          </div>

          {/* STATE */}

          <div>
            <label className="block text-sm mb-2">
              State
            </label>

            <input
              type="text"
              value={state}
              onChange={(e) =>
                setState(e.target.value)
              }
              placeholder="Enter state"
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />
          </div>

          {/* PINCODE */}

          <div>
            <label className="block text-sm mb-2">
              Pincode
            </label>

            <input
              type="text"
              value={pincode}
              onChange={(e) =>
                setPincode(e.target.value)
              }
              placeholder="Enter pincode"
              className="w-full bg-black border border-zinc-700 rounded-lg px-4 py-3 outline-none focus:border-[#d90416]"
            />
          </div>

          {/* DEFAULT ADDRESS */}

          <div className="flex items-center gap-3">

            <input
              type="checkbox"
              id="isDefault"
              checked={isDefault}
              onChange={(e) =>
                setIsDefault(e.target.checked)
              }
              className="w-5 h-5 accent-[#d90416]"
            />

            <label
              htmlFor="isDefault"
              className="text-sm text-gray-300 cursor-pointer"
            >
              Set as default address
            </label>

          </div>

          {/* BUTTONS */}

          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={() => {
                if (fromCheckout) {
                  navigate("/checkout", {
                    state: {
                      items: checkoutItems,
                    },
                  });
                } else {
                  navigate("/address");
                }
              }}
              className="flex-1 border border-zinc-700 hover:bg-zinc-800 py-3 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#d90416] hover:bg-red-700 disabled:opacity-50 py-3 rounded-lg font-medium"
            >
              {loading
                ? "Saving..."
                : id
                ? "Update Address"
                : "Add Address"}
            </button>

          </div>

        </form>
      </div>

    </div>
  );
}

export default AddEditAddress;