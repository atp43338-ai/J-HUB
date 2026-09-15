import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
} from "../services/productService.js";

export const createProduct = async (req, res) => {
  try {
    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

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
    const products = await getProductsService();

    res.status(200).json({
      products,
    });
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
    const product = await updateProductService(
      req.params.id,
      req.body
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