
import express from 'express';
import { createRole, updateRole, detailsRole, listRole, deleteRole } from '../controllers/role.controller.js';

const router = express.Router();

router.post('/', createRole);

router.put('/:id', updateRole);

router.get('/', listRole);

router.get('/:id', detailsRole);

router.delete('/delete/:id', deleteRole);

export default router;