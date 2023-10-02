
import { Schema, model } from 'mongoose';

const schema = new Schema(
  {
    code: { type: String, },
    purchase_dateTime: { type: Date, },
    amount: { type: Number, },
    purchaser: { type: String, },
    products: [{ idProduct: { type: Object }, _id: false, quantity: { type: Number }, totalPrice: { type: Number } }]
  }, { versionKey: false }
);
export const TicketModel = model('tickets', schema);
