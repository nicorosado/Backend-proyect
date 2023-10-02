import mongoose from "mongoose";

const schema = new mongoose.Schema({
    user: String,
    msg: String
}, { versionKey: false });
export const MessageModel = mongoose.model("messages", schema);