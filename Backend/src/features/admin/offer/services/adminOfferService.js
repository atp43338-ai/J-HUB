import Offer from "../models/Offer.js";

// CREATE OFFER
export const createOfferService = async (offerData) => {
  const {
    name,
    type,
    targetId,
    discount,
    startDate,
    endDate,
    status,
  } = offerData;

  if (!name || !type || !targetId || !discount || !startDate || !endDate) {
    throw new Error("All offer fields are required");
  }

  if (!["Product", "Category"].includes(type)) {
    throw new Error("Invalid offer type");
  }

  const discountValue = Number(discount);

  if (
    !Number.isFinite(discountValue) ||
    discountValue < 1 ||
    discountValue > 100
  ) {
    throw new Error("Discount must be between 1% and 100%");
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid offer dates");
  }

  if (end < start) {
    throw new Error("End date cannot be before start date");
  }

  const existingOffer = await Offer.findOne({
    name: name.trim(),
  });

  if (existingOffer) {
    throw new Error("Offer with this name already exists");
  }

  const offer = await Offer.create({
    name: name.trim(),
    type,
    targetId,
    discount: discountValue,
    startDate: start,
    endDate: end,
    status: status ?? true,
  });

  return offer;
};

// GET ALL OFFERS
export const getAllOffersService = async () => {
  const offers = await Offer.find()
    .sort({ createdAt: -1 });

  return offers;
};

// GET SINGLE OFFER
export const getOfferByIdService = async (offerId) => {
  const offer = await Offer.findById(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  return offer;
};

// UPDATE OFFER
export const updateOfferService = async (offerId, offerData) => {
  const offer = await Offer.findById(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  if (offerData.discount !== undefined) {
    const discount = Number(offerData.discount);

    if (
      !Number.isFinite(discount) ||
      discount < 1 ||
      discount > 100
    ) {
      throw new Error("Discount must be between 1% and 100%");
    }

    offerData.discount = discount;
  }

  if (offerData.startDate || offerData.endDate) {
    const start = new Date(
      offerData.startDate || offer.startDate
    );

    const end = new Date(
      offerData.endDate || offer.endDate
    );

    if (end < start) {
      throw new Error("End date cannot be before start date");
    }
  }

  if (offerData.name) {
    const existingOffer = await Offer.findOne({
      name: offerData.name.trim(),
      _id: { $ne: offerId },
    });

    if (existingOffer) {
      throw new Error("Offer with this name already exists");
    }

    offerData.name = offerData.name.trim();
  }

  Object.assign(offer, offerData);

  await offer.save();

  return offer;
};

// DELETE OFFER
export const deleteOfferService = async (offerId) => {
  const offer = await Offer.findByIdAndDelete(offerId);

  if (!offer) {
    throw new Error("Offer not found");
  }

  return offer;
};

// UPDATE OFFER STATUS
export const updateOfferStatusService = async (
  offerId,
  status
) => {
  if (typeof status !== "boolean") {
    throw new Error("Status must be true or false");
  }

  const offer = await Offer.findByIdAndUpdate(
    offerId,
    { status },
    { new: true, runValidators: true }
  );

  if (!offer) {
    throw new Error("Offer not found");
  }

  return offer;
};