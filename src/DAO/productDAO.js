import { ProductModel } from "./mongo/models/productModel.js";

export class ProductDAO {
  async getProducts(limit) {
    try {
      const products = await ProductModel.find().limit(limit).lean().exec();
      return products;
    } catch (err) {
      throw (`Error obtaining products ${err}`);
    }
  };

  async getProductsPaginate(filter, limit, lean, page, sort) {
    try {
      const products = await ProductModel.paginate(filter, limit, lean, page, sort);
      return products;
    } catch (err) {
      throw (`Error obtaining products ${err}`);
    }
  };

  async getProductById(id) {
    try {
      const product = await ProductModel.find({ _id: id });
      return product;
    } catch (err) {
      throw (`Didnt find product ${err}`);
    }
  };

  async addProduct(newProd) {
    try {
      const createdProduct = await ProductModel.create(newProd);
      return createdProduct;
    } catch (err) {
      throw (`Error adding product ${err}`);
    };
  };

  async updateProduct(id, fieldsToUpdate) {
    try {
      const prodUpdated = await ProductModel.findByIdAndUpdate(id, fieldsToUpdate, { new: true });
      return prodUpdated;
    } catch (err) {
      throw (`Couldt update product with id ${id}. ${err}`);
    };
  };

  async deleteProduct(id) {
    try {
      const deletedProduct = await ProductModel.findByIdAndDelete(id);
      return deletedProduct;
    } catch (err) {
      throw (`Error deleting product ${err}`);
    };
  };
}

export const productDAO = new ProductDAO();
