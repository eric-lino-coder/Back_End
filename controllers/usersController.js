import pool from "../config/database.js";
import * as bcrypt from "bcrypt";

// CREATE - Criar novo user
export async function criaruser(req, res) {
  const {
    nome,
    cpf,
    nascimento,
    rg,
    sexo,
    estadoCivil,
    pais,
    estado,
    cidade,
    bairro,
    cep,
    logradouro,
    numero,
    complemento,
    celular,
    fixo,
    email,
    linkedin,
  } = req.body;

  try {
    const raw_password = process.env.DEFAULT_PASSWORD || "Easycad@1234";
    // Validações básicas
    if (!nome || !cpf || !email) {
      return res
        .status(400)
        .json({ error: "Nome, CPF e Email são obrigatórios" });
    }
    // Gerar Hash da senha, transformar a variavel raw_password em password
    //  custo do hash (quanto maior, mais seguro e mais lento)
    const saltRounds = 10;
    //  senha de exemplo
    //  1. Gerando SALT manualmente
    const salt = await bcrypt.genSalt(saltRounds);
    //  2. Criando HASH da senha
    const password_hash = await bcrypt.hash(raw_password, salt);
    const query = `
      INSERT INTO users 
        (
          nome, 
          cpf,
          nascimento,
          rg,
          sexo,
          estadoCivil,
          pais,
          estado,
          cidade,   
          bairro,
          cep,
          logradouro,
          numero,
          complemento,
          celular,
          fixo,
          email,
          linkedin,
          password_hash,
          created_at
        )
      VALUES 
      (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6,
        $7,
        $8,
        $9,
        $10,
        $11,
        $12,
        $13,
        $14,
        $15,
        $16,
        $17,
        $18,
        $19,
        NOW()
      )
      RETURNING *
    `;

    const values = [
      nome,
      cpf,
      nascimento,
      rg,
      sexo,
      estadoCivil,
      pais,
      estado,
      cidade,
      bairro,
      cep,
      logradouro,
      numero,
      complemento,
      celular,
      fixo,
      email,
      linkedin,
      password_hash,
    ];

    const result = await pool.query(query, values);
    res
      .status(201)
      .json({ message: "user criado com sucesso", user: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar user:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "CPF ou Email já existe" });
    } else {
      res.status(500).json({ error: "Erro ao criar user" });
    }
  }
}

// READ - Listar todos os users
export async function listarusers(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM users 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = "SELECT COUNT(*) FROM users";

    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery),
    ]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    console.log("dados do back end", result.rows);
    res.json({
      users: result.rows,
      paginacao: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao listar users:", error);
    res.status(500).json({ error: "Erro ao listar users" });
  }
}

// READ - Obter user por ID
export async function obteruserPorId(req, res) {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter user:", error);
    res.status(500).json({ error: "Erro ao obter user" });
  }
}

// UPDATE - Atualizar user
export async function atualizaruser(req, res) {
  const { id } = req.params;
  const {
    nome,
    cpf,
    nascimento,
    rg,
    sexo,
    estadoCivil,
    pais,
    estado,
    cidade,
    bairro,
    cep,
    logradouro,
    numero,
    complemento,
    celular,
    fixo,
    email,
    linkedin,
  } = req.body;

  try {
    const query = `
      UPDATE users 
      SET nome = $1, cpf = $2, nascimento = $3, rg = $4, sexo = $5, 
          estadoCivil = $6, pais = $7, estado = $8, cidade = $9,
          bairro = $10, cep = $11, logradouro = $12, numero = $13, 
          complemento = $14, celular = $15, fixo = $16, email = $17, 
          linkedin = $18, updated_at = NOW()
      WHERE id = $19
      RETURNING *
    `;

    const values = [
      nome,
      cpf,
      nascimento,
      rg,
      sexo,
      estadoCivil,
      pais,
      estado,
      cidade,
      bairro,
      cep,
      logradouro,
      numero,
      complemento,
      celular,
      fixo,
      email,
      linkedin,
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user não encontrado" });
    }

    res.json({
      message: "user atualizado com sucesso",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar user:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "CPF ou Email já existe para outro user" });
    } else {
      res.status(500).json({ error: "Erro ao atualizar user" });
    }
  }
}

// DELETE - Deletar user
export async function deletaruser(req, res) {
  const { id } = req.params;

  try {
    const query = "DELETE FROM users WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user não encontrado" });
    }

    res.json({
      message: "user deletado com sucesso",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Erro ao deletar user:", error);
    res.status(500).json({ error: "Erro ao deletar user" });
  }
}

// SEARCH - Buscar por CPF
export async function buscarPorCPF(req, res) {
  const { cpf } = req.params;

  try {
    const query = "SELECT * FROM users WHERE cpf = $1";
    const result = await pool.query(query, [cpf]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar user:", error);
    res.status(500).json({ error: "Erro ao buscar user" });
  }
}

// SEARCH - Buscar por Email
export async function buscarPorEmail(req, res) {
  const { email } = req.params;

  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "user não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar user:", error);
    res.status(500).json({ error: "Erro ao buscar user" });
  }
}
