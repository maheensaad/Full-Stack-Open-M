const jwt = require('jsonwebtoken');

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');

  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.substring(7); 
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'Token missing' });
  }

  jwt.verify(request.token, process.env.SECRET, (error, decodedToken) => {
    if (error) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    if (!decodedToken.id) {
      return response.status(401).json({ error: 'Invalid token' });
    }

    // Set the user in the request object
    request.user = decodedToken;

    next();
  });
};

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'Invalid token' });
  }

  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'Token expired' });
  }

  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

module.exports = { tokenExtractor, userExtractor, errorHandler };
