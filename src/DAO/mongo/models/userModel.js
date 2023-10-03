import { Schema, model } from 'mongoose';

const schema = new Schema({
  firstName: { type: String, max: 100 },
  lastName: { type: String, max: 100 },
  email: { type: String, max: 100, unique: true },
  age: { type: Number },
  idCart: { type: String },
  password: { type: String, max: 100 },
  isPremium: { type: Boolean, default: false },
  role: { type: String, default: 'user' },
  lastLoginDate: { type: Date }

}, { versionKey: false }
);

export const UserModel = model('users', schema);
