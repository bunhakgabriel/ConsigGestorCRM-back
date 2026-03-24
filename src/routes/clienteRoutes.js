import express from 'express'
import ClienteCtrl from '../controllers/clienteCtrl.js';

const router = express.Router();

const base = '/cliente'

router
    .get(base + '/buscar', ClienteCtrl.buscarClientes)
    .post(base + '/cadastrar', ClienteCtrl.cadastrarCliente)

export default router;