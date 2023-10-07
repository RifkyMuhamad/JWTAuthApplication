import jwt from "jsonwebtoken";

// Middleware to verify JWT token
export const VerifyToken = (req, res, next) => {
  // Get the JWT token from the "Authorization" header
  const authHeader = req.headers["authorization"];

  // Ensure that the token exists in the header
  if (!authHeader) return res.sendStatus(401);

  // Extract the token from the "Bearer" format
  const token = authHeader.split(" ")[1];
  const accessToken = process.env.ACCESS_TOKEN_SECRET;

  // Verify the token
  jwt.verify(token, accessToken, (err, decoded) => {
    // If there's an error in verification, return a 403 Forbidden response
    if (err) return res.sendStatus(403);

    // Store the decoded email in the request object
    req.email = decoded.email;
    next();
  });
};
