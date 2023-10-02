import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const schema = new Schema({
   products: [
      {
         idProduct: { type: Schema.Types.ObjectId, ref: "products" },
         quantity: { type: Number }, _id: false
      }
   ]
},
   { versionKey: false }
);

schema.plugin(mongoosePaginate);

export const CartModel = model("carts", schema);
