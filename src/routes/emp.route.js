import express from 'express'
import { RegisterUser } from '../controllers/users.controllers.js';

const router = express.Router();

router.route('/register').post(RegisterUser)

export default router