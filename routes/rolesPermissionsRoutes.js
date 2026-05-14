import express from "express";
import {
  createRolesXPermissions,
  getRoleXPermissionById, // Nome padronizado
  deleteRolePermissionById,
  getAllPermissions, // Nome padronizado
} from "../controllers/permissionsController.js";

const permissionsRouter = express.Router();

// --- Rotas de Permissões ---

// Criar nova associação entre Cargo e Permissão
permissionsRouter.post("/", createRolesXPermissions);

// Listar TODAS as permissões existentes no sistema
permissionsRouter.get("/", getAllPermissions);

// Listar permissões de um cargo específico
permissionsRouter.get("/:role_id", getRoleXPermissionById);

// Remover uma permissão específica de um cargo
permissionsRouter.delete("/:role_id/:permission_id", deleteRolePermissionById);

export default permissionsRouter;
