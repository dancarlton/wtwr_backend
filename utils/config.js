require('dotenv').config();

const { JWT_SECRET = "some key" } = process.env;
// const JWT_SECRET = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : "some key"

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

module.exports = { JWT_SECRET };
