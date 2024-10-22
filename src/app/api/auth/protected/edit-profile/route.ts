import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
  const { newFirstName, newLastName, newPhoneNumber } = await req.json();
  const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };
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
    return Response.json({ updatedUser: updatedUser, status: 200 });
  }
  catch (e) {
    console.log(e);
    return Response.json({ error: "error updating user info" });
  }
}