const jwt = require('jsonwebtoken');
const Account = require('../models/account');

const authMiddleware = (roles = []) => {
  return async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      return res.status(401).json({ msg: 'Authorization token is missing' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const account = await Account.findById(decoded.id);

      if (!account) {
        return res.status(401).json({ msg: 'Account not found' });
      }

      // Kiểm tra nếu role của tài khoản không nằm trong các roles cho phép
      if (roles.length && !roles.includes(account.role)) {
        return res.status(403).json({ msg: 'Access denied: insufficient permissions' });
      }

      req.account = account;
      next();
    } catch (err) {
      console.error(err);
      return res.status(401).json({ msg: 'Invalid token' });
    }
  };
};

module.exports = authMiddleware;