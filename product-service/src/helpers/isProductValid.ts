import { Product } from "../types/types";

export const isProductValid = (productData: Product) => {
    const { description = null, title = null, price = null, count = null } = { ...productData };
    if (
      !description ||
      !title ||
      !price ||
      !count 
    ) {
      return false;
    }
  
    return true;
};