import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import { getAddresses, deleteAddress } from "../services/addressService";

import ProfileLayout from "../../profile/components/ProfileLayout";
import ProfileHeader from "../../profile/components/ProfileHeader";

import AddressCard from "../components/AddressCard";
import AddressEmptyState from "../components/AddressEmptyState";

function Address() {
  const [addresses, setAddresses] = useState([]);

  const navigate = useNavigate();

  // DELETE MODAL STATE
  const [deleteId, setDeleteId] = useState(null);

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
    setDeleteId(id);
  };

  // CONFIRM DELETE
  const confirmDelete = async () => {
    if (!deleteId) {
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      await deleteAddress(token, deleteId);

      toast.success("Address deleted successfully");

      setAddresses((prevAddresses) =>
        prevAddresses.filter(
          (address) => address._id !== deleteId
        )
      );

      setDeleteId(null);
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(error.message);
      setDeleteId(null);
    }
  };

  // EDIT ADDRESS
  const handleEdit = (id) => {
    navigate(`/address/edit/${id}`);
  };

  // ADD ADDRESS
  const handleAdd = () => {
    navigate("/address/add");
  };

  return (
    <>
      {/* DELETE CONFIRMATION MODAL */}
      {deleteId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm bg-white rounded-xl shadow-2xl p-6 text-center">

            {/* Warning Icon */}
            <div className="mx-auto w-14 h-14 rounded-full bg-red-100 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center text-xl font-bold">
                ×
              </div>
            </div>

            {/* Title */}
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Delete Address
            </h3>

            {/* Message */}
            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this address?
            </p>

            {/* Buttons */}
            <div className="flex gap-3 mt-6">

              {/* Cancel */}
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="
                  flex-1
                  h-10
                  rounded-lg
                  border
                  border-gray-200
                  text-gray-700
                  text-sm
                  font-semibold
                  hover:bg-gray-50
                  transition
                "
              >
                Cancel
              </button>

              {/* Delete */}
              <button
                type="button"
                onClick={confirmDelete}
                className="
                  flex-1
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
                Delete
              </button>

            </div>

          </div>
        </div>
      )}

      <ProfileLayout
        title="My"
        highlight="Address"
        description="Manage your delivery addresses"
      >
        <div className="flex items-start justify-between gap-5">
          <ProfileHeader
            title="Delivery"
            highlight="Addresses"
            description="Manage your saved delivery addresses"
          />

          <button
            type="button"
            onClick={handleAdd}
            className="
              h-[46px]
              px-6
              rounded-lg
              bg-[#d90416]
              hover:bg-[#b90312]
              text-white
              text-sm
              font-semibold
              transition
              flex-shrink-0
            "
          >
            + Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <AddressEmptyState onAdd={handleAdd} />
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </ProfileLayout>
    </>
  );
}

export default Address;