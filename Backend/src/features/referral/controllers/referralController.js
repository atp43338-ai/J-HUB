import {
  getReferralDetailsService,
  getActiveReferralOfferService,
} from "../services/referralService.js";

export const getActiveReferralOffer = async (req, res) => {
  try {
    const activeOffer = await getActiveReferralOfferService();

    return res.status(200).json({
      success: true,
      activeOffer: activeOffer || null,
    });
  } catch (error) {
    console.error("Get active referral offer error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch active referral offer",
      activeOffer: null,
    });
  }
};

export const getReferralDetails = async (req, res) => {
  try {
    const referralDetails =
      await getReferralDetailsService(req.user.id);

    res.status(200).json({
      success: true,
      message: "Referral details fetched successfully",
      referral: referralDetails,
    });
  } catch (error) {
    console.error("Get referral details error:", error);

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};