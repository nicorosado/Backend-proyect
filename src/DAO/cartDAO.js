import { CartModel } from "./mongo/models/cartModel.js";

export class CartDAO {

  async getCarts(limit) {
    try {
      const carts = await CartModel.find().limit(limit);
      return carts;
    } catch (err) {
      throw (`Error obtaining data from carts`);
    }
  };

  async getCartById(cartId) {
    try {
      const cart = await CartModel.findById(cartId);
      return cart;
    } catch (err) {
      throw (`Didnt find cart with id ${cartId}.`);
    }
  };

  async addCart() {
    try {
      const createdCart = await CartModel.create({});
      return createdCart;
    } catch (err) {
      throw (`Error creating new cart`);
    };
  };

  async addProductToCart(cartId, cart) {
    try {
      const updatedCart = await CartModel.findByIdAndUpdate(cartId, cart, { new: true });
      return updatedCart;
    } catch (err) {
      throw (`Error adding product to cart`);
    }
  };

  async getProductsByCartId(cartId) {
    try {
      const cart = await CartModel.findById(cartId).populate('products.idProduct').lean();
      const cartProducts = cart.products;
      return { cartProducts };
    } catch (err) {
      throw (`Error obtaining products from cart`);
    }
  };

  async deleteProductFromCart(cartId, cart) {
    try {
      const updatedCart = await CartModel.findByIdAndUpdate(cartId, cart, { new: true });
      return updatedCart;
    } catch (Error) {
      throw (`Error deleting product from cart`);
    }
  };

  async updateCart(cid, cartUpdate) {
    try {
      const updatedCart = await CartModel.findOneAndUpdate(cid, cartUpdate, { new: true });
      return updatedCart;
    } catch (err) {
      throw (`Error updating cart`);
    };
  };

  async emptyCart(cid) {
    try {
      const emptyCart = await CartModel.findOneAndUpdate(cid, { products: [] }, { new: true });
      return emptyCart;
    } catch (err) {
      throw (`Error emptying cart`);
    };
  };

  async deleteCart(id) {
    try {
      const deletedcart = await CartModel.findOneAndDelete(id);
      return deletedcart;
    } catch (err) {
      throw (`Error deleting cart`);
    };
  };
}
export const cartDAO = new CartDAO();
