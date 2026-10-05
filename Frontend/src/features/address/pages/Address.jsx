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
        prevAddresses.filter((address) => address._id !== id)
      );
    } catch (error) {
      console.error("Delete address error:", error);
      toast.error(error.message);
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
    
  );
}

export default Address;