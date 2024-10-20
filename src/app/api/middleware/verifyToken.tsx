import { NextApiRequest, NextApiResponse } from "next";

const jwt = require("jsonwebtoken");

declare module 'next' {
  interface NextApiRequest {
    user?: Payload;
  }
}

export default async function verifyToken(req: NextApiRequest, res: NextApiResponse, next: Function) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(401).json({ message: "authorization header missing" });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next();
  }
  catch (e) {
    return res.status(401).json({ error: "invalid or expired token" });
  }
}