import { Schema, model } from 'mongoose'

export const cartSchema = new Schema({
  products: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'products'
      },
      quantity: {
        type: Number,
        default: 0
      }
    }
  ]
})

export const CartModel = model('carts', cartSchema)
