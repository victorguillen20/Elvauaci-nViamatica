import { Router } from 'express';
import { getAllUsers, getUsers, insertUsers, Login, logOut, updateUsers } from '../services/services.users';

const router = Router();

router.get('/users/profile', getUsers);
router.get('/users', getAllUsers);
router.post('/users/login', Login);
router.post('/users/logout', logOut);
router.post('/users/registrar', insertUsers);
router.post('/users/actualizar', updateUsers);


export default router;