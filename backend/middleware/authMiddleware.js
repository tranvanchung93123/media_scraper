// middleware/authMiddleware.js
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Unauthorized' });

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username === process.env.AUTH_USER && password === process.env.AUTH_PASS) {
    return next();
  }
  return res.status(401).json({ message: 'Unauthorized' });
};

module.exports = authMiddleware;
