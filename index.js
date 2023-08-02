const express = require("express");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");

dotenv.config({ path: path.relative(__dirname, ".env") });

const PORT = process.env.PORT;
const MONGO_DB_CONNECT_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}@cluster0.batd5r2.mongodb.net/?retryWrites=true&w=majority`;

const app = express();

app.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});

async function connectToDatabase() {
 try{
    await mongoose.connect(MONGO_DB_CONNECT_URL);
    console.log("connected to database!!!");
 }catch {
    console.log("error in connecting to database...");
 }
}

connectToDatabase();