import ReferralOffer from "../models/ReferralOffer.js";

// CREATE REFERRAL OFFER
export const createReferralOffer = async (referralData) => {
  const {
    name,
    rewardType,
    rewardValue,
    minimumPurchase,
    startDate,
    endDate,
    status,
  } = referralData;

  if (new Date(endDate) < new Date(startDate)) {
    throw new Error("End date cannot be before start date");
  }

  if (
    rewardType === "percentage" &&
    Number(rewardValue) > 100
  ) {
    throw new Error(
      "Percentage reward cannot be greater than 100"
    );
  }

  const referralOffer = await ReferralOffer.create({
    name,
    rewardType,
    rewardValue: Number(rewardValue),
    minimumPurchase: Number(minimumPurchase || 0),
    startDate,
    endDate,
    status:
      status !== undefined ? status : true,
  });

  return referralOffer;
};

// GET ALL REFERRAL OFFERS
export const getAllReferralOffers = async () => {
  return await ReferralOffer.find()
    .sort({ createdAt: -1 });
};

// GET REFERRAL OFFER BY ID
export const getReferralOfferById = async (id) => {
  const referralOffer =
    await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  return referralOffer;
};

// UPDATE REFERRAL OFFER
export const updateReferralOffer = async (
  id,
  referralData
) => {
  const referralOffer =
    await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  const {
    name,
    rewardType,
    rewardValue,
    minimumPurchase,
    startDate,
    endDate,
    status,
  } = referralData;

  const newStartDate =
    startDate || referralOffer.startDate;

  const newEndDate =
    endDate || referralOffer.endDate;

  if (
    new Date(newEndDate) <
    new Date(newStartDate)
  ) {
    throw new Error(
      "End date cannot be before start date"
    );
  }

  const newRewardType =
    rewardType || referralOffer.rewardType;

  const newRewardValue =
    rewardValue !== undefined
      ? Number(rewardValue)
      : referralOffer.rewardValue;

  if (
    newRewardType === "percentage" &&
    newRewardValue > 100
  ) {
    throw new Error(
      "Percentage reward cannot be greater than 100"
    );
  }

  if (name !== undefined) {
    referralOffer.name = name;
  }

  if (rewardType !== undefined) {
    referralOffer.rewardType = rewardType;
  }

  if (rewardValue !== undefined) {
    referralOffer.rewardValue =
      Number(rewardValue);
  }

  if (minimumPurchase !== undefined) {
    referralOffer.minimumPurchase =
      Number(minimumPurchase);
  }

  if (startDate !== undefined) {
    referralOffer.startDate = startDate;
  }

  if (endDate !== undefined) {
    referralOffer.endDate = endDate;
  }

  if (status !== undefined) {
    referralOffer.status = status;
  }

  await referralOffer.save();

  return referralOffer;
};

// DELETE REFERRAL OFFER
export const deleteReferralOffer = async (id) => {
  const referralOffer =
    await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  await ReferralOffer.findByIdAndDelete(id);

  return referralOffer;
};

// UPDATE STATUS
export const updateReferralOfferStatus = async (
  id,
  status
) => {
  const referralOffer =
    await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  referralOffer.status = status;

  await referralOffer.save();

  return referralOffer;
};