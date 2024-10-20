import { NextApiRequest, NextApiResponse } from "next";
import verifyToken from "../middleware/verifyToken";

const protectedHandler = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    message: "this is a protected route",
    user: req.user,
  });
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  verifyToken(req, res, () => protectedHandler(req, res));
}