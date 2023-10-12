import { cartDAO } from '../DAO/cartDAO.js';
import { productService } from '../services/productService.js';

export class CartService {

  async getCarts(limit) {
    try {
      const carts = await cartDAO.getCarts(limit);
      return carts;
    } catch (err) {
      throw (`Error obtaining carts ${err}`);
    }
  };

  async getCartById(cartId) {
    try {
      const cart = await cartDAO.getCartById(cartId);
      cart ? cart : (() => { throw (`Didnt found cart with id  ${cartId}`) })();
      return cart;
    } catch (err) {
      throw (`Error getting cart ${err}`);
    }
  };

  async addCart() {
    try {
      const createdCart = await cartDAO.addCart();
      return createdCart;
    } catch (err) {
      throw (`Error creating cart ${err}`);
    };
  };


  async addProductToCart(cartId, productId, quantityP) {
    try {
      const productToCart = await productService.getProductById(productId);
      productToCart ? productToCart : (() => { throw ("Product doesnt exists in database") })();
      const cart = await cartDAO.getCartById(cartId);
      cart ? cart : (() => { throw (`Didnt find cart with id: ${cartId}.`) })();
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      if (productIndex === -1) {
        cart.products.push({ idProduct: productId, quantity: quantityP ? quantityP : 1 });
      } else {
        if (quantityP) {
          cart.products[productIndex].quantity = quantityP;
        } else {
          cart.products[productIndex].quantity++;
        }
      }
      const updatedCart = await cartDAO.addProductToCart({ _id: cartId }, cart);
      return updatedCart;
    } catch (err) {
      throw (`Error adding product to cart ${err}`);
    }
  };



  async getProductsByCartId(cartId) {
    try {
      const cartProducts = await cartDAO.getProductsByCartId(cartId)
      return cartProducts;
    } catch (err) {
      throw (`Error getting products ${err}`);
    }
  };

  async updateCart(cartId, cartUpdate) {
    try {
      const updatedCart = await cartDAO.updateCart({ _id: cartId }, { products: cartUpdate });
      return updatedCart;
    } catch (err) {
      throw (`Error finding cart ${err}`);
    };
  };

  async deleteProductFromCart(cartId, productId) {
    try {
      const productToCart = await productService.getProductById(productId);
      if (!productToCart) {
        throw new Error("Product doesn't exist in the database");
      }
      const cart = await cartDAO.getCartById(cartId);
      if (!cart) {
        throw new Error(`Didn't find cart with id: ${cartId}`);
      }
      const productIndex = cart.products.findIndex((p) => p.idProduct.toString() === productId);
      if (productIndex !== -1 && cart.products[productIndex].quantity > 0) {
        if (cart.products[productIndex].idProduct.toString() === productId) {
          if (cart.products[productIndex].quantity > 1) {
            cart.products[productIndex].quantity -= 1
          } else {
            cart.products.splice(productIndex, 1);
          }
        }
      }
      console.log(cart.products)
      const updatedCart = await cartDAO.deleteProductFromCart(cartId, cart);
      return updatedCart;
    } catch (err) {
      throw (`Error deleting product from cart: ${err.message}`);
    }
  }


  async emptyCart(cartId) {
    try {
      const emptyCart = await cartDAO.emptyCart({ _id: cartId });
      return emptyCart;
    } catch (err) {
      throw (`Fallo al encontrar cart. ${err}`);
    };
  };

  async deleteCart(cartId) {
    try {
      const deletedcart = await cartDAO.deleteCart({ _id: cartId });
      return deletedcart;
    } catch (err) {
      throw (`Error deleting cart`);
    };
  };

};

export const cartService = new CartService();