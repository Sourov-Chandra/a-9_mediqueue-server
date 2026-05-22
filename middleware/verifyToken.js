 const jwt = require("jsonwebtoken");

 module.exports = function verifyToken(req, res, next) {
   const authHeader = req.headers.authorization;
   const token = authHeader?.split(" ")[1];

   if (!token) {
     return res.status(401).send({ message: "Unauthorized" });
   }
   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
     if (err) {
       return res.status(401).send({ message: "Unauthorized" });
     }
     req.user = decoded;
     next();
   });
 };