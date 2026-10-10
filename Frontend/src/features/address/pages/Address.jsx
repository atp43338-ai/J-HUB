import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

import {
  getAddresses,
  deleteAddress,
} from "../services/addressService";

import ProfileLayout from "../../profile/components/ProfileLayout";
import ProfileHeader from "../../profile/components/ProfileHeader";

import AddressCard from "../components/AddressCard";
import AddressEmptyState from "../components/AddressEmptyState";

function Address() {
  const [addresses, setAddresses] = useState([]);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();

  // Fetch addresses
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
        setAddresses(data.addresses || []);
      } catch (error) {
        console.error("Get addresses error:", error);
        toast.error(error.message || "Failed to fetch addresses");
      }
    };

    fetchAddresses();
  }, [navigate]);

  // Open delete confirmation
  const handleDelete = (id) => {
    setDeleteId(id);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteId || deleting) return;

    try {
      setDeleting(true);

      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");
        navigate("/login");
        return;
      }

      await deleteAddress(token, deleteId);

      toast.success("Address deleted successfully");

      setAddresses((previous) =>
        previous.filter((item) => item._id !== deleteId)
      );

      setDeleteId(null);
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(error.message || "Failed to delete address");
    } finally {
      setDeleting(false);
    }
  };

  // Edit address
  const handleEdit = (id) => {
    navigate(`/address/edit/${id}`);
  };

  // Add address
  const handleAdd = () => {
    navigate("/address/add");
  };

  return (
    <>
      {/* Delete confirmation modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-2xl">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-xl font-bold text-white">
                ×
              </div>
            </div>

            <h3 className="mt-4 text-lg font-semibold text-gray-900">
              Delete Address
            </h3>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this address?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteId(null)}
                className="
                  flex-1 h-10 rounded-lg border border-gray-200
                  text-gray-700 text-sm font-semibold
                  hover:bg-gray-50 transition
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={deleting}
                onClick={confirmDelete}
                className="
                  flex-1 h-10 rounded-lg bg-[#d90416]
                  hover:bg-[#b90312] text-white
                  text-sm font-semibold transition
                  disabled:opacity-50
                "
              >
                {deleting ? "Deleting..." : "Delete"}
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
              h-[46px] px-6 rounded-lg
              bg-[#d90416] hover:bg-[#b90312]
              text-white text-sm font-semibold
              transition flex-shrink-0
            "
          >
            + Add Address
          </button>
        </div>

        {addresses.length === 0 ? (
          <AddressEmptyState onAdd={handleAdd} />
        ) : (
          <div className="grid grid-cols-1 gap-5">
            {addresses.map((item) => (
              <AddressCard
                key={item._id}
                address={item}
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