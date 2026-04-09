import express from 'express'
import ReferenceDataCltr from '../controllers/referenceDataCtrl.js'

const router = express.Router();

const base = '/reference-data'

router
    .get(base + '/ufs', ReferenceDataCltr.buscarUfs)

export default router;