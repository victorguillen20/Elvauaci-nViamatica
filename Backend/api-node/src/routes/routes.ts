import { Router } from 'express';


const router = Router();

router.get('/users/profile');
router.get('/users');
router.post('/users/login');
router.post('/users/registrar');
router.delete('/users/delete');

export default router;