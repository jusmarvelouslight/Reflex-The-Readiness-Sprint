import bcrypt from "bcryptjs";
import { prisma } from "../config/database.js";
import { generateToken } from "../utils/jwt.js";

interface RegisterInput {
  name: string;
  email: string;
  phone?: string;
  password: string;
  role: "RETAILER" | "DISPATCHER" | "RIDER";
}

interface LoginInput {
  email: string;
  password: string;
}

export async function registerUser(input: RegisterInput) {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: input.email
    }
  });

  if (existingUser) {
    throw new Error("EMAIL_ALREADY_EXISTS");
  }

  const passwordHash = await bcrypt.hash(input.password, 12);

  const user = await prisma.user.create({
    data: {
      name: input.name,
      email: input.email,
      phone: input.phone,
      passwordHash,
      role: input.role
    }
  });

  const token = generateToken({
    userId: user.id,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: {
      email: input.email
    }
  });

  if (!user) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash
  );

  if (!passwordMatches) {
    throw new Error("INVALID_CREDENTIALS");
  }

  const token = generateToken({
    userId: user.id,
    role: user.role
  });

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role
    },
    token
  };
}