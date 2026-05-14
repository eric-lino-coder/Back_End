import express from "express";
import {
  createRole,
  listRoles,
  getRoleById, // Nome sugerido
  updateRole,
} from "../controllers/rolesController.js";

const rolesRouter = express.Router();

// --- Rotas de Perfis (Roles) ---

// Criar um novo perfil
rolesRouter.post("/", createRole);

// Listar todos os perfis com paginação
rolesRouter.get("/", listRoles);

// Obter detalhes de um perfil específico
rolesRouter.get("/:id", getRoleById);

// Atualizar todos os dados de um perfil
rolesRouter.put("/:id", updateRole);

export default rolesRouter;
