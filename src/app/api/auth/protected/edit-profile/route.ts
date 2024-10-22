import { prisma } from "@/utils/db";
import { syncBuiltinESMExports } from "module";

export async function PUT(req: Request) {
  const { username, newFirstName, newLastName, newPhoneNumber } = await req.json();
  console.log(req);
  console.log(username, newFirstName, newLastName, newPhoneNumber);
  try {
    const user = await prisma.user.findUnique({
      where: { username: username }
    });
    if (!user) {
      return Response.json({ error: "username doesn't exist" });
    }
    const updatedUser = await prisma.user.update({
      where: {
        username: username
      },
      data: {
        firstName: newFirstName ?? user.firstName,
        lastName: newLastName ?? user.lastName,
        phoneNumber: newPhoneNumber ?? user.phoneNumber,
      }
    });
    return Response.json({ updatedUser: updatedUser, success: true });
  }
  catch (e) {
    console.log(e);
    return Response.json({ error: "error updating user info" });
  }
}