class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}
exports.AppError = AppError;

exports.catchAsync = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      const message = err.message || "Something went wrong";
      const statusCode = err.statusCode || 500;
      // we use next(new AppError) instead of a simple throw
      // to pass the error to the Express's error-handling middlware
      next(new AppError(message, statusCode));
    });
  };
};

// handel mongodb type error
exports.handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// handel the the fields who has unique in them
exports.handleDuplicateFieldsDB = (err) => {
  const fieldName = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${err.keyValue[fieldName]}. Please use another value for ${fieldName}.`;
  return new AppError(message, 400);
};

// handel the require and validate fields
exports.handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

exports.handleJwtError = () => {
  return new AppError("Invalid token.Please login again", 401);
};

exports.handleJwtExpiredError = () => {
  return new AppError("Your token is experied.Please login again", 401);
};

// handel the 2 types of error sending
exports.sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

exports.sendErrorProd = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};
