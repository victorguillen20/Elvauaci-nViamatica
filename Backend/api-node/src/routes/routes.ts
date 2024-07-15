import { Router } from 'express';
import { getAllUsers, getUsers, insertUsers, Login, logOut, updateUsers } from '../controllers/controllers.users';

const router = Router();

router.get('/users/profile', getUsers);
router.get('/users', getAllUsers);
router.post('/users/login', Login);
router.post('/users/logout', logOut);
router.post('/users/registrar', insertUsers);
router.post('/users/actualizar', updateUsers);
router.delete('/users/delete');

export default router;