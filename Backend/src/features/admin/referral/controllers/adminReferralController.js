import {
  createReferralOffer,
  getAllReferralOffers,
  getReferralOfferById,
  updateReferralOffer,
  deleteReferralOffer,
  updateReferralOfferStatus,
} from "../services/adminReferralService.js";

// CREATE REFERRAL OFFER
export const createReferralOfferController = async (
  req,
  res
) => {
  try {
    const referralOffer =
      await createReferralOffer(req.body);

    res.status(201).json({
      success: true,
      message: "Referral offer created successfully",
      referralOffer,
    });
  } catch (error) {
    console.error(
      "Create referral offer error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create referral offer",
    });
  }
};

// GET ALL REFERRAL OFFERS
export const getAllReferralOffersController = async (
  req,
  res
) => {
  try {
    const referralOffers =
      await getAllReferralOffers();

    res.status(200).json({
      success: true,
      message:
        "Referral offers fetched successfully",
      referralOffers,
    });
  } catch (error) {
    console.error(
      "Get referral offers error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch referral offers",
    });
  }
};

// GET REFERRAL OFFER BY ID
export const getReferralOfferByIdController =
  async (req, res) => {
    try {
      const referralOffer =
        await getReferralOfferById(
          req.params.id
        );

      res.status(200).json({
        success: true,
        message:
          "Referral offer fetched successfully",
        referralOffer,
      });
    } catch (error) {
      console.error(
        "Get referral offer error:",
        error
      );

      res.status(404).json({
        success: false,
        message:
          error.message ||
          "Referral offer not found",
      });
    }
  };

// UPDATE REFERRAL OFFER
export const updateReferralOfferController =
  async (req, res) => {
    try {
      const referralOffer =
        await updateReferralOffer(
          req.params.id,
          req.body
        );

      res.status(200).json({
        success: true,
        message:
          "Referral offer updated successfully",
        referralOffer,
      });
    } catch (error) {
      console.error(
        "Update referral offer error:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update referral offer",
      });
    }
  };

// DELETE REFERRAL OFFER
export const deleteReferralOfferController =
  async (req, res) => {
    try {
      await deleteReferralOffer(
        req.params.id
      );

      res.status(200).json({
        success: true,
        message:
          "Referral offer deleted successfully",
      });
    } catch (error) {
      console.error(
        "Delete referral offer error:",
        error
      );

      res.status(404).json({
        success: false,
        message:
          error.message ||
          "Referral offer not found",
      });
    }
  };

// UPDATE STATUS
export const updateReferralOfferStatusController =
  async (req, res) => {
    try {
      const { status } = req.body;

      const referralOffer =
        await updateReferralOfferStatus(
          req.params.id,
          status
        );

      res.status(200).json({
        success: true,
        message:
          "Referral offer status updated successfully",
        referralOffer,
      });
    } catch (error) {
      console.error(
        "Update referral offer status error:",
        error
      );

      res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update referral offer status",
      });
    }
  };