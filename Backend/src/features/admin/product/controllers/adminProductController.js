import {
  createProductService,
  getProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  addVariantService,
  getVariantsService,
  updateVariantService,
  deleteVariantService,
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



export const addVariant = async (req, res) => {
  try {
    const productId = req.params.id;

    const { size, stock } = req.body;

    const product = await addVariantService(productId, {
      size,
      stock,
    });

    res.status(201).json({
      message: "Variant added successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



export const getVariants = async (req, res) => {
  try {
    const productId = req.params.id;

    const variants = await getVariantsService(productId);

    res.status(200).json({
      variants,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};



export const updateVariant = async (req, res) => {
  try {
    const productId = req.params.id;
    const variantId = req.params.variantId;

    const { size, stock } = req.body;

    const product = await updateVariantService(
      productId,
      variantId,
      {
        size,
        stock,
      }
    );

    res.status(200).json({
      message: "Variant updated successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


export const deleteVariant = async (req, res) => {
  try {
    const productId = req.params.id;
    const variantId = req.params.variantId;

    const product = await deleteVariantService(
      productId,
      variantId
    );

    res.status(200).json({
      message: "Variant deleted successfully",
      product,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



export const updateProductStock = async (req, res) => {
  try {
    const { productId } = req.params;
    const { size, stock } = req.body;

    if (!size || stock === undefined) {
      return res.status(400).json({
        message: "Size and stock are required",
      });
    }

    if (stock < 0) {
      return res.status(400).json({
        message: "Stock cannot be negative",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    const variant = product.variants.find(
      (item) => item.size === size
    );

    if (!variant) {
      return res.status(404).json({
        message: "Variant not found",
      });
    }

    variant.stock = stock;

    await product.save();

    res.status(200).json({
      message: "Stock updated successfully",
      product,
    });
  } catch (error) {
    console.error("Update stock error:", error);

    res.status(500).json({
      message: "Failed to update stock",
    });
  }
};