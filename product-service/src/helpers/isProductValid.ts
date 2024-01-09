import { Product } from "../types/types";

export const isProductValid = (productData: Product) => {
    const { description = null, title = null, price = null, count = null } = { ...productData };
    if (
      !description ||
      typeof description !== "string" ||
      !title ||
      typeof title !== "string" ||
      !price ||
      typeof price !== "number" ||
      !count ||
      typeof count !== "number"
    ) {
      return true;
    }
  
    return false;
};