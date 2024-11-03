import { PrismaClient } from '@prisma/client';
import * as bcrypt from "bcrypt";

const prisma = new PrismaClient();

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

} catch (e) {
    console.error(e);
}

