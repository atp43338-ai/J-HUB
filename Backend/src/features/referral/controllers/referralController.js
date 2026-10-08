import {
  getReferralDetailsService,
} from "../services/referralService.js";

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