import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";


const schema = new Schema({
    title: { type: String },
    description: { type: String },
    code: { type: Number },
    price: { type: Number },
    status: { type: Boolean },
    stock: { type: Number },
    category: { type: String, index: true },
    thumbnail: { type: String },
    owner: { type: String },
}, { versionKey: false });
schema.plugin(mongoosePaginate);
export const ProductModel = model("products", schema);




