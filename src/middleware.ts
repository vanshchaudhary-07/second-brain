import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const payload = jwt.verify(
      token,"vansh@123"
    ) as { _id: string };

    req.userId = payload._id;
    next();
  } 
  catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export default userMiddleware;
