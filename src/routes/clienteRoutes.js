import express from 'express'
import ClienteCtrl from '../controllers/clienteCtrl.js';

const router = express.Router();

const base = '/cliente'

router
    .get(base + '/buscar', ClienteCtrl.buscarClientes)
    .get(base + '/buscar/:id', ClienteCtrl.buscarClientePorId)
    .post(base + '/cadastrar', ClienteCtrl.cadastrarCliente)
    .delete(base + '/deletar/:id', ClienteCtrl.deletarCliente)

export default router;