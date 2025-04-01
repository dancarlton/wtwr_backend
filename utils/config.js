require('dotenv').config();

const { JWT_SECRET = "b48e672e64ce6c531f185f2289ee76f99a082f09956e0ee6a8ebcbab80de1707" } = process.env;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

module.exports = { JWT_SECRET };
