/**
 * Utility to calculate and normalize product pricing, MRP, and discount offer percentage.
 *
 * Supports:
 * - Direct offer pricing from backend (product.offerPrice, product.offerDiscount)
 * - Explicit MRP/originalPrice (product.originalPrice, product.mrp)
 * - Calculated discount on price (product.discount)
 * - Fallbacks where only originalPrice and discount are present
 */
export const getProductPricing = (product) => {
  if (!product) {
    return {
      sellingPrice: 0,
      originalPrice: null,
      discount: 0,
      hasDiscount: false,
    };
  }

  // 1. Backend offer applied (product.offerPrice & product.offerDiscount)
  if (
    Number(product.offerDiscount) > 0 &&
    product.offerPrice !== undefined &&
    product.offerPrice !== null &&
    Number(product.offerPrice) < Number(product.price)
  ) {
    return {
      sellingPrice: Math.round(Number(product.offerPrice)),
      originalPrice: Math.round(Number(product.price)),
      discount: Math.round(Number(product.offerDiscount)),
      hasDiscount: true,
    };
  }

  // 2. Explicit originalPrice or mrp > price
  const rawOriginal = Number(product.originalPrice || product.mrp || 0);
  const rawPrice = Number(product.price || 0);

  if (rawOriginal > rawPrice && rawPrice > 0) {
    const computedDiscount =
      product.discount && Number(product.discount) > 0
        ? Math.round(Number(product.discount))
        : Math.round(((rawOriginal - rawPrice) / rawOriginal) * 100);

    return {
      sellingPrice: Math.round(rawPrice),
      originalPrice: Math.round(rawOriginal),
      discount: computedDiscount,
      hasDiscount: computedDiscount > 0,
    };
  }

  // 3. Fallback: If product only has originalPrice and discount, compute selling price
  if (rawOriginal > 0 && Number(product.discount) > 0) {
    const discount = Math.round(Number(product.discount));
    const calculatedSelling = Math.round(
      rawOriginal - (rawOriginal * discount) / 100
    );

    return {
      sellingPrice: calculatedSelling,
      originalPrice: Math.round(rawOriginal),
      discount,
      hasDiscount: discount > 0 && calculatedSelling < rawOriginal,
    };
  }

  // 4. Fallback: If product has price and discount > 0 (price was MRP or discount applies)
  if (rawPrice > 0 && Number(product.discount) > 0) {
    const discount = Math.round(Number(product.discount));
    const calculatedSelling = Math.round(
      rawPrice - (rawPrice * discount) / 100
    );

    if (calculatedSelling < rawPrice) {
      return {
        sellingPrice: calculatedSelling,
        originalPrice: Math.round(rawPrice),
        discount,
        hasDiscount: true,
      };
    }
  }

  // Standard product with no discount
  return {
    sellingPrice: Math.round(rawPrice),
    originalPrice: null,
    discount: 0,
    hasDiscount: false,
  };
};
