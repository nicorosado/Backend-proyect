import { Schema, model } from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'
const schema = new Schema({
  // _id: String,
  title: { type: String, required: true, max: 200, index: true },
  description: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  thumbnails: { type: Array, required: true },
  status: { type: Boolean, required: true, default: true }
}, { versionKey: false })
schema.plugin(mongoosePaginate)
schema.index({ title: 'text' })
export const ProductModel = model('products', schema)
