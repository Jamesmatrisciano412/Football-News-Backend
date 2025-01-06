const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { Schema } = mongoose;

const userSchema = new Schema({
  fullname: {
    type: String,
    required: [true, "Fullname is required."],
    index: true,
  },
  email: {
    type: String,
    required: [true, "Email is required."],
    match: [/\S+@\S+\.\S+/, "is invalid"],
    index: true,
  },
  password: {
    type: String,
    trim: true,
    minlength: 8,
    maxlength: 60,
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Phone number is required."],
  },
});

userSchema.methods.hashPassword = function() {
    var password = this.password;

    return new Promise((resolve, reject) => {
      bcrypt.genSalt(10, (err1, salt) => {
        if (err1) { reject(err1); }
        bcrypt.hash(password, salt, (err2, hash) => {
          if (err2) { reject(err2); }
          this.password = hash;
          resolve(hash);
        });
      });
    });
  };

const User = mongoose.model("Users", userSchema);
module.exports = User;
