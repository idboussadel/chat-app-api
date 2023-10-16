const User = require("../models/userModel");
const { catchAsync, AppError } = require("./errorController");

exports.getUser = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findOne({ _id: userId });
  if (!user) return next(new AppError("Inocorrect id."), 401);
  res.status(201).json({ status: "succes", user });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();
  res.status(201).json({ status: "succes", user });
});
