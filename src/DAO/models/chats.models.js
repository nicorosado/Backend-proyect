import { Schema, model } from "mongoose";

const schema = new Schema({
  message: { type: String, required: true, max: 100 },
  user: { type: String, required: true, max: 100 },
  email: { type: String, required: true, max: 100, },
});

export const ChatsModel = model("chats", schema);