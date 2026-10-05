import Collection from "../models/Collection.js";

// Create Collection
export const createCollectionService = async (collectionData) => {
  const collection = await Collection.create(collectionData);

  return collection;
};

// Get Collections
export const getCollectionsService = async () => {
  const collections = await Collection.find({
    isListed: true,
  }).sort({ createdAt: -1 });

  return collections;
};

// Get Collection By ID
export const getCollectionByIdService = async (collectionId) => {
  const collection = await Collection.findById(collectionId);

  if (!collection) {
    throw new Error("Collection not found");
  }

  return collection;
};

// Update Collection
export const updateCollectionService = async (
  collectionId,
  collectionData
) => {
  const collection = await Collection.findByIdAndUpdate(
    collectionId,
    collectionData,
    { new: true }
  );

  if (!collection) {
    throw new Error("Collection not found");
  }

  return collection;
};

// Delete Collection
export const deleteCollectionService = async (collectionId) => {
  const collection = await Collection.findByIdAndUpdate(
    collectionId,
    { isListed: false },
    { new: true }
  );

  if (!collection) {
    throw new Error("Collection not found");
  }

  return collection;
};