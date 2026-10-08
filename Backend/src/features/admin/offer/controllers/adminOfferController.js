import {
  createOfferService,
  getAllOffersService,
  getOfferByIdService,
  updateOfferService,
  deleteOfferService,
  updateOfferStatusService,
} from "../services/adminOfferService.js";

// CREATE OFFER
export const createOffer = async (req, res) => {
  try {
    const offer = await createOfferService(req.body);

    res.status(201).json({
      message: "Offer created successfully",
      offer,
    });
  } catch (error) {
    console.error("Create offer error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL OFFERS
export const getAllOffers = async (req, res) => {
  try {
    const offers = await getAllOffersService();

    res.status(200).json({
      message: "Offers fetched successfully",
      offers,
    });
  } catch (error) {
    console.error("Get offers error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// GET SINGLE OFFER
export const getOfferById = async (req, res) => {
  try {
    const offer = await getOfferByIdService(req.params.id);

    res.status(200).json({
      message: "Offer fetched successfully",
      offer,
    });
  } catch (error) {
    console.error("Get offer error:", error);

    res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE OFFER
export const updateOffer = async (req, res) => {
  try {
    const offer = await updateOfferService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Offer updated successfully",
      offer,
    });
  } catch (error) {
    console.error("Update offer error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE OFFER
export const deleteOffer = async (req, res) => {
  try {
    await deleteOfferService(req.params.id);

    res.status(200).json({
      message: "Offer deleted successfully",
    });
  } catch (error) {
    console.error("Delete offer error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE OFFER STATUS
export const updateOfferStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const offer = await updateOfferStatusService(
      req.params.id,
      status
    );

    res.status(200).json({
      message: status
        ? "Offer activated successfully"
        : "Offer deactivated successfully",
      offer,
    });
  } catch (error) {
    console.error("Update offer status error:", error);

    res.status(400).json({
      message: error.message,
    });
  }
};