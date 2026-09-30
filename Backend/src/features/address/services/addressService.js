import Address from "../models/Address.js";

// ==========================================
// ADD ADDRESS
// ==========================================

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
    isDefault,
  } = addressData;

  // Check how many addresses user already has
  const addressCount = await Address.countDocuments({
    user: userId,
  });

  // First address should automatically become default
  const makeDefault =
    addressCount === 0 || Boolean(isDefault);

  // If this address is default,
  // remove default from other addresses
  if (makeDefault) {
    await Address.updateMany(
      { user: userId },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  const newAddress = await Address.create({
    user: userId,
    name,
    phone,
    address,
    city,
    state,
    pincode,
    isDefault: makeDefault,
  });

  return newAddress;
};

// ==========================================
// GET ALL ADDRESSES
// ==========================================

export const getAddressesService = async (
  userId
) => {
  return Address.find({
    user: userId,
  }).sort({
    createdAt: -1,
  });
};

// ==========================================
// GET SINGLE ADDRESS
// ==========================================

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

// ==========================================
// UPDATE ADDRESS
// ==========================================

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
    isDefault,
  } = addressData;

  // Check address belongs to user
  const existingAddress = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!existingAddress) {
    throw new Error("Address not found");
  }

  // If setting this address as default,
  // remove default from other addresses
  if (isDefault) {
    await Address.updateMany(
      {
        user: userId,
        _id: {
          $ne: addressId,
        },
      },
      {
        $set: {
          isDefault: false,
        },
      }
    );
  }

  const updatedAddress =
    await Address.findOneAndUpdate(
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
        isDefault: Boolean(isDefault),
      },
      {
        new: true,
      }
    );

  return updatedAddress;
};

// ==========================================
// DELETE ADDRESS
// ==========================================

export const deleteAddressService = async (
  userId,
  addressId
) => {
  const deletedAddress =
    await Address.findOneAndDelete({
      _id: addressId,
      user: userId,
    });

  if (!deletedAddress) {
    throw new Error("Address not found");
  }

  // If deleted address was default,
  // make another address default
  if (deletedAddress.isDefault) {
    const nextAddress = await Address.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;
      await nextAddress.save();
    }
  }

  return deletedAddress;
};