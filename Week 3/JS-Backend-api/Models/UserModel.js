// let users = [];

// module.exports = users;

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  id: String,
  name: String,
  email: String
});

module.exports = mongoose.model("User", userSchema);