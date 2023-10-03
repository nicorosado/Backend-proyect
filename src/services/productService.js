import { productDAO } from '../DAO/productDAO.js';
import EErros from "../errors/enums.js";
import CustomError from "../errors/customError.js";

export class ProductService {

  async getProducts(limit) {
    try {
      const products = await productDAO.getProducts(limit);
      return products;
    } catch (err) {
      throw (`Error getting products`);
    }
  };
  async getProductsByOwner(owner) {
    try {
      const products = await productDAO.getProducts();
      const filteredProducts = products.filter(product => product.owner === owner)
      return filteredProducts;
    } catch (err) {
      throw (`Error getting products`);
    }
  };

  async getProductsPaginate(limit, page, filter, sort, attName) {
    try {
      const filterQuery = filter ? { [attName || "category"]: filter } : {};
      const limitValue = limit || 10;
      const pageValue = page || 1;
      const sortPrice = sort ? { price: sort } : {};

      const products = await productDAO.getProductsPaginate(filterQuery, {
        limit: limitValue,
        lean: true,
        page: pageValue,
        sort: sortPrice
      });

      return products;
    } catch (err) {
      throw (`Error getting products ${err}`);
    }
  };

  async getProductById(id) {
    try {
      const product = await productDAO.getProductById({ _id: id });
      return product;
    } catch (err) {
      throw (`No se encontró producto de id ${id}.`);
    }
  };

  async addProduct(newProd) {
    try {
      const products = await this.getProducts();
      const controlCode = products.some((product) => product.code == newProd.code);
      if (controlCode) {
        throw ("Code already exists");
      };
      function validateString(value, fieldName) {
        if (!value) {
          throw `Must enter a ${fieldName}`;
        }
        return value;
      }

      function validatePositiveInteger(value, fieldName) {
        if (!value || !/^\d+$/.test(value)) {
          throw `Must enter a valid ${fieldName}`;
        }
        return parseInt(value);
      }

      let newProduct = {
        title: validateString(newProd.title, "title"),
        description: validateString(newProd.description, "description"),
        code: validatePositiveInteger(newProd.code, "code"),
        price: validatePositiveInteger(newProd.price, "price"),
        status: newProd.status,
        stock: validatePositiveInteger(newProd.stock, "stock"),
        category: validateString(newProd.category, "category"),
        owner: newProd.owner, // ID del user
        thumbnail: newProd.thumbnail || "Undefined"
      };
      const createdProduct = await productDAO.addProduct(newProduct);
      return createdProduct;
    } catch (err) {
      CustomError.createError({
        name: 'Creating product',
        message: err,
        code: EErros.ADD_PRODUCT_ERR
      });
    };
  };

  async updateProduct(id, fieldsToUpdate) {
    try {
      function validateField(value, errorMessage) {
        if (value === "") {
          throw errorMessage;
        }
        return value;
      }

      const fieldValidations = {
        title: "Must enter a title",
        description: "Must enter a description",
        code: "Must enter a valid code",
        price: "Must enter a valid price",
        stock: "Must enter a valid stock",
        category: "Must enter category of product"
      };

      const productToUpdate = { ...fieldsToUpdate };

      for (const field in fieldsToUpdate) {
        if (field in fieldValidations) {
          productToUpdate[field] = validateField(fieldsToUpdate[field], fieldValidations[field]);
        }
      }

      const prodUpdated = await productDAO.updateProduct({ _id: id }, productToUpdate);
      return prodUpdated;
    } catch (err) {
      throw (`Couldnt update product ${err}`);
    };
  };

  async deleteProduct(id) {
    try {
      const deletedProduct = await productDAO.deleteProduct({ _id: id });
      console.log({ deletedProduct })
      return deletedProduct;
    } catch (err) {
      throw (`Error deleting product ${id}`);
    }
  };

};

export const productService = new ProductService();