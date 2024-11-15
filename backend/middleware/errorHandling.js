// middleware/errorHandling.js
const errorHandling = (err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'An unexpected error occurred!' });
  };
  
  module.exports = errorHandling;
  