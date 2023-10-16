const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

const { catchAsync, AppError } = require("./errorController");

const getToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPITE_IN,
  });
};

exports.signup = catchAsync(async (req, res) => {
  // we didn't use await User.create(req.body) to prevent
  // malicious data like give the role admin
  const newUser = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = getToken(newUser._id);

  const sanitizedUser = {
    _id: newUser._id,
    email: newUser.email,
    username: newUser.username,
  };

  res.status(201).json({
    status: "success",
    token,
    user: sanitizedUser,
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError("please provide an email and a password"), 400);

  // +passord to add password to the other fileds of user because we set the
  // select in user to false
  const user = await User.findOne({ email }).select("+password");

  // we don't separate the if to not tell an attacker if the email exists or not
  if (!user || !(await user.correctPassword(password, user.password)))
    return next(new AppError("Inocorrect email or password"), 401);

  const token = getToken(user._id);

  const sanitizedUser = {
    _id: user._id,
    email: user.email,
    username: user.username,
  };

  res.status(200).json({
    status: "success",
    token,
    user: sanitizedUser,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("Your are not logged in.Please login to get access", 401)
    );
  }

  // token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // check if the user still exist or its deleted
  const userExist = User.findById(decoded.id);
  if (!userExist) {
    return next(new AppError("This user no longer exists.", 401));
  }
  next();
});

exports.getOnlineUsers = catchAsync(async (req, res, next) => {});
