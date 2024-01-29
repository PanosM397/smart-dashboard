const errorHandler = (err, req, res, next) => {
    let message = 'Something went wrong';
    let status = 500;
  
    // Handle different types of errors here
    if (err.name === 'ValidationError') {
      message = Object.values(err.errors).map(val => val.message).join(', ');
      status = 400;
    }
  
    res.status(status).json({ success: false, message });
  };
  
  module.exports = errorHandler;
  