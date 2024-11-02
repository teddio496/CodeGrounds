import { prisma } from "@/utils/prismaClient";
import * as bcrypt from "bcrypt";

export async function POST(){
    // PASSWORD IS "adminpassword"
    try {
        const saltRounds = 10;
        const password = await bcrypt.hash("adminpassword", saltRounds);
        const createAdmin = await prisma.user.create({
            data : {
                username: "Admin User",
                password,
                role: "Admin"
            }
        })
        return Response.json({ message: "successfully created a admin user" }, { status: 201 });

    } catch (e) {
    console.error(e);
    return Response.json({ error: "failed to create admin user" }, { status: 400 });
  }

}