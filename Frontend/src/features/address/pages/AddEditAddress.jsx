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

  const fromCheckout = location.state?.fromCheckout;
  const checkoutItems = location.state?.checkoutItems || [];

  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  // Loading state
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);

  // Inline validation errors only
  const [errors, setErrors] = useState({});

  // Fetch address when editing
  useEffect(() => {
    if (!id) return;

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

  // Validate all fields
  const validateForm = () => {
    const newErrors = {};

    if (name.trim().length < 3) {
      newErrors.name = "Name must contain at least 3 characters";
    }

    if (!/^[6-9]\d{9}$/.test(phone.trim())) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!city.trim()) {
      newErrors.city = "City is required";
    }

    if (!state.trim()) {
      newErrors.state = "State is required";
    }

    if (!/^\d{6}$/.test(pincode.trim())) {
      newErrors.pincode = "Pincode must contain exactly 6 digits";
    }

    return newErrors;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    // Show inline errors only
    if (Object.keys(newErrors).length > 0) {
      return;
    }

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

      if (id) {
        await updateAddress(token, id, addressData);
        toast.success("Address updated successfully");
      } else {
        await addAddress(token, addressData);
        toast.success("Address added successfully");
      }

      if (fromCheckout) {
        navigate("/checkout", {
          state: { items: checkoutItems },
        });
      } else {
        navigate("/address");
      }
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  // Cancel
  const handleCancel = () => {
    if (fromCheckout) {
      navigate("/checkout", {
        state: { items: checkoutItems },
      });
    } else {
      navigate("/address");
    }
  };

  // Loading screen
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
          errors={errors}
          setErrors={setErrors}
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