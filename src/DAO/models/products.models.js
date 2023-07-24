import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"
const schema = new Schema({
  title: { type: String, required: true, max: 100 },
  price: { type: Number, required: true },
  description: { type: String, required: true, max: 100 },
  code: { type: String, required: true, max: 100, unique:true },
  thumbnail: { type: String,  max: 100, },
  category: { type: String, required: true, max: 100 },
  stock: { type: Number, required: true, max: 100 },

});

schema.plugin(mongoosePaginate);
export const ProductsModel = model("products", schema);
