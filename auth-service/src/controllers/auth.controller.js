import "dotenv/config";

import {
  registerUser,
  loginUser,
} from "../services/auth.service.js";

import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/token.js";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/*
====================================
REGISTER
====================================
*/

export const register = async (req, res) => {
  try {
    const { username, email, password, phone } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        error: "All fields required",
      });
    }

    const user = await registerUser(
      username,
      email,
      password,
      phone
    );

    return res.status(201).json(user);
  } catch (err) {
    console.error("REGISTER ERROR:", err);

    return res.status(400).json({
      error: err.message,
    });
  }
};

/*
====================================
LOGIN
====================================
*/

export const login = async (req, res) => {
  try {
    const user = await loginUser(
      req.body.email,
      req.body.password
    );

    // =========================
    // SAFE TOKEN GENERATION (FIXED FLOW)
    // =========================

    const accessToken = generateAccessToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Save refresh token
    await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken },
    });

    return res.json({
      accessToken,
      refreshToken,
      user,
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);

    return res.status(400).json({
      error: err.message,
    });
  }
};