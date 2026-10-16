import ReferralOffer from "../models/ReferralOffer.js";

// CREATE REFERRAL OFFER
export const createReferralOffer = async (referralData) => {
  const {
    name,
    rewardType,
    rewardValue,
    rewardAmount,
    rewardPercentage,
    minimumPurchase,
    minPurchase,
    startDate,
    endDate,
    status,
  } = referralData;

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (typeof endDate === "string" && !endDate.includes("T")) {
    end.setHours(23, 59, 59, 999);
  }

  if (end < start) {
    throw new Error("End date cannot be before start date");
  }

  const normalizedRewardType =
    rewardType === "percentage" ? "percentage" : "flat";

  const val = Number(
    rewardValue !== undefined && rewardValue !== ""
      ? rewardValue
      : normalizedRewardType === "percentage"
      ? rewardPercentage
      : rewardAmount || 0
  );

  if (normalizedRewardType === "percentage" && val > 100) {
    throw new Error("Percentage reward cannot be greater than 100");
  }

  const minAmt = Number(
    minPurchase !== undefined && minPurchase !== ""
      ? minPurchase
      : minimumPurchase || 0
  );

  let normalizedStatus = "Active";
  if (status === false || status === "Inactive" || status === "inactive") {
    normalizedStatus = "Inactive";
  }

  const referralOffer = await ReferralOffer.create({
    name: name ? name.trim() : "Special Referral Offer",
    rewardType: normalizedRewardType,
    rewardValue: val,
    rewardAmount: normalizedRewardType === "flat" ? val : 0,
    rewardPercentage: normalizedRewardType === "percentage" ? val : 0,
    minimumPurchase: minAmt,
    minPurchase: minAmt,
    startDate: start,
    endDate: end,
    status: normalizedStatus,
  });

  return referralOffer;
};

// GET ALL REFERRAL OFFERS
export const getAllReferralOffers = async () => {
  return await ReferralOffer.find().sort({ createdAt: -1 });
};

// GET REFERRAL OFFER BY ID
export const getReferralOfferById = async (id) => {
  const referralOffer = await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  return referralOffer;
};

// UPDATE REFERRAL OFFER
export const updateReferralOffer = async (id, referralData) => {
  const referralOffer = await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  const {
    name,
    rewardType,
    rewardValue,
    rewardAmount,
    rewardPercentage,
    minimumPurchase,
    minPurchase,
    startDate,
    endDate,
    status,
  } = referralData;

  const newStartDate = startDate ? new Date(startDate) : referralOffer.startDate;
  let newEndDate = endDate ? new Date(endDate) : referralOffer.endDate;
  if (endDate && typeof endDate === "string" && !endDate.includes("T")) {
    newEndDate = new Date(endDate);
    newEndDate.setHours(23, 59, 59, 999);
  }

  if (new Date(newEndDate) < new Date(newStartDate)) {
    throw new Error("End date cannot be before start date");
  }

  const currentRewardType =
    referralOffer.rewardType === "percentage" ? "percentage" : "flat";
  const newRewardType = rewardType
    ? rewardType === "percentage"
      ? "percentage"
      : "flat"
    : currentRewardType;

  const currentVal =
    referralOffer.rewardValue ||
    (referralOffer.rewardType === "percentage"
      ? referralOffer.rewardPercentage
      : referralOffer.rewardAmount) ||
    0;

  const newVal = Number(
    rewardValue !== undefined && rewardValue !== ""
      ? rewardValue
      : (newRewardType === "percentage" ? rewardPercentage : rewardAmount) ??
          currentVal
  );

  if (newRewardType === "percentage" && newVal > 100) {
    throw new Error("Percentage reward cannot be greater than 100");
  }

  const minAmt = Number(
    minPurchase !== undefined && minPurchase !== ""
      ? minPurchase
      : minimumPurchase !== undefined && minimumPurchase !== ""
      ? minimumPurchase
      : referralOffer.minPurchase ?? referralOffer.minimumPurchase ?? 0
  );

  if (name !== undefined) referralOffer.name = name.trim();
  referralOffer.rewardType = newRewardType;
  referralOffer.rewardValue = newVal;
  referralOffer.rewardAmount = newRewardType === "flat" ? newVal : 0;
  referralOffer.rewardPercentage = newRewardType === "percentage" ? newVal : 0;
  referralOffer.minimumPurchase = minAmt;
  referralOffer.minPurchase = minAmt;
  referralOffer.startDate = newStartDate;
  referralOffer.endDate = newEndDate;

  if (status !== undefined) {
    referralOffer.status =
      status === false || status === "Inactive" || status === "inactive"
        ? "Inactive"
        : "Active";
  }

  await referralOffer.save();
  return referralOffer;
};

// DELETE REFERRAL OFFER
export const deleteReferralOffer = async (id) => {
  const referralOffer = await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  await ReferralOffer.findByIdAndDelete(id);

  return referralOffer;
};

// UPDATE STATUS
export const updateReferralOfferStatus = async (id, status) => {
  const referralOffer = await ReferralOffer.findById(id);

  if (!referralOffer) {
    throw new Error("Referral offer not found");
  }

  let nextStatus = "Active";
  if (typeof status === "string") {
    nextStatus = status === "Active" ? "Active" : "Inactive";
  } else if (typeof status === "boolean") {
    nextStatus = status ? "Active" : "Inactive";
  } else {
    const isCurrentlyActive =
      referralOffer.status === "Active" ||
      referralOffer.status === true ||
      referralOffer.status === "active";
    nextStatus = isCurrentlyActive ? "Inactive" : "Active";
  }

  referralOffer.status = nextStatus;
  await referralOffer.save();

  return referralOffer;
};