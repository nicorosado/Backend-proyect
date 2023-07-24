import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, (path.join(__dirname, "public/img")));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
export const uploader = multer({ storage });

import { fileURLToPath } from "url";
export const __filename = fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);

import { connect } from "mongoose";
import config from "./config/config.js";

// CONECTAR MONGO
export async function connectMongo() {
  
  try {
    await connect(
      config.mongoUrl
    );
    console.log("plug to mongo!");
  } catch (e) {
    console.log(e);
    throw "can not connect to the db";
  }
}
//hash
import bcrypt from 'bcrypt';
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (password, hashPassword) => bcrypt.compareSync(password, hashPassword);

