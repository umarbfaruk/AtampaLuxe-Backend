import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const router = express.Router();

/* =========================
   REGISTER
========================= */

router.post("/register", async (req, res) => {
  try {
    console.log("REGISTER BODY:", req.body);

    const {
      email,
      password,
      phone,
      firstName,
      lastName,
    } = req.body;

    /* =========================
       VALIDATION
    ========================= */

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    /* =========================
       CHECK EXISTING USER
    ========================= */

    const existingUser =
      await prisma.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    /* =========================
       HASH PASSWORD
    ========================= */

    const hashedPassword =
      await bcrypt.hash(password, 10);

    /* =========================
       CREATE USER
    ========================= */

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        phone: phone || null,
        firstName: firstName || null,
        lastName: lastName || null,
        role: "CUSTOMER",
      },
    });

    /* =========================
       RESPONSE
    ========================= */

    return res.status(201).json({
      message: "User registered successfully",

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
});

/* =========================
   LOGIN
========================= */

router.post("/login", async (req, res) => {
  try {
    console.log("LOGIN BODY:", req.body);

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    /* =========================
       FIND USER
    ========================= */

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // =========================
    // DEBUG LOGS (TEMPORARY)
    // =========================
    console.log("USER FOUND:", user);

    if (!user) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    /* =========================
       CHECK PASSWORD
    ========================= */

    const isValid = await bcrypt.compare(
      password,
      user.password
    );

    // =========================
    // DEBUG LOGS (TEMPORARY)
    // =========================
    console.log("PASSWORD FROM REQUEST:", password);
    console.log("HASH FROM DB:", user.password);
    console.log("COMPARE RESULT:", isValid);

    if (!isValid) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    /* =========================
       GENERATE TOKEN
    ========================= */

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET || "supersecret",
      {
        expiresIn: "1d",
      }
    );

    /* =========================
       RESPONSE
    ========================= */

    return res.json({
      message: "Login successful",

      token,

      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        phone: user.phone,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(500).json({
      error: err.message || "Server error",
    });
  }
});

export default router;