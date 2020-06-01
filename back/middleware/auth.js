const jwt = require('jsonwebtoken');

function auth(req, res, next) {
   const token = req.header('x-auth-token');
   
   if(!token) {
      return res.status(401).send(`Access denied. No token provided`);
   }

   try {
      const decodedPayload = jwt.verify(token, process.env.jwtPrivateKey);
      req.userId = decodedPayload._id;
      //console.log("Here's the decodedpayload " + JSON.stringify(decodedPayload));
      next(); // Passes to next middleware function
   } 
   catch(ex) {
      res.status(400).send(`Invalid token.`);
   }
}

module.exports = auth;