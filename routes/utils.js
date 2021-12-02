const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const genPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash(password, salt);
  return hashed;
};

// generate access token
const getAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.ACCESS_TOKEN_KEY,
    {
      expiresIn: process.env.JWT_ACC_EXP,
    }
  );
};

// generate refresh token
const getRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.REFRESH_TOKEN_KEY,
    {
      expiresIn: process.env.JWT_REF_EXP,
    }
  );
};

module.exports = { genPassword, getAccessToken, getRefreshToken };
