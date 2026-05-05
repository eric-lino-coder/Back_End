import pool from "../config/database.js";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const jwtSecret = process.env.JWT_SECRET;
    const { email, password } = req.body;

    const result = await pool.query(
      "SELECT id, password_hash FROM users WHERE email = $1",
      [email],
    );

    // 🔥 valida se usuário existe
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Usuário não encontrado" });
    }

    const { password_hash, id: userId } = result.rows[0];

    const isPasswordValid = await bcrypt.compare(password, password_hash);

    // 🔥 valida senha
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Senha inválida" });
    }

    // 🔥 gera token só se tudo estiver ok
    const token = jwt.sign({ userId, email }, jwtSecret, {
      expiresIn: "1h",
      algorithm: "HS256",
    });

    // 🍪 salva no cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "None",
      maxAge: 1000 * 60 * 60,
    });

    return res.status(200).json({
      message: "Login realizado com sucesso",
      user: { userId, email },
    });
  } catch (error) {
    console.log("Login error:", error);
    return res.status(500).json({ message: "Login failed" });
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "None",
    });
    return res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    console.log("Logout error:", error);
    return res.status(500).json({ message: "Logout failed" });
  }
}
