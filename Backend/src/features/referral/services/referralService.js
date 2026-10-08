import User from "../../auth/models/User.js";
import Wallet from "../../wallet/models/Wallet.js";
import { addMoneyToWallet } from "../../wallet/services/walletService.js";


// GET REFERRAL DETAILS

export const getReferralDetailsService = async (userId) => {
  const user = await User.findById(userId).select(
    "name referralCode referredBy referralRewardClaimed"
  );

  if (!user) {
    throw new Error("User not found");
  }

  const referralLink =
    `http://localhost:5173/register?ref=${user.referralCode}`;

  // CHECK USER WALLET FOR REFERRAL REWARD

  const wallet = await Wallet.findOne({
    user: userId,
  });

  const referralRewardClaimed =
    wallet?.transactions?.some(
      (transaction) =>
        transaction.type === "credit" &&
        transaction.reason === "Referral reward"
    ) || false;

  return {
    referralCode: user.referralCode,
    referralLink,
    referredBy: user.referredBy,
    referralRewardClaimed,
  };
};


// APPLY REFERRAL REWARD

export const applyReferralRewardService = async (
  userId,
  order
) => {

  // FIND REFERRED USER

  const user = await User.findById(userId);

  if (!user) {
    throw new Error("User not found");
  }


  // CHECK IF USER WAS REFERRED

  if (!user.referredBy) {
    return null;
  }


  // PREVENT DUPLICATE REWARD

  if (user.referralRewardClaimed) {
    return null;
  }


  // REFERRAL REWARD

  const reward = 100;


  // SAFETY CHECK

  if (!reward || reward <= 0) {
    return null;
  }


  // ADD REWARD TO REFERRER WALLET

  await addMoneyToWallet(
    user.referredBy,
    reward,
    "Referral reward",
    order._id
  );


  // MARK REWARD AS CLAIMED

  user.referralRewardClaimed = true;

  await user.save();


  return {
    reward,
    referrerId: user.referredBy,
  };
};