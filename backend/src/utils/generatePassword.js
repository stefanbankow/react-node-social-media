const bcrypt = require("bcrypt");

const generatePassword = async (password) => {
  const hashedPassword = await bcrypt.hash(password, 8);
  return hashedPassword;
};

module.exports = generatePassword;
