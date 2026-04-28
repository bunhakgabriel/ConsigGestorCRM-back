import express from 'express'
import ClienteCtrl from '../controllers/clienteCtrl.js';
import multer from 'multer'

const upload = multer()
const router = express.Router();

const base = '/cliente'

router
    .post(base + '/buscar', ClienteCtrl.buscarClientes)
    .get(base + '/buscar/:id', ClienteCtrl.buscarClientePorId)
    .post(base + '/salvar', ClienteCtrl.salvarCliente)
    .delete(base + '/deletar/:id', ClienteCtrl.deletarCliente)
    .post(base + '/salvardocumentos/:id', upload.array('documentos'), ClienteCtrl.uploadDocumentos)

export default router;