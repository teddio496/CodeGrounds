// pages/api/upload.ts
import { prisma } from "@/utils/db";
import { JWTPayload } from "jose";
import path from "path";

const multer = require("multer");

// Configure multer to store uploaded files in the 'uploads/' directory
const upload = multer({ dest: "uploads/" });

// Create a middleware to handle file uploads
const uploadMiddleware = upload.single("image");

// API Route Handler
export function protectedHandler(req: Request) {
  if (req.method === "PUT") {
    uploadMiddleware(req, async (err: any) => {
      if (err) {
        return Response.json({
          error: "something went wrong with avatar update",
        });
      }
      if (!req.file) {
        return Response.json({ error: "No file uploaded" });
      }

      const { username } = req.user as JWTPayload; // Get user ID from request body

      try {
        // Save the image URL or path
        const imageUrl = path.join("uploads", req.file.filename); // You might want to store it in a different place (e.g., cloud storage)

        // Update user in the database
        const updatedUser = await prisma.user.update({
          where: { username: username },
          data: { avatar: imageUrl },
        });

        Response.json(updatedUser);
      } catch (error) {
        console.error(error);
        Response.json({
          error: "An error occurred while uploading the image",
        });
      }
    });
  }
}
