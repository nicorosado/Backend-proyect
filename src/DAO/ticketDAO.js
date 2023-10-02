//@ts-check
import { TicketModel } from "./mongo/models/ticketModel.js";

export class TicketDAO {
  async addTicket(newTicket) {
    try {
      const ticket = await TicketModel.create(newTicket);
      ticket.code = ticket._id.toString();
      await TicketModel.findByIdAndUpdate(ticket._id, { code: ticket.code });
      return ticket;
    } catch (err) {
      throw (`Error adding ticket ${err}`);
    }
  }
}

export const ticketDAO = new TicketDAO();



