//src/routers/auth.routers.ts

import {Router} from 'express';
import {login, updateTime, getTime, getAllUsers, createUser} from '../controllers/auth.controller';


const router = Router();

router.post('/login-user', login); //routa del endpoint
router.get('/getTime/:userId', getTime)
router.patch('/updateTime', updateTime)
router.get('/users', getAllUsers)
router.post('/user', createUser)

export default router;