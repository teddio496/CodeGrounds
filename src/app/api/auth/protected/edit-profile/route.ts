import { prisma } from "@/utils/prismaClient";

export async function PUT(req: Request) {
  try {
    const { newFirstName, newLastName, newPhoneNumber } = await req.json();
    const { username } = JSON.parse(req.headers.get("payload") as string) as { username: string;[key: string]: any; };

    const updateData: any = {};
    if (newFirstName) updateData.firstName = newFirstName;
    if (newLastName) updateData.lastName = newLastName;
    if (newPhoneNumber) updateData.phoneNumber = newPhoneNumber;
    const updatedUser = await prisma.user.update({
      where: {
        username
      },
      data: updateData
    });
    return Response.json({ updatedUser }, { status: 200 });
  }
  catch (e) {
    console.error(e);
    return Response.json({ error: "error updating user info" }, { status: 500 });
  }
}