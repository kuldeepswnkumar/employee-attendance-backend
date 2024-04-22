import express from 'express'
import { RegisterUser, LoginUser, LogoutUsers, EmployeeAdd, EmpDataDisplay, ChangePassword, AdminDisplay, UpdateEmployee, DeleteEmployee, SingelEmpDataDisplay } from '../controllers/users.controllers.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';


const router = express.Router();

router.route('/register').post(RegisterUser)

router.route('/login').post(LoginUser)

router.route('/logout').post(verifyToken, LogoutUsers)

router.route('/empadd').post(
    upload.single('fileData'),
    EmployeeAdd
)

router.route('/viewdata').get(EmpDataDisplay)


router.route('/singleviewdata/:id').get(SingelEmpDataDisplay)

router.route('/viewadmin').get(AdminDisplay)

router.route('/changepass').post(verifyToken, ChangePassword)

router.route('/updateemployee/:id').get(UpdateEmployee)

router.route('/updateemployee/:id').put(UpdateEmployee)

router.route('/deleteemployee/:id').delete(DeleteEmployee)

export default router