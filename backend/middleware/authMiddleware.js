require('dotenv').config();

const authMiddleware = (req, res, next) => {
  try {
    // Extract Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Basic ')) {
      return res.status(401).json({ message: 'Unauthorized: Missing or invalid Authorization header' });
    }

    // Decode Base64 credentials
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');

    // Validate username and password against environment variables
    if (username === process.env.AUTH_USER && password === process.env.AUTH_PASS) {
      return next(); // Proceed to the next middleware or route handler
    }

    // Invalid credentials
    return res.status(401).json({ message: 'Unauthorized: Invalid credentials' });
  } catch (error) {
    // Catch and handle unexpected errors
    console.error('Error in authMiddleware:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = authMiddleware;
