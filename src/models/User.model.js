const mongoose = require("mongoose");
const validator = require("validator");

const addressSchema = new mongoose.Schema({
  street: {
    type: String,
    required: [true, "Street address is required"],
    trim: true,
    maxlength: [200, "Street address must be less than 200 characters"],
  },
  city: {
    type: String,
    required: [true, "City is required"],
    trim: true,
    maxlength: [50, "City must be less than 50 characters"],
  },
  pincode: {
    type: String,
    required: [true, "Pincode is required"],
    validate: {
      validator: function (v) {
        return validator.isPostalCode(v, "IN");
      },
      message: "Please fill a valid Indian pincode",
    },
  },
});

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: validator.isEmail,
        message: "Please fill a valid email address",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      maxlength: 100,
    },
    profileImage: {
      type: String,
      required: true,
      validate: {
        validator: validator.isURL,
        message: "Please fill a valid URL for the profile image",
      },
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Phone number is required"],
      validate: {
        validator: function (v) {
          return validator.isMobilePhone(v, "en-IN");
        },
        message: "Please fill a valid Indian phone number",
      },
    },
    address: {
      shipping: {
        type: addressSchema,
        required: [true, "Shipping address is required"],
      },
      billing: {
        type: addressSchema,
        required: [true, "Billing address is required"],
      },
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
