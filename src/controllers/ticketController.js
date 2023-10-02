import { cartService } from "../services/cartService.js";
import { ticketService } from "../services/ticketService.js";

class TicketsController {
  async addTicket(req, res) {
    try {
      const user = req.session.user
      const userCartId = user.idCart;
      const buyer = user.email;
      const ticketPreview = await ticketService.checkStockForTicket(userCartId);
      const ticket = ticketPreview.cartWithStock;
      const totalCart = ticketPreview.totalPriceTicket;
      const oldProductsCart = ticketPreview.cartWithOutStock;
      await cartService.updateCart(userCartId, oldProductsCart);
      await ticketService.addTicket(buyer, ticket, totalCart);
      return res.render('finishticket', { ticket, totalCart, buyer });
    } catch (err) {
      res.status(500).json({ Error: `${err}` });
    };
  };

  async checkOut(req, res) {
    try {
      const user = req.session.user;
      const userCartId = user.idCart;
      const cartProducts = await cartService.getProductsByCartId(userCartId);
      const ticketPreview = await ticketService.checkStockForTicket(userCartId);
      return res.render('checkout', { user, cartProducts, ticketPreview });
    } catch (err) {
      res.status(500).json({ Error: `${err}` });
    };
  };
};

export const ticketsController = new TicketsController();
