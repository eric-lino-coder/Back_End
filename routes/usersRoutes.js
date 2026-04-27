import express from "express";
import * as usersController from "../controllers/usersController.js";

const router = express.Router();

// CRUD Routes
router.post("/", usersController.criaruser); // CREATE
router.get("/", usersController.listarusers); // READ ALL
router.get("/:id", usersController.obteruserPorId); // READ BY ID
router.put("/:id", usersController.atualizaruser); // UPDATE
router.delete("/:id", usersController.deletaruser); // DELETE

// Endpoints adicionais
router.get("/search/cpf/:cpf", usersController.buscarPorCPF);
router.get("/search/email/:email", usersController.buscarPorEmail);

export default router;
