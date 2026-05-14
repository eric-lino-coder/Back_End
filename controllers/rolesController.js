import pool from "../config/database.js";
import * as bcrypt from "bcrypt";

// CREATE - Create New Role
export async function createRole(req, res) {
  const { name, description, is_active } = req.body;

  try {
    // Validações básicas
    if (!name || !description || !is_active) {
      return res
        .status(400)
        .json({ error: "Nome, Descrição e Status são obrigatórios" });
    }

    const query = `
      INSERT INTO roles 
        (
          name,
          description,
          is_active,
          created_at,
          updated_at
        )
      VALUES 
        (
          $1,
          $2,
          $3,
          NOW(),
          NOW()
        )
      RETURNING *
    `;

    const values = [
      name, // $1
      description, // $2
      is_active, // $3
    ];

    const result = await pool.query(query, values);
    res
      .status(201)
      .json({ message: "Perfil criado com sucesso", role: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar perfil:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "Perfil já existe" });
    } else {
      res.status(500).json({ error: "Erro ao criar pefil" });
    }
  }
}

// READ - Listar todos os users
export async function listRoles(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM roles
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = "SELECT COUNT(*) FROM roles";

    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery),
    ]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      roles: result.rows,
      paginacao: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao listar perfis:", error);
    res.status(500).json({ error: "Erro ao listar perfis" });
  }
}

// READ - Obter role por ID
export async function obterRolePorId(req, res) {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM roles WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter perfil:", error);
    res.status(500).json({ error: "Erro ao obter perfil" });
  }
}

// UPDATE - Atualizar Role
export async function updateRole(req, res) {
  const { id } = req.params;
  const { name, description, is_active } = req.body;

  try {
    const query = `
      UPDATE roles 
      SET 
        name= $1, 
        description = $2, 
        is_active= $3,
        updated_at = NOW()
      WHERE 
        id = $4
      RETURNING 
        *
    `;

    const values = [name, description, is_active, id];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Perfil não encontrado" });
    }

    res.json({
      message: "Perfil atualizado com sucesso",
      role: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar Perfil:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "Perfil já existe" });
    } else {
      res.status(500).json({ error: "Erro ao atualizar Perfil" });
    }
  }
}
