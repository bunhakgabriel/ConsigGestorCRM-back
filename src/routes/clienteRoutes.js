import express from 'express'
import ClienteCtrl from '../controllers/clienteCtrl.js';

const router = express.Router();

const base = '/cliente'

router
    .post(base + '/cadastrar', ClienteCtrl.cadastrarCliente)

export default router;