import express from 'express'
import { RegisterUser, LoginUser, LogoutUsers } from '../controllers/users.controllers.js';
import { verifyToken } from '../middlewares/auth.middleware.js';


const router = express.Router();

router.route('/register').post(RegisterUser)

router.route('/login').post(LoginUser)

router.route('/logout').post(verifyToken, LogoutUsers)

export default router