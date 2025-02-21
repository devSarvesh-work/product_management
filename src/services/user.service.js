const bcrypt = require("bcrypt");
const User = require("../models/User.model");

class UserService {
  async createUser(userData) {
    try {
      const existingUser = await User.findOne({
        $or: [{ email: userData.email }, { phone: userData.phone }],
      });

      if (existingUser) {
        throw new Error("User already exists with given email or phone");
      }

      const hashedPassword = await bcrypt.hash(userData.password, 10);

      const user = new User({
        ...userData,
        password: hashedPassword,
      });

      return await user.save();
    } catch (err) {
      throw err;
    }
  }
  async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
  async authenticateUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("User not found");
    }

    const isPasswordValid = await this.verifyPassword(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
    }

    return user;
  }
}

module.exports = new UserService();
