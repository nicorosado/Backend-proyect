import { Schema, model } from "mongoose";

const schema = new Schema({
  firstName: { type: String, required: false, max: 100 },
  lastName: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, unique:true },
  password: { type: String, required: false, max: 100,  },
  cart: { type: String , required: false,  },
  age: {type: Number,max: 100 ,required: false },
  role: { type: String, default:"user", required: false },

});

export const UserModel = model("users", schema);
