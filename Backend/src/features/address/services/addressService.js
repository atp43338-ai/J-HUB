import Address from "../models/Address.js";


// ==================================================
// ADD ADDRESS
// ==================================================

export const addAddressService = async (
  userId,
  addressData
) => {
  const {
    name,
    phone,
    address,
    city,
    state,
    pincode,
  } = addressData;

  const newAddress = await Address.create({
    user: userId,
    name,
    phone,
    address,
    city,
    state,
    pincode,
  });

  return newAddress;
};


// ==================================================
// GET USER ADDRESSES
// ==================================================

export const getAddressesService = async (userId) => {
  const addresses = await Address.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });

  return addresses;
};


// ==================================================
// UPDATE ADDRESS
// ==================================================

export const updateAddressService = async (
  userId,
  addressId,
  addressData
) => {
  const {
    name,
    phone,
    address,
    city,
    state,
    pincode,
  } = addressData;

  const updatedAddress = await Address.findOneAndUpdate(
    {
      _id: addressId,
      user: userId,
    },
    {
      name,
      phone,
      address,
      city,
      state,
      pincode,
    },
    {
      new: true,
    }
  );

  if (!updatedAddress) {
    throw new Error("Address not found");
  }

  return updatedAddress;
};


// ==================================================
// DELETE ADDRESS
// ==================================================

export const deleteAddressService = async (
  userId,
  addressId
) => {
  const deletedAddress = await Address.findOneAndDelete({
    _id: addressId,
    user: userId,
  });

  if (!deletedAddress) {
    throw new Error("Address not found");
  }

  return deletedAddress;
};


// ==================================================
// GET SINGLE ADDRESS
// ==================================================

export const getSingleAddressService = async (
  userId,
  addressId
) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new Error("Address not found");
  }

  return address;
};