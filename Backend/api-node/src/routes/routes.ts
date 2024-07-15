import { Router } from 'express';
import { getAllUsers, getUsers, insertUsers, Login } from '../controllers/controllers.users';

const router = Router();

router.get('/users/profile', getUsers);
router.get('/users', getAllUsers);
router.post('/users/login', Login);
router.post('/users/registrar', insertUsers);
router.delete('/users/delete');

export default router;