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
  onSubmit,
  onCancel,
  loading,
  isEdit,
}) {
  // Phone validation
  const handlePhoneChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,10}$/.test(value)) {
      setPhone(value);
    }
  };

  // Pincode validation
  const handlePincodeChange = (e) => {
    const value = e.target.value;

    if (/^\d{0,6}$/.test(value)) {
      setPincode(value);
    }
  };

  // Submit validation
  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!/^[6-9]\d{9}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number");
      return;
    }

    if (!/^\d{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit pincode");
      return;
    }

    onSubmit(e);
  };

  return (
    <form
      onSubmit={handleFormSubmit}
      className="space-y-6"
    >

      {/* Name + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <AddressField
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
        />

        <AddressField
          label="Phone Number"
          value={phone}
          onChange={handlePhoneChange}
          type="tel"
          placeholder="Enter phone number"
        />

      </div>

      {/* Address */}
      <div>
        <label className="block mb-2 text-sm font-semibold text-gray-700">
          Address
        </label>

        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your full address"
          rows="4"
          className="
            w-full
            px-4
            py-3
            rounded-lg
            border
            border-gray-200
            bg-white
            text-black
            text-sm
            outline-none
            resize-none
            transition
            focus:border-[#d90416]
            focus:ring-2
            focus:ring-[#d90416]/10
          "
        />
      </div>

      {/* City + State */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <AddressField
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Enter city"
        />

        <AddressField
          label="State"
          value={state}
          onChange={(e) => setState(e.target.value)}
          placeholder="Enter state"
        />

      </div>

      {/* Pincode */}
      <div className="md:w-1/2">

        <AddressField
          label="Pincode"
          value={pincode}
          onChange={handlePincodeChange}
          placeholder="Enter pincode"
        />

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