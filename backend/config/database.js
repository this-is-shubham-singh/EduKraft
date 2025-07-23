import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_ATLAS_URI);

    console.log("db connection successfull");
  } catch (e) {
    console.log("error on db connection ", e.message);
  }
};

export default dbConnection;
