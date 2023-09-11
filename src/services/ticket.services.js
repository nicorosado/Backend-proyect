import { ticketDAO } from '../DAO/ticketDAO.js';
import { cartService } from './cartService.js';

export class TicketService {
  async addTicket(purchaser, ticket, totalCart) {
    try {
      const ticketData = {
        code: "",
        purchase_datetime: new Date(),
        amount: totalCart,
        purchaser: purchaser,
        products: ticket
      };
      const savedTicket = await ticketDAO.addTicket(ticketData);
      return savedTicket;
    } catch (error) {
      throw (`Error adding ticket ${error}`);
    }
  }

  async checkStockForTicket(cartId) {
    try {
      const cartProductsTicket = await cartService.getProductsByCartId(cartId);
      let cartWithStock = [];
      let cartWithOutStock = [];
      let totalPriceTicket = 0;

      cartProductsTicket.cartProducts.forEach((item) => {
        const idProduct = item.idProduct;
        const quantityInCart = parseInt(item.quantity);
        const availableStock = parseInt(idProduct.stock);
        const ticketAmount = parseInt(idProduct.price);

        if (quantityInCart <= availableStock) {
          const totalPriceProduct = ticketAmount * quantityInCart;
          cartWithStock.push({ idProduct, quantity: quantityInCart, totalPrice: totalPriceProduct });
          totalPriceTicket += totalPriceProduct;
        } else {
          cartWithOutStock.push({ idProduct, quantity: quantityInCart });
        }
      });

      return { cartWithStock, cartWithOutStock, totalPriceTicket };
    } catch (err) {
      throw new Error("ERROR.");
    }
  }
};

export const ticketService = new TicketService();