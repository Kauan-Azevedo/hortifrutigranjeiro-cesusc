import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "";

export const authenticateJWT = (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) {
    return res.sendStatus(403);
  }

  jwt.verify(token, SECRET_KEY, (err: any, user: any) => {
    if (err) {
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};

export function Authenticated() {
  return function (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => Promise<void>>,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]): Promise<void> {
      const req = args[0] as Request;
      const res = args[1] as Response;
      const next = args[2] as NextFunction;

      const token = req.header("Authorization")?.split(" ")[1];
      if (!token) {
        res.sendStatus(403);
      }

      try {
        const user = jwt.verify(token as string, SECRET_KEY);
        (req as any).user = user;
        if (typeof originalMethod === "function") {
          return originalMethod.apply(this, args);
        } else {
          throw new Error("originalMethod is not a function");
        }
      } catch (err) {
        res.sendStatus(403);
      }
    };

    return descriptor;
  };
}
