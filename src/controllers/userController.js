const UserService = require("../services/user.service");
const {
  createUserValidationSchema,
  loginUserValidationSchema,
} = require("../validations/user.validation");
const { generateToken } = require("../config/jwt");
const User = require("../models/User.model");

class UserController {
  async register(req, res) {
    try {
      const { error } = createUserValidationSchema.validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.details[0].message });
      }

      const user = await UserService.createUser(req.body);

      return res.status(201).json({
        status: true,
        message: "User created successfully",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({ status: false, message: err.message });
    }
  }
  async login(req, res) {
    try {
      const { error } = loginUserValidationSchema.validate(req.body);

      if (error) {
        return res
          .status(400)
          .json({ status: false, message: error.details[0].message });
      }

      const { email, password } = req.body;

      const user = await UserService.authenticateUser(email, password);

      if (user) {
        const accessToken = generateToken(user._id);
        res.status(200).json({
          status: true,
          message: "User logged in successfully",
          data: {
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            token: accessToken,
          },
        });
      } else {
        res.status(401).json({
          status: false,
          message: "Invalid email or password",
        });
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  async getUserProfile(req, res) {
    try {
      const { userIdFromParams } = req.params;

      if (userIdFromParams !== req.user._id.toString()) {
        return res.status(403).json({
          status: false,
          message: "Unauthorized access",
        });
      }

      const user = await User.findById(userIdFromParams).select("-password");

      if (!user) {
        return res.status(404).json({
          status: false,
          message: "User not found",
        });
      }
      return res.status(200).json({
        status: true,
        message: "User profile details",
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        status: false,
        message: err.message,
      });
    }
  }
}

module.exports = new UserController();
