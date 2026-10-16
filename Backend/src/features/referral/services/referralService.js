import crypto from "crypto";
import User from "../../auth/models/User.js";
import Wallet from "../../wallet/models/Wallet.js";
import { addMoneyToWallet } from "../../wallet/services/walletService.js";


// GET ACTIVE REFERRAL OFFER (Fixed instant referral program)
export const getActiveReferralOfferService = async () => {
  return null;
};


// GET REFERRAL DETAILS

export const getReferralDetailsService = async (userId) => {
  const user = await User.findById(userId).select(
    "name referralCode referredBy referralRewardClaimed isReferralRewardClaimed"
  );

  if (!user) {
    throw new Error("User not found");
  }

  // Ensure user has a referralCode
  if (!user.referralCode) {
    let newReferralCode;
    do {
      newReferralCode = crypto.randomBytes(4).toString("hex").toUpperCase();
    } while (await User.findOne({ referralCode: newReferralCode }));
    user.referralCode = newReferralCode;
    await user.save();
  }

  const clientOrigin = process.env.CLIENT_URL || "http://localhost:5173";
  const referralLink = `${clientOrigin}/register?ref=${user.referralCode}`;

  // CHECK USER WALLET FOR REFERRAL REWARD
  const wallet = await Wallet.findOne({
    $or: [{ user: userId }, { userId: userId }],
  });

  const referralRewardClaimed =
    user.referralRewardClaimed ||
    user.isReferralRewardClaimed ||
    wallet?.transactions?.some(
      (transaction) =>
        (transaction.type === "credit" || transaction.type === "Credit") &&
        (transaction.reason === "Referral reward" ||
          transaction.reason === "Referral signup welcome bonus" ||
          String(transaction.description || "").startsWith("Referral reward"))
    ) || false;

  return {
    referralCode: user.referralCode,
    referralLink,
    referredBy: user.referredBy,
    referralRewardClaimed,
  };
};


// APPLY REFERRAL REWARD (Order completion fallback if not claimed upon signup)
export const applyReferralRewardService = async (
  userId,
  order
) => {
  // FIND REFERRED USER
  const user = await User.findById(userId);

  if (!user) {
    return null;
  }

  // CHECK IF USER WAS REFERRED
  if (!user.referredBy) {
    return null;
  }

  // PREVENT DUPLICATE REWARD (Already rewarded at signup)
  if (user.referralRewardClaimed || user.isReferralRewardClaimed) {
    return null;
  }

  const reward = 99;
  const orderIdentifier = order?.orderId || order?._id || "First Order";
  const description = `Referral reward for order #${orderIdentifier}`;

  // ADD REWARD TO REFERRER WALLET
  await addMoneyToWallet(
    user.referredBy,
    reward,
    description,
    order?._id || null,
    null,
    description
  );

  // MARK REWARD AS CLAIMED
  user.referralRewardClaimed = true;
  user.isReferralRewardClaimed = true;

  await user.save();

  return {
    reward,
    referrerId: user.referredBy,
    campaignName: "Instant Referral",
  };
};