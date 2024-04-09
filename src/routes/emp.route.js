import express from 'express'
import { RegisterUser, LoginUser } from '../controllers/users.controllers.js';

const router = express.Router();

router.route('/register').post(RegisterUser)

router.route('/login').post(LoginUser)

export default router