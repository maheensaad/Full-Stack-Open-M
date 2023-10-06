const jwt = require('jsonwebtoken');
const User = require('../models/user');


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
  
    jwt.verify(request.token, process.env.SECRET, async (error, decodedToken) => {
      if (error) {
        return response.status(401).json({ error: 'Invalid token' });
      }
  
      if (!decodedToken.id) {
        return response.status(401).json({ error: 'Invalid token' });
      }
  
      try {
        // Fetch the user from the database based on the decoded token's ID.
        const user = await User.findById(decodedToken.id);
  
        if (!user) {
          return response.status(401).json({ error: 'User not found' });
        }
  
        // Set the user in the request object as a Mongoose model instance.
        request.user = user;
        next();
      } catch (err) {
        // Handle any errors that occur while fetching the user from the database.
        next(err);
      }
    });
  };
  

module.exports = { tokenExtractor, userExtractor };