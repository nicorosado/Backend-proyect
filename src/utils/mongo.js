import { connect } from "mongoose";
import dotenv from "dotenv";

dotenv.config();
export async function connectMongo() {
  try {
    await connect(process.env.MONGO_URL);
    console.log("Connected to MongoDB!");
  } catch (err) {
    console.log(err);
    throw "Unable to connect to the database";
  }
}
