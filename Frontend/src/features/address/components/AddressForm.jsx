import AddressField from "./AddressField";

function AddressForm({
  name,
  setName,
  phone,
  setPhone,
  address,
  setAddress,
  city,
  setCity,
  state,
  setState,
  pincode,
  setPincode,
  isDefault,
  setIsDefault,
  errors = {},
  setErrors,
  onSubmit,
  onCancel,
  loading,
  isEdit,
}) {
  // Validate a field while the user types
  const validateField = (field, value) => {
    let message = "";

    switch (field) {
      case "name":
        if (value.trim().length < 3) {
          message = "Name must contain at least 3 characters";
        }
        break;

      case "phone":
        if (!/^[6-9]\d{9}$/.test(value.trim())) {
          message = "Enter a valid 10-digit mobile number";
        }
        break;

      case "address":
        if (!value.trim()) {
          message = "Address is required";
        }
        break;

      case "city":
        if (!value.trim()) {
          message = "City is required";
        }
        break;

      case "state":
        if (!value.trim()) {
          message = "State is required";
        }
        break;

      case "pincode":
        if (!/^\d{6}$/.test(value.trim())) {
          message = "Pincode must contain exactly 6 digits";
        }
        break;

      default:
        break;
    }

    if (typeof setErrors === "function") {
      setErrors((previous) => ({
        ...previous,
        [field]: message,
      }));
    }
  };

  // Update field value and its inline error
  const handleChange = (field, value, setter) => {
    setter(value);
    validateField(field, value);
  };

  // Phone: digits only, maximum 10
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      handleChange("phone", value, setPhone);
    }
  };

  // Pincode: digits only, maximum 6
  const handlePincodeChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      handleChange("pincode", value, setPincode);
    }
  };

  // Submit: let AddEditAddress handle validation and saving
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      noValidate
      className="space-y-6"
    >
      {/* Name + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AddressField
            label="Full Name"
            value={name}
            onChange={(e) =>
              handleChange("name", e.target.value, setName)
            }
            placeholder="Enter your name"
          />

          {errors.name && (
            <p className="mt-1 text-sm text-red-600">
              {errors.name}
            </p>
          )}
        </div>

        <div>
          <AddressField
            label="Phone Number"
            value={phone}
            onChange={handlePhoneChange}
            type="tel"
            placeholder="Enter phone number"
          />

          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Address
        </label>

        <textarea
          value={address}
          onChange={(e) =>
            handleChange("address", e.target.value, setAddress)
          }
          placeholder="Enter your full address"
          rows="4"
          aria-invalid={Boolean(errors.address)}
          className={`
            w-full px-4 py-3 rounded-lg
            bg-white text-black text-sm
            outline-none resize-none transition
            focus:ring-2 focus:ring-[#d90416]/10
            ${
              errors.address
                ? "border border-red-500"
                : "border border-gray-200 focus:border-[#d90416]"
            }
          `}
        />

        {errors.address && (
          <p className="mt-1 text-sm text-red-600">
            {errors.address}
          </p>
        )}
      </div>

      {/* City + State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <AddressField
            label="City"
            value={city}
            onChange={(e) =>
              handleChange("city", e.target.value, setCity)
            }
            placeholder="Enter city"
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-600">
              {errors.city}
            </p>
          )}
        </div>

        <div>
          <AddressField
            label="State"
            value={state}
            onChange={(e) =>
              handleChange("state", e.target.value, setState)
            }
            placeholder="Enter state"
          />

          {errors.state && (
            <p className="mt-1 text-sm text-red-600">
              {errors.state}
            </p>
          )}
        </div>
      </div>

      {/* Pincode */}
      <div className="md:w-1/2">
        <AddressField
          label="Pincode"
          value={pincode}
          onChange={handlePincodeChange}
          placeholder="Enter pincode"
        />

        {errors.pincode && (
          <p className="mt-1 text-sm text-red-600">
            {errors.pincode}
          </p>
        )}
      </div>

      {/* Default Address */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isDefault}
          onChange={(e) =>
            setIsDefault(e.target.checked)
          }
          className="w-4 h-4 accent-[#d90416]"
        />

        <span className="text-sm text-gray-700">
          Set as default address
        </span>
      </label>

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4">
        {/* Cancel */}
        <button
          type="button"
          onClick={onCancel}
          className="
            flex-1
            h-[48px]
            rounded-lg
            border
            border-gray-200
            text-gray-700
            text-sm
            font-semibold
            hover:border-gray-400
            hover:bg-gray-50
            transition
          "
        >
          Cancel
        </button>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            flex-1
            h-[48px]
            rounded-lg
            bg-[#d90416]
            hover:bg-[#b90312]
            disabled:opacity-50
            disabled:cursor-not-allowed
            text-white
            text-sm
            font-semibold
            transition
          "
        >
          {loading
            ? "Saving..."
            : isEdit
              ? "Update Address"
              : "Add Address"}
        </button>
      </div>
    </form>
  );
}

export default AddressForm;