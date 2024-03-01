const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "secret";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  firstName: String,
  lastName: String,
  organization: String,
  telephone: String,
  contributions: String,
  role: {
    type: String,
    enum: ["admin", "tenant", "manager"],
    default: "tenant",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  lastLogin: Date,
});

UserSchema.pre("save", function (next) {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
  next();
});

UserSchema.methods.generateAuthToken = function () {
  // 'this' refers to the user instance
  const token = jwt.sign({ _id: this._id.toString() }, JWT_SECRET, {
    expiresIn: "1h", // Expires in one hour, you can adjust as necessary
  });
  return token;
};

module.exports = mongoose.model("User", UserSchema);
