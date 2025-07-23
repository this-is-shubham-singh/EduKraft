import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import dbConnection from "./config/database.js";
dotenv.config();

const app = express();

const PORT = 4000 || process.env.PORT;

// db connection 
dbConnection();

// middlewares
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json("server running");
});

app.listen(PORT, (req, res) => {
  console.log("running at port", PORT);
});
