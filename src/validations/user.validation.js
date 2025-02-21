const Joi = require("joi");

const createUserValidationSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
  profileImage: Joi.string().uri().required(),
  phoneNumber: Joi.string()
    .pattern(/^(\+91|0)?[6-9]\d{9}$/)
    .required(),
  address: Joi.object({
    shipping: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      pincode: Joi.number().required(),
    }).required(),
    billing: Joi.object({
      street: Joi.string().required(),
      city: Joi.string().required(),
      pincode: Joi.string().required(),
    }).required(),
  }).required(),
});

const loginUserValidationSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).max(100).required(),
});

module.exports = { createUserValidationSchema, loginUserValidationSchema };
