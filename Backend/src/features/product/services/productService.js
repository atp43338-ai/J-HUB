import Product from "../models/Product.js";
import Offer from "../../admin/offer/models/Offer.js";


const applyProductOffers = async (products) => {
  const productIds = products.map(
    (product) => product._id
  );

  const categories = products.map(
    (product) => product.category
  );

  const now = new Date();



const offers = await Offer.find({
  status: true,
  startDate: { $lte: now },
  endDate: { $gte: now },
  $or: [
    {
      type: "Product",
      $expr: {
        $in: [
          { $toString: "$targetId" },
          productIds.map((id) => id.toString()),
        ],
      },
    },
    {
      type: "Category",
      targetId: { $in: categories },
    },
  ],
});



  return products.map((product) => {
    const productData = product.toObject();

    const applicableOffers = offers.filter(
      (offer) => {
        // Product offer
        if (offer.type === "Product") {
          return (
            offer.targetId.toString() ===
            product._id.toString()
          );
        }

        // Category offer
        if (offer.type === "Category") {
          return (
            offer.targetId === product.category
          );
        }

        return false;
      }
    );

    if (applicableOffers.length === 0) {
      return {
        ...productData,
        offerDiscount: 0,
        offerPrice: product.price,
        offerId: null,
        offerName: null,
        offerType: null,
      };
    }

    // Find highest discount
    const highestOffer =
      applicableOffers.reduce(
        (highest, current) =>
          current.discount > highest.discount
            ? current
            : highest
      );

    const discountAmount =
      (product.price *
        highestOffer.discount) /
      100;

    const offerPrice =
      product.price - discountAmount;

    return {
      ...productData,
      offerDiscount: highestOffer.discount,
      offerPrice: Math.round(offerPrice),
      offerId: highestOffer._id,
      offerName: highestOffer.name,
      offerType: highestOffer.type,
    };
  });
};





export const createProductService = async (productData) => {
  const product = await Product.create(productData);
  return product;
};


//get all product form ui
export const getProductsService = async (
  page = 1,
  limit = 6,
  search = "",
  sort = "",
  category = "",
  minPrice = "",
  maxPrice = "",
  brand = "",
  collection = ""
) => {


  // const result = await Product.find({
  //   price: { $gt: 2500 },
  // });
  // console.log(result);



  const skip = (page - 1) * limit;


  const query = {
    isListed: true,
    isBlocked: false,
  };

  if (search) {
    query.name = {
      $regex: search,
      $options: "i",
    };
  }

  if (category) {
    query.category = category;
  }

  if (brand) {
    query.brand = brand;
  }

  if (collection) {
    query.collection = collection;
  }

  if (minPrice || maxPrice) {
    query.price = {};

    if (minPrice) {
      query.price.$gte = Number(minPrice);
    }

    if (maxPrice) {
      query.price.$lte = Number(maxPrice);
    }
  }

  let sortOption = { createdAt: -1 };

  if (sort === "priceLow") {
    sortOption = { price: 1 };
  }

  if (sort === "priceHigh") {
    sortOption = { price: -1 };
  }

  if (sort === "nameAZ") {
    sortOption = { name: 1 };
  }

  if (sort === "nameZA") {
    sortOption = { name: -1 };
  }


  const products = await Product.find(query)
    .sort(sortOption)
    .skip(skip)
    .limit(limit);

  const productsWithOffers = await applyProductOffers(products);

  const totalProducts = await Product.countDocuments(query);

  const totalPages = Math.ceil(totalProducts / limit);


  return {
    products: productsWithOffers,
    currentPage: page,
    totalPages,
    totalProducts,
  };
};




export const getProductByIdService = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const productsWithOffers = await applyProductOffers([product]);

  return productsWithOffers[0];
};




export const updateProductService = async (productId, productData) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    productData,
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  return product;
};




export const deleteProductService = async (productId) => {
  const product = await Product.findByIdAndUpdate(
    productId,
    { isListed: false },
    { new: true }
  );

  if (!product) {
    throw new Error("Product not found");
  }

  // const result = await Product.find({
  //   is
  // })

  return product;
};




export const getRelatedProductsService = async (productId) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const relatedProducts = await Product.find({
    _id: { $ne: productId },
    category: product.category,
    isListed: true,
    isBlocked: false,
  })
    .sort({ createdAt: -1 })
    .limit(4);

  return relatedProducts;
};