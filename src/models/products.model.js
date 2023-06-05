import { Schema, model } from 'mongoose'

const schema = new Schema({
  _id: String,
  title: { type: String, required: true, max: 200 },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  thumbnails: { type: Array, required: true },
  status: { type: Boolean, required: true, default: true }
}, { versionKey: false })

export const ProductModel = model('products', schema)
