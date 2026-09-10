import {
  addAddressService,
  getAddressesService,
  updateAddressService,
  deleteAddressService,
  getSingleAddressService,
} from "../services/addressService.js";


// ==================================================
// ADD ADDRESS
// ==================================================

export const addAddress = async (req, res) => {
  try {
    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const newAddress = await addAddressService(
      req.user.id,
      req.body
    );

    res.status(201).json({
      message: "Address added successfully",
      address: newAddress,
    });

  } catch (error) {
    console.error("Add address error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// GET USER ADDRESSES
// ==================================================

export const getAddresses = async (req, res) => {
  try {
    const addresses = await getAddressesService(
      req.user.id
    );

    res.status(200).json({
      addresses,
    });

  } catch (error) {
    console.error("Get addresses error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// UPDATE ADDRESS
// ==================================================

export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      name,
      phone,
      address,
      city,
      state,
      pincode,
    } = req.body;

    if (
      !name ||
      !phone ||
      !address ||
      !city ||
      !state ||
      !pincode
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
      });
    }

    const updatedAddress = await updateAddressService(
      req.user.id,
      id,
      req.body
    );

    res.status(200).json({
      message: "Address updated successfully",
      address: updatedAddress,
    });

  } catch (error) {
    console.error("Update address error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// DELETE ADDRESS
// ==================================================

export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteAddressService(
      req.user.id,
      id
    );

    res.status(200).json({
      message: "Address deleted successfully",
    });

  } catch (error) {
    console.error("Delete address error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};


// ==================================================
// GET SINGLE ADDRESS
// ==================================================

export const getSingleAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const address = await getSingleAddressService(
      req.user.id,
      id
    );

    res.status(200).json({
      address,
    });

  } catch (error) {
    console.error("Get single address error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};