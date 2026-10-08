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

import ProfileLayout from "../../profile/components/ProfileLayout";
import ProfileHeader from "../../profile/components/ProfileHeader";

import AddressForm from "../components/AddressForm";

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
  // Modal state
  // -----------------------------------

  const [errorMessage, setErrorMessage] = useState("");

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

        toast.error(
          error.message || "Failed to fetch address"
        );

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

    // Phone must be exactly 10 digits
    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      setErrorMessage(
        "Please enter a valid 10-digit phone number"
      );
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

    // Pincode must be exactly 6 digits
    if (!/^\d{6}$/.test(pincode.trim())) {
      setErrorMessage(
        "Please enter a valid 6-digit pincode"
      );
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
  // Cancel
  // -----------------------------------

  const handleCancel = () => {
    if (fromCheckout) {
      navigate("/checkout", {
        state: {
          items: checkoutItems,
        },
      });
    } else {
      navigate("/address");
    }
  };

  // -----------------------------------
  // Loading
  // -----------------------------------

  if (pageLoading) {
    return (
      <ProfileLayout
        title={id ? "Edit" : "Add"}
        highlight="Address"
        description={
          id
            ? "Update your delivery address"
            : "Add a new delivery address"
        }
      >
        <div className="min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500 text-sm">
            Loading address...
          </p>
        </div>
      </ProfileLayout>
    );
  }

  // -----------------------------------
  // UI
  // -----------------------------------

  return (
    <ProfileLayout
      title={id ? "Edit" : "Add"}
      highlight="Address"
      description={
        id
          ? "Update your delivery address"
          : "Add a new delivery address"
      }
    >
      {/* -----------------------------------
          Validation Modal
      ----------------------------------- */}

      {errorMessage && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 text-center">

            {/* Error Icon */}
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xl font-bold">
                ×
              </div>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Invalid Details
            </h3>

            {/* Message */}
            <p className="mt-2 text-sm text-gray-500">
              {errorMessage}
            </p>

            {/* OK Button */}
            <button
              type="button"
              onClick={() => setErrorMessage("")}
              className="
                mt-5
                w-full
                h-10
                rounded-lg
                bg-[#d90416]
                hover:bg-[#b90312]
                text-white
                text-sm
                font-semibold
                transition
              "
            >
              OK
            </button>

          </div>
        </div>
      )}

      <ProfileHeader
        title={id ? "Edit" : "Add"}
        highlight="Address"
        description={
          id
            ? "Update your saved delivery address"
            : "Add a new delivery address"
        }
      />

      <div className="max-w-4xl">
        <AddressForm
          name={name}
          setName={setName}
          phone={phone}
          setPhone={setPhone}
          address={address}
          setAddress={setAddress}
          city={city}
          setCity={setCity}
          state={state}
          setState={setState}
          pincode={pincode}
          setPincode={setPincode}
          isDefault={isDefault}
          setIsDefault={setIsDefault}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          isEdit={Boolean(id)}
        />
      </div>
    </ProfileLayout>
  );
}

export default AddEditAddress;