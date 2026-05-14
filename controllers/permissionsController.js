import pool from "../config/database.js";

// Create - Criar permissão
export async function createRolesXPermissions(req, res) {
  const { relations } = req.body;
  // const relations = [{role_id, permission_id}];

  try {
    // Basic validations

    const valuesString = relations
      .map(({ role_id, permission_id }) => `('${role_id}', '${permission_id}')`)
      .join(",");

    const query = `
      INSERT INTO roles_permissions
        (
          role_id,
          permission_id
        )
      VALUES
        ${valuesString}
      RETURNING *
      `;

    console.log("teste", query);
    const result = await pool.query(query);

    res.status(201).json({
      message: "Permissão criada com sucesso",
      permission: result.rows[0],
    });
  } catch (error) {
    console.error("Error ao criar Permissão:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "Permissão já existe!" });
    } else {
      res.status(500).json({ error: "Erro ao criar Permissão." });
    }
  }
}

// READ - Listar por id's
export async function GetRoleXPermissionById(req, res) {
  const { role_id } = req.params;

  try {
    let { page = 1, limit = 10 } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);

    const offset = (page - 1) * limit;

    const query = `
      SELECT * FROM roles_permissions WHERE role_id = $1
    `;

    const result = await pool.query(query, [role_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Permissão não encontrada" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar permissão:", error);
    res.status(500).json({ error: "Erro ao buscar permissão" });
  }
}

// função para deletar por id's.
export async function deleteRolePermissionById(req, res) {
  const { role_id, permission_id } = req.params;

  try {
    const query = `
      DELETE FROM roles_permissions
      WHERE role_id = $1 AND permission_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [role_id, permission_id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: "Permissão não encontrado",
      });
    }

    res.json({
      message: "permissão deletada com sucesso!",
      deleted: result.rows[0],
    });
  } catch (error) {
    console.error("Erro ao deletar Permissão:", error);
    res.status(500).json({
      error: "Erro ao deletar Permissão",
    });
  }
}

export async function GetAllPermission(req, res) {
  try {
    const query = `
      SELECT * FROM permissions
    `;

    const result = await pool.query(query);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Permissões não encontrada!" });
    }

    res.json(result.rows);
  } catch (error) {
    console.error("Erro ao buscar permissões:", error);
    res.status(500).json({ error: "Erro ao buscar permissões" });
  }
}
