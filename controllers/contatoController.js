import pool from "../config/database.js";

// CREATE - Criar novo contato
export async function criarContato(req, res) {
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
    // Validações básicas
    if (!nome || !cpf || !email) {
      return res
        .status(400)
        .json({ error: "Nome, CPF e Email são obrigatórios" });
    }

    const query = `
      INSERT INTO contatos 
      (nome, cpf, nascimento, rg, sexo, estadoCivil, pais, estado, cidade,
       bairro, cep, logradouro, numero, complemento, celular, fixo, email, linkedin, created_at)
      VALUES 
      ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, NOW())
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
    ];

    const result = await pool.query(query, values);
    res
      .status(201)
      .json({ message: "Contato criado com sucesso", contato: result.rows[0] });
  } catch (error) {
    console.error("Erro ao criar contato:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "CPF ou Email já existe" });
    } else {
      res.status(500).json({ error: "Erro ao criar contato" });
    }
  }
}

// READ - Listar todos os contatos
export async function listarContatos(req, res) {
  try {
    const { page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM contatos 
      ORDER BY created_at DESC
      LIMIT $1 OFFSET $2
    `;

    const countQuery = "SELECT COUNT(*) FROM contatos";

    const [result, countResult] = await Promise.all([
      pool.query(query, [limit, offset]),
      pool.query(countQuery),
    ]);

    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.json({
      contatos: result.rows,
      paginacao: {
        total,
        pagina: parseInt(page),
        limite: parseInt(limit),
        totalPages,
      },
    });
  } catch (error) {
    console.error("Erro ao listar contatos:", error);
    res.status(500).json({ error: "Erro ao listar contatos" });
  }
}

// READ - Obter contato por ID
export async function obterContatoPorId(req, res) {
  const { id } = req.params;

  try {
    const query = "SELECT * FROM contatos WHERE id = $1";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao obter contato:", error);
    res.status(500).json({ error: "Erro ao obter contato" });
  }
}

// UPDATE - Atualizar contato
export async function atualizarContato(req, res) {
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
      UPDATE contatos 
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
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    res.json({
      message: "Contato atualizado com sucesso",
      contato: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    if (error.code === "23505") {
      res
        .status(409)
        .json({ error: "CPF ou Email já existe para outro contato" });
    } else {
      res.status(500).json({ error: "Erro ao atualizar contato" });
    }
  }
}

// DELETE - Deletar contato
export async function deletarContato(req, res) {
  const { id } = req.params;

  try {
    const query = "DELETE FROM contatos WHERE id = $1 RETURNING id";
    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    res.json({
      message: "Contato deletado com sucesso",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Erro ao deletar contato:", error);
    res.status(500).json({ error: "Erro ao deletar contato" });
  }
}

// SEARCH - Buscar por CPF
export async function buscarPorCPF(req, res) {
  const { cpf } = req.params;

  try {
    const query = "SELECT * FROM contatos WHERE cpf = $1";
    const result = await pool.query(query, [cpf]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar contato:", error);
    res.status(500).json({ error: "Erro ao buscar contato" });
  }
}

// SEARCH - Buscar por Email
export async function buscarPorEmail(req, res) {
  const { email } = req.params;

  try {
    const query = "SELECT * FROM contatos WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Erro ao buscar contato:", error);
    res.status(500).json({ error: "Erro ao buscar contato" });
  }
}
