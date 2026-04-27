import pool from "../config/database.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

export async function login(req, res) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const { email, password } = req.body;

    console.log(jwtSecret);

    // pegar a senha que foi recebida e comparar com a senha do banco de dados
    const {
      rows: [{ password_hash }],
    } = await pool.query("SELECT password_hash FROM users WHERE email = $1", [
      email,
    ]);

    const isPasswordValid = await bcrypt.compare(password, password_hash);

    const token = jwt.sign({ email }, jwtSecret, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    return isPasswordValid
      ? res.status(200).json({ message: "senha válida", token })
      : res.status(401).json({ message: "senha inválida" });
  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
}
