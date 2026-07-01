import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/* =========================
   REGISTER USER
========================= */
export const registerUser = async (
  username,
  email,
  password,
  phone,
  firstName,
  lastName
) => {
  // CHECK EXISTING USER
  const existing = await prisma.user.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email already exists");
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(
    password,
    10
  );

  // CREATE USER
  const user = await prisma.user.create({
    data: {
      username: username || null,
      email,
      password: hashedPassword,
      phone: phone || null,
      firstName: firstName || null,
      lastName: lastName || null,
      role: "CUSTOMER",
    },
  });

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    phone: user.phone,
    firstName: user.firstName,
    lastName: user.lastName,
  };
};

/* =========================
   LOGIN USER
========================= */
export const loginUser = async (
  email,
  password
) => {
  // FIND USER
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("Invalid credentials");
  }

  // CHECK PASSWORD
  const isMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!isMatch) {
    throw new Error("Invalid credentials");
  }

  // GENERATE TOKEN
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      phone: user.phone,
    },
    process.env.JWT_SECRET || "supersecret",
    {
      expiresIn: "1d",
    }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  };
};