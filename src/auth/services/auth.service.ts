import { prisma } from "@/db/prisma.service";
import { User } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthService {
  constructor() {
  }

  async login(email: string, password: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          permission: {
            select: {
              name: true,
            },
          },
        },
      });
  
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error("Invalid credentials!");
      }
  
      const secretKey = process.env.SECRET_KEY || "";
      const token = jwt.sign(
        { id: user.id, email: user.email, permission: user.permission.name },
        secretKey,
        {
          expiresIn: "24h",
        },
      );
      return { user, token };
    } catch(error) {
      
    }
  }
}

export { AuthService };
