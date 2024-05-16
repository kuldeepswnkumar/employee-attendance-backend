import express from 'express'
import {
    RegisterUser, LoginUser, LogoutUsers, EmployeeAdd, EmpDataDisplay, ChangePassword, AdminDisplay,
    UpdateEmployee, DeleteEmployee, SingelEmpDataDisplay, ClockData, AttenedEmployee, Attendance, UpdateAttendance,
    AddCompany, ViewCompany, DeleteCompany, AddSchedule, GetScheduleData, updateScheduleData, DeleteScheduleData, AddLeave,
    GetLeaveData, DeleteLeave, AddDepartment, GetDepartmentData, DeleteDepartment, EmployeeLogin, LogoutEmployee, ReportAdd,
    getAllReportData
} from '../controllers/users.controllers.js';

import { verifyToken, verifyEmployeeToken } from '../middlewares/auth.middleware.js';
import { upload } from '../middlewares/multer.middleware.js';


const router = express.Router();

router.route('/register').post(RegisterUser)

router.route('/login').post(LoginUser)

router.route('/logout').get(verifyToken, LogoutUsers)

router.route('/empadd').post(
    upload.single('fileData'),
    EmployeeAdd
)

router.route('/viewdata').get(verifyToken, EmpDataDisplay)


router.route('/singleviewdata/:id').get(SingelEmpDataDisplay)

router.route('/viewadmin').get(AdminDisplay)

router.route('/changepass').post(verifyToken, ChangePassword)

router.route('/updateemployee/:id').get(UpdateEmployee)

router.route('/updateemployee/:id').put(UpdateEmployee)

router.route('/deleteemployee/:id').delete(DeleteEmployee)

router.route('/attendance').post(ClockData)

router.route('/attenedempview').get(AttenedEmployee)

router.route('/deleteempattend/:id').delete(Attendance)

router.route('/updateattendance').put(UpdateAttendance)

router.route('/addcompany').post(AddCompany)

router.route('/viewcompany').get(ViewCompany)

router.route('/deletecompany/:id').delete(DeleteCompany)

router.route('/addschedule').post(AddSchedule)

router.route('/getscheduledata').get(GetScheduleData)

router.route('/updatescheduledata/:id').get(updateScheduleData)

router.route('/updatescheduledata/:id').put(updateScheduleData)

router.route('/deletescheduledata/:id').delete(DeleteScheduleData)

router.route('/addleave').post(AddLeave)

router.route('/getleavedata').get(GetLeaveData)

router.route('/deleteleave/:id').delete(DeleteLeave)

router.route('/adddepartment').post(AddDepartment)

router.route('/getdepartmentdata').get(GetDepartmentData)

router.route('/deletedepartment/:id').delete(DeleteDepartment)

//Empolyee Dashboard

router.route('/employeelogin').post(EmployeeLogin)

router.route('/logoutemployee').get(verifyEmployeeToken, LogoutEmployee)

router.route('/reportadd').post(ReportAdd)

router.route('/getreportdata').get(getAllReportData)



export default router