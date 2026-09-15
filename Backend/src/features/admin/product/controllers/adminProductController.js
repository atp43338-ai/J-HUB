import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/adminProductService.js";

export const createProduct = async (req, res) => {
  try {
    const imagePaths = req.files.map(
      (file) => `/uploads/${file.filename}`
    );

    const productData = {
      ...req.body,
      images: imagePaths,
    };

    const product = await createProductService(productData);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};


export const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 5;

    const data = await getProductsService(page, limit);

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.id);

    res.status(200).json({
      product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const productData = {
      ...req.body,
    };

    if (req.files && req.files.length > 0) {
      const imagePaths = req.files.map(
        (file) => `/uploads/${file.filename}`
      );

      productData.images = imagePaths;
    }

    const product = await updateProductService(
      req.params.id,
      productData
    );

    res.status(200).json({
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};


export const deleteProduct = async (req, res) => {
  try {
    const product = await deleteProductService(req.params.id);

    res.status(200).json({
      message: "Product deleted successfully",
      product,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};