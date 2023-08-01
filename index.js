const express = require("express");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.relative(__dirname, ".env") });

const PORT = process.env.PORT;

const app = express();


app.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});
