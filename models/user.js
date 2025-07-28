const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

//hash password before saving

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

//compare password

userSchema.methods.comparePassword = function (enteredPassword) {
  return bcrypt.compare(String(enteredPassword), this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
