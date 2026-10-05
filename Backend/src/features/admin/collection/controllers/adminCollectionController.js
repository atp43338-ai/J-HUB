import {
  createCollectionService,
  getCollectionsService,
  getCollectionByIdService,
  updateCollectionService,
  deleteCollectionService,
} from "../services/adminCollectionService.js";

// Add Collection
export const createCollection = async (req, res) => {
  try {
    const collection = await createCollectionService(req.body);

    res.status(201).json({
      message: "Collection created successfully",
      collection,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Collections
export const getCollections = async (req, res) => {
  try {
    const collections = await getCollectionsService();

    res.status(200).json({
      collections,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Get Collection By ID
export const getCollectionById = async (req, res) => {
  try {
    const collection = await getCollectionByIdService(req.params.id);

    res.status(200).json({
      collection,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Edit Collection
export const updateCollection = async (req, res) => {
  try {
    const collection = await updateCollectionService(
      req.params.id,
      req.body
    );

    res.status(200).json({
      message: "Collection updated successfully",
      collection,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// Delete Collection
export const deleteCollection = async (req, res) => {
  try {
    const collection = await deleteCollectionService(req.params.id);

    res.status(200).json({
      message: "Collection deleted successfully",
      collection,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};