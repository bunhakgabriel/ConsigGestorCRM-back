import express from 'express'
import VendedorCtrl from '../controllers/vendedorCtrl.js';

const router = express.Router();

const base = '/vendedor'

router
    .post(base + '/buscar', VendedorCtrl.buscarVendedores)
    .get(base + '/buscar/:id', VendedorCtrl.buscarVendedorPorId)
    .post(base + '/salvar', VendedorCtrl.salvarVendedor)
    .delete(base + '/deletar/:id', VendedorCtrl.deletarVendedor)

export default router;