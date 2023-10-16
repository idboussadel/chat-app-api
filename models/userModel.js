const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: [true, "please provide your username."],
  },
  email: {
    type: String,
    required: [true, "please provide an email."],
    unique: true,
    validate: [validator.isEmail, "please provide a valid email."],
  },
  password: {
    type: String,
    required: [true, "please provide a password."],
    select: false, // it will never show on any output
  },
  passwordConfirm: {
    type: String,
    required: [true, "please provide a password."],
    validate: {
      // this only works on CREATE and SAVE !
      validator: function (el) {
        return el === this.password;
      },
      message: "passwords are not the same.",
    },
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // delete the confirmPassword field.
  this.passwordConfirm = undefined;
  next();
});

// all the user documents have this method
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  // we give the userPassword in params of the function because
  // we cant use this.password because has select false
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model("user", userSchema);
