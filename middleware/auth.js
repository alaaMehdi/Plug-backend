const jwt = require('jsonwebtoken');
const JWTSecret = process.env.JWT_SECRET;

module.exports = (req, res, next) => {

  try {
    const token = req.headers.authorization.split(' ')[1];
    console.log(token);
    const decodedToken = jwt.verify(token, JWTSecret);
    const userId = decodedToken.id;
    console.log(decodedToken);
    console.log(req.body.userId);
    console.log(req.body.id);
    if (req.body.userId && req.body.userId !== userId) {
      throw 'Invalid user ID';
    } else {
      next();
    }
  } catch (e) {
    res.status(401).json({
      error: e
    });
  }
};