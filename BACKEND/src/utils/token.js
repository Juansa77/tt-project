const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const generateToken = (id, email) => {
  if (!id || !email) {
    throw new Error('Missing id or email');
  }

  return jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

//* -------------FUNCIÓN PARA VERIFICAR EL TOKEN

const verifyToken = (token, secret) => {
  if (!token) {
    throw new Error('Missing token');
  }

  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error('Invalid token');
  }
};
module.exports = { generateToken, verifyToken };
