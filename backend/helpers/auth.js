const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { User } = require('../models'); // Assuming you have a User model defined with Sequelize

dotenv.config();

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('token');
    if (!token) {
      return res.status(401).json({ message: 'Access denied. Token not provided.' });
    }

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findOne({ where: { email: decoded.email } });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error.message)
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

const authorize = (roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Access denied.' });
    }
    next();
  };
};

module.exports = { authenticate, authorize };
