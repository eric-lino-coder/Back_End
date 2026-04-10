import express from 'express';
import * as contatoController from '../controllers/contatoController.js';

const router = express.Router();

// CRUD Routes
router.post('/', contatoController.criarContato);           // CREATE
router.get('/', contatoController.listarContatos);          // READ ALL
router.get('/:id', contatoController.obterContatoPorId);    // READ BY ID
router.put('/:id', contatoController.atualizarContato);     // UPDATE
router.delete('/:id', contatoController.deletarContato);    // DELETE

// Endpoints adicionais
router.get('/search/cpf/:cpf', contatoController.buscarPorCPF);
router.get('/search/email/:email', contatoController.buscarPorEmail);

export default router;
