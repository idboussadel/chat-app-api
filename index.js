const morgan = require("morgan");
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const {
  handleDuplicateFieldsDB,
  handleValidationErrorDB,
  sendErrorDev,
  handleCastErrorDB,
  sendErrorProd,
  AppError,
  handleJwtError,
  handleJwtExpiredError,
} = require("./controllers/errorController");
const authRoute = require("./routes/authRoute");
const userRoute = require("./routes/userRoute");
const chatRoute = require("./routes/chatRoute");

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

console.log(process.env.NODE_ENV);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Use the server instance returned by setupSocket

app.use("/api/v1/users", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/", authRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// express middleware to catch errors
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  err.message = err.message || "Something went wrong";
  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.name === "JsonWebTokenError") err = handleJwtError(err);
    if (err.name === "TokenExpiredError") err = handleJwtExpiredError(err);
    sendErrorProd(err, res);
  }
});

app.listen(port, () => console.log(`The server is running at ${port}`));
