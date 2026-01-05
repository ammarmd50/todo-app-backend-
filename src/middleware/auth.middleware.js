import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constant/auth.constant.js";

export const authenticate = (req, res, next) => {
 const token = req.cookies.accessToken;
 
  if (!token) return res.status(401).json({ message: "Token not provided" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    req.user = payload; 
    next();
  } catch (err) {
    return res
      .status(401)
      .json({ message: "Invalid or expired token", error: err });
  }
};

  // note : The authentication middleware has been updated
  //        to extract the JWT token from an HTTP-only cookie named "accessToken"
  //        instead of the Authorization header.



   // const authHeader =
  //   req.headers["authorization"] || req.headers["Authorization"];
  // if (!authHeader)
  //   return res.status(401).json({ message: "Authorization header missing" });

  // const parts = authHeader.split(" ");
  // if (parts.length !== 2 || parts[0] !== "Bearer")
  //   return res
  //     .status(401)
  //     .json({ message: "Invalid authorization format. Use: Bearer <token>" });

  // const parts = parts[1];