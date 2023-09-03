const express = require("express");
const http = require("http");
const dotenv = require("dotenv");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Server } = require("socket.io");

// this will called for all uncaught exception errors for sync process
// always should be top in order to catch all uncaught error in code base
process.on("uncaughtException", (err) => {
  console.log("Uncaught exception error occurred, shutting down...");
  process.exit(1);
});

//routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const CustomError = require("./utils/customError");
const globalErrorController = require("./controller/errorController");

const {
  verifySocketConnection,
} = require("./middleware/verifySocketConnection");
const messageHandler = require("./socketHandlers/messageHandler");
const connectionHandler = require("./socketHandlers/connectionHandler");

dotenv.config({ path: path.relative(__dirname, ".env") });

const PORT = process.env.PORT;
const MONGODB_CONNECT_URL = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_USER_PASSWORD}@cluster0.batd5r2.mongodb.net/?retryWrites=true&w=majority`;
const MONGODB_LOCAL_CONNECT_URL = `${process.env.MONGO_DB_LOCAL_URL}/${process.env.MONGODB_LOCAL_DB}`;

const app = express();

const server = http.createServer(app);

// sockets server engine.io
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_ROOT_URL,
  },
});

io.use(verifySocketConnection);

io.on("connection", (socket) => {
  messageHandler(io, socket);
  connectionHandler(io, socket);
});

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.text());

app.use("/auth", authRoutes);
app.use("/user", userRoutes);

// This will match all routes so keep it at last.
// If express didn't find any matching route above, the below callback function will be invoked.
app.all("*", (req, res, next) => {
  const err = new CustomError(
    404,
    `Can't find ${req.originalUrl} on the server!`
  );
  next(err);
});

app.use(globalErrorController);

async function connectToDatabase() {
  await mongoose.connect(
    process.env.NODE_ENV === "production"
      ? MONGODB_CONNECT_URL
      : MONGODB_LOCAL_CONNECT_URL
  );
  console.log("connected to database!!!");
}

connectToDatabase();

server.listen(PORT, () => {
  console.log(`app listening to port ${PORT}`);
});

// this will called for all unhandled rejection errors for async process
process.on("unhandledRejection", (err) => {
  console.log("Unhandled rejection error occurred, shutting down...");
  server.close(() => {
    process.exit(1);
  });
});
