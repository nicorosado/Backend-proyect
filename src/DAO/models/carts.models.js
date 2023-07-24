import { Schema, model } from "mongoose";

const schema = new Schema({
  products:{
    type:[{
        product:{
             type: Schema.Types.ObjectId,
             ref:'products',
             index:true,
        },
        quantity:{type:Number},
  
    }],
    default: [],
  } 
});

export const CartsModel = model("carts", schema);