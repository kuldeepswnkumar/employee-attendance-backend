import { EmpModel } from '../models/emp.models.js'
import { ApiResponce } from '../utils/ApiResponse.js'
import { ApiErrorResponce } from '../utils/ApiErrorRes.js'
import { uploadOnCloudinary } from '../utils/cloudnary.js'
import { EmployeeModels } from '../models/employee.model.js'
import { clockModel } from '../models/clock.models.js'
import { get_time_diff } from '../CalculateTime.js'
import { companyModel } from '../models/company.models.js'
import { scheduleModel } from '../models/schedule.model.js'
import { leaveModel } from '../models/leave.models.js'
import { departmentModel } from '../models/department.models.js'
import { reportModel } from '../models/report.models.js'


const generateAccessandrefreshToken = async (userId) => {
    try {
        const users = await EmpModel.findById(userId)
        const accessToken = await users.generateAccessToken()
        const refreshToken = await users.generateRefreshToken()

        users.accessToken = accessToken
        users.refreshToken = refreshToken
        // console.log("users : ", users);

        //refreshToken save in data base
        await users.save({ validateBeforeSave: false })
        // console.log("resps : ", resps);
        return { accessToken, refreshToken }

    } catch (error) {
        console.log('error', error)
        return res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong while generating refresh and access token!!")
        )
    }
}

const generatefreshTokenAccessToken = async (empid) => {
    try {
        const users = await EmployeeModels.findById(empid)
        const accessToken = await users.generateAccessTokenEmp()
        const refreshToken = await users.generateRefreshTokenEmp()

        users.accessToken = accessToken
        users.refreshToken = refreshToken
        // console.log("users : ", users);

        //refreshToken save in data base
        const resps = await users.save({ validateBeforeSave: false })
        // console.log("resps : ", resps);
        return { accessToken, refreshToken }

    } catch (error) {
        console.log('error', error)
        return res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong while generating refresh and access token!!")
        )
    }
}

const RegisterUser = (async (req, res) => {
    try {
        const { empId, empName, email, mobile, accType, empRole, status, password, cfmpassword } = req.body

        if (!(empId) || !(empName) || !(email) || !(mobile) || !(accType) || !(empRole) || !(password) || !(cfmpassword)) {
            return res.status(400).json(
                new ApiErrorResponce(404, "All fields are required!")
            )
        }

        const existsUser = EmpModel.findOne({
            $or: [{ empId }, { email }]
        })
        // console.log('existsUser', existsUser);

        if (!existsUser) {
            return res.status(400).json(
                new ApiErrorResponce(402, "User with id and email are already existed!")
            )
        }

        const empobj = {
            empId,
            empName,
            email,
            mobile,
            accType,
            empRole,
            status,
            password,
            cfmpassword,

        };
        // console.log('empobj', empobj);

        const user = await EmpModel.create(empobj)
        // console.log('user', user);
        const createdUser = await EmpModel.findOne(user._id).select(
            "-password -cfmpassword -refreshToken"
        )

        if (!createdUser) {
            return res.status(400).json(
                new ApiErrorResponce(404, "Somethings went worng while register user!")
            )
        }


        return res.status(201).json(
            new ApiResponce(200, createdUser, "You are registered!")
        )
    } catch (err) {
        console.log("err", err)
        return res.status(400).json(
            new ApiErrorResponce(400, [], "Oops! Something went wrong")
        )
    }
})

const LoginUser = (async (req, res) => {
    try {
        const { empName, email, password } = req.body

        if (!(email) || !(password)) {
            return res.status(404).json(
                new ApiErrorResponce(404, "Email Id and Password is required!")
            )
        }

        const user = await EmpModel.findOne({
            $or: [{ email }, { empName }]
        })

        //If user does not existed in database
        if (!user) {
            return res.status(404).json(
                new ApiErrorResponce(400, "User does not existed!")
            )
        }

        //Verify frontend password and backend password 
        const validPassword = await user.isPasswordCorrect(password)

        console.log(validPassword);
        if (!validPassword) {
            return res.status(404).json(
                new ApiErrorResponce(400, "Invalid Credential")
            )
        }


        const { accessToken, refreshToken } = await generateAccessandrefreshToken(user._id)

        const loggedInUser = await EmpModel.findById(user._id).select("-password -cfmpassword -refreshToken")



        //It is manageble by server not frontend
        const options = {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        }


        let resp = {
            user: loggedInUser, accessToken, refreshToken
        }
        // console.log("resp", resp);
        return res.status(200).json(
            new ApiResponce(200,
                resp,
                "User Logged In!"),
        )


    } catch (error) {
        return res.status(404).json(
            new ApiErrorResponce(404, "Oops! Somethings went wrong!")
        ),
            console.log(error);
    }
})

const LogoutUsers = (async (req, res) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json(
                new ApiErrorResponce(401, "Unauthorized request!")
            )
        }

        // console.log(userUpdate);
        // const options = {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None'
        // }

        return res.status(200)
            .json(
                new ApiResponce(200, "User Logout!")
            )

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong while generating refresh and access token!!")
        )
    }
})

//Employee Add
const EmployeeAdd = async (req, res) => {
    try {
        const { empid, fname, lname, gender, cstatus, email, age, dob, proof, fileData, pob, address, company, department, jobtitle, cpemail, lvgroup, empType, empStatus, JoinDate, password } = req.body;

        if (!(empid) || !(fname) || !(lname) || !(gender) || !(cstatus) || !(email) || !(age) || !(dob) || !(proof) || !(pob) || !(address) || !(company) || !(department) || !(jobtitle) || !(cpemail) || !(lvgroup) || !(empType) || !(empStatus) || !(JoinDate) || !(password)) {
            res.status(404).json(
                new ApiErrorResponce(404, "All fields required!!")
            )
        }

        const profileImgLocalPath = req.file.path;

        console.log(profileImgLocalPath);

        if (!profileImgLocalPath) {
            return res.status(400).json(
                new ApiErrorResponce(400, "Profile Image is required!")
            )
        }

        //It will take time to upload
        const profileImage = await uploadOnCloudinary(profileImgLocalPath)

        console.log(profileImage);

        if (!profileImage) {
            return res.status(400).json(
                new ApiErrorResponce(400, "Profile Image did not upload successfully!")
            )
        }

        const existedEmployee = await EmployeeModels.findOne({
            $or: [{ empid }]
        })

        console.log('existedEmployee', existedEmployee);
        if (existedEmployee) {
            return res.status(404).json(
                new ApiErrorResponce('404', 'Employee already existed!')
            )
        }

        const user = await EmployeeModels.create({
            empid,
            fname,
            lname,
            gender,
            cstatus,
            email: email.toLowerCase(),
            age,
            dob,
            proof,
            fileData: profileImage.url || "",
            pob,
            address,
            company,
            department,
            jobtitle,
            cpemail: cpemail.toLowerCase(),
            lvgroup,
            empType,
            empStatus,
            JoinDate,
            password,
        })



        const employeeAdd = await EmployeeModels.findById(user._id).select(
            "-password"
        )

        if (!employeeAdd) {
            return res.status(500).json(
                new ApiErrorResponce(500, "Something went wrong while employee adding!!")
            )
        }

        return res.status(200).json(
            new ApiResponce(201, "Employee Add Successfully!")
        )
    } catch (error) {
        console.log(error);
        return res.status(404).json(
            new ApiErrorResponce(404, "Oops! Somethings went wrong!")
        )
    }
}


//Emp get data
const EmpDataDisplay = async (req, res) => {

    try {
        // let page = Number(req.query.page) || 1
        // let limit = Number(req.query.limit) || 3
        // .skip((page - 1) * limit).limit(limit);

        let data = await EmployeeModels.find()
        if (!data) {
            return res.status(404).json(
                new ApiErrorResponce(404, "Result Not found!!")
            )
        }


        return res.status(200).json(
            new ApiResponce(200, data, "All data get!!")
        )
    } catch (error) {
        console.log(error);
    }
}


const SingelEmpDataDisplay = async (req, res) => {

    try {
        const data = await EmployeeModels.find({ _id: req.params.id });

        console.log(data);
        if (!data) {
            return res.status(404).json(
                new ApiErrorResponce(404, "Result Not found!!")
            )
        }
        return res.status(200).json(
            new ApiResponce(200, data, "We get data!!")
        )
    } catch (error) {
        console.log(error);
    }
}
//admin get data
const AdminDisplay = async (req, res) => {

    const data = await EmpModel.find().select(
        "-_id"
    );
    if (!data) {
        return res.status(404).json(
            new ApiErrorResponce(404, "Result Not found!!")
        )
    }
    return res.status(200).json(
        new ApiResponce(200, data, "All data get!!")
    )


}

//change admin pass
const ChangePassword = async (req, res) => {
    try {
        const { oldpass, newpass, cmfpass } = req.body
        console.log(req.body);

        if (!(oldpass) || !(newpass) || !(cmfpass)) {
            return res.status(400).json(
                new ApiErrorResponce(400, "All fields is required!!")
            )
        }


        if (!(newpass === cmfpass)) {
            return res.status(400).json(
                new ApiErrorResponce(400, "New pass and confirm pass are not matched!!")
            )
        }

        //Find user by id

        const user = await EmpModel.findById(req?.user._id);

        const isCorrectPass = await user.isPasswordCorrect(oldpass)

        if (!isCorrectPass) {
            return res.status(400).json(
                new ApiErrorResponce(400, "Invalid Password")
            )
        }

        user.password = newpass
        user.cfmpassword = newpass
        await user.save({ validateBeforeSave: false })

        return res.status(200).json(
            new ApiResponce(201, "Password Changed Successfully!!")
        )
    } catch (error) {
        console.log(error);
        res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong!!")
        )

    }
}


// Update Employee

const UpdateEmployee = async (req, res) => {

    const updateuser = await EmployeeModels.findByIdAndUpdate(
        {
            _id: req.params.id
        },
        {
            $set: req.body
        },
        { new: true }
    )

    return res.status(200).json(
        new ApiResponce(201, updateuser, "User update successfully!!")
    )
}

//Delete Employee
const DeleteEmployee = async (req, res) => {
    try {
        const employee = await EmployeeModels.deleteOne({ _id: req.params.id })

        if (!employee) {
            return res.status(400).json(
                new ApiErrorResponce(400, "Invalid User")
            )
        }
        return res.status(200).json(
            new ApiResponce(200, "User Deleted Successfully!!")
        )
    } catch (error) {
        console.log(error);
    }
}

//Submit Clock Data

const ClockData = async (req, res) => {

    try {
        const { inoutTime, fullDate, TimeIn, TimeOut, empId, totalTime, myStatus } = req.body

        if (!(empId) && !(inoutTime)) {
            return res.status(404).json(
                new ApiErrorResponce(404, "User not found")
            )
        }

        const empIds = Number(empId)
        const user = await EmployeeModels.findOne({ empid: empId })

        if (!user) {
            return res.status(404).json(
                new ApiErrorResponce(404, "User not found")
            )
        }


        // console.log(user.empid);
        const { fname: EmployeeName, empid: empid } = user


        if (!(empid === empIds)) {
            return res.status(404).json(
                new ApiErrorResponce(404, "Invalid User!!")
            )
        }


        const attenUser = await clockModel.create({
            inoutTime,
            EmployeeName,
            TimeIn,
            TimeOut,
            empId,
            fullDate,
            totalTime,
            myStatus
        })

        const attenedEmp = await clockModel.findById(attenUser._id)

        console.log(attenedEmp);
        if (!attenedEmp) {
            return res.status(404).json(
                new ApiErrorResponce(404, "User not found!!")
            )
        }

        return res.status(200).json(
            new ApiResponce(200, attenedEmp, "Your Attendance Marked Successfully!")
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json(new ApiErrorResponce(500, "Internal Server Error"));
    }
}


//Get Attendance data

const AttenedEmployee = async (req, res) => {


    const users = await clockModel.find()


    if (!users) {
        return res.status(404).json(
            new ApiErrorResponce(404, "User not found!!")
        )
    }

    return res.status(200).json(
        new ApiResponce(200, users, "All data get!!")
    )
}

//Delete Attendance

const Attendance = async (req, res) => {
    const deleteAttendance = await clockModel.deleteOne({ _id: req.params.id })
    // console.log(deleteAttendance);
    return res.status(200).json(
        new ApiResponce(200, "Data deleted successfully!!")
    )
}

//Update Attendance
const UpdateAttendance = async (req, res) => {
    try {
        const time = new Date().toLocaleTimeString('en-US');
        console.log("CR", time);
        const d = new Date();
        const monthDay = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
        let month = monthDay[d.getMonth()];
        let currentYear = d.getFullYear();
        let currDate = d.getDate();

        const Dates = `${currDate + " " + month + " " + currentYear}`
        console.log(typeof "DD", Dates);

        const { empIds } = req.body
        const myIds = Number(empIds)
        // console.log(empIds);

        const users = await clockModel.findOne({ empId: myIds })

        const { empId, inoutTime, TimeIn, TimeOut } = users;

        console.log('inoutTime', inoutTime);
        console.log('empId', empId);
        // const existedTime = await clockModel.findOne({
        //     $or: [{ empId }, { inoutTime }]
        // })
        // if (!(inoutTime === 'checkIN' && myStatus === 'In')) {
        //     return res.status(404).json(
        //         new ApiErrorResponce(404, "You have aleady mark attendance or you not checkIN")
        //     )
        // }

        const OutTime = new Date().toLocaleTimeString('en-US');

        const totalTimes = get_time_diff(TimeIn, OutTime);
        // console.log("totalTime", totalTimes);





        const updatedAttendance = await clockModel.findOneAndUpdate(
            {
                empId: myIds
            },
            {
                $set: {
                    TimeOut: time,
                    inoutTime: "checkOut",
                    myStatus: "Out",
                    totalTime: totalTimes
                }
            },
            {
                new: true
            }
        )

        return res.status(200).json(
            new ApiResponce(200, updatedAttendance, "Your Attendance Marked!!")
        )

    } catch (error) {
        console.log(error);

    }
}

//Add company details

const AddCompany = async (req, res) => {
    try {
        const { compId, compName, foundyear, compWebsite, compLocation } = req.body


        if (!compId || !compName || !foundyear || !compWebsite || !compLocation) {
            return res.status(404).json(
                new ApiErrorResponce(404, "All fields are required!!")
            )
        }

        const existedCompany = await companyModel.findOne({
            $or: [{ compId }]
        })

        // console.log('existedCompany', existedCompany);
        if (existedCompany) {
            return res.status(404).json(
                new ApiErrorResponce('404', 'Company already existed!')
            )
        }


        const Company = await companyModel.create({
            compId,
            compName,
            foundyear,
            compWebsite,
            compLocation
        })

        //here I am check existedCompany

        const createdCompany = await companyModel.findById(Company._id)

        return res.status(200).json(
            new ApiResponce(200, createdCompany, "Company Added Successfully!")
        )
    } catch (error) {
        return res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong while add company!!")
        )
    }

}

//View Company Details
const ViewCompany = async (req, res) => {
    try {
        const data = await companyModel.find()
        if (!data) {
            return res.status(400).json(
                new ApiErrorResponce(400, "Result Not Found!")
            )
        }
        return res.status(200).json(
            new ApiResponce(200, data, "Getting All Data")
        )
    } catch (error) {
        console.log("Failed to Get Data", error);
    }
}

//Delete Company
const DeleteCompany = async (req, res) => {
    try {
        const data = await companyModel.deleteOne({ _id: req.params.id })

        // console.log("data", data);

        if (!data) {
            return res.status(400).json(
                new ApiErrorResponce(400, "Result Not Found!!")
            )
        }

        return res.status(200).json(
            new ApiResponce(200, "Data deleted successfully!!")
        )
    } catch (error) {
        console.log("Failed to Delete Data", error);
    }
}

//Add schedule
const AddSchedule = async (req, res) => {
    try {
        const { empId, empName, strTime, etime, hours, rdays, fdate, tdate, empStatus } = req.body

        if (!strTime || !etime || !hours || !rdays || !fdate || !tdate || !empStatus) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'All fields are required!!')
            )
        }


        const empData = await EmployeeModels.findOne({ empid: empId })
        if (!empData) {
            return res.status(400).json(
                new ApiErrorResponce(400, 'User not found!')
            )
        }
        const { empid, fname } = empData


        const scheduleData = await scheduleModel.create({
            empId: empid,
            empName: fname,
            strTime,
            etime,
            hours,
            rdays,
            fdate,
            tdate,
            empStatus
        })

        const createdSchedule = await scheduleModel.findById(scheduleData._id)

        return res.status(200).json(
            new ApiResponce(200, createdSchedule, "Your Details Schedules!!")
        )
    } catch (error) {
        return res.status(500).json(
            ApiErrorResponce(500, "Something went wrong while schedule data!")
        )
    }
}


//Get all schedule data

const GetScheduleData = async (req, res) => {
    try {
        const AllData = await scheduleModel.find()

        if (!AllData) {
            return res.status(404).json(
                new ApiErrorResponce(404, "Not records found")
            )
        }

        return res.status(200).json(
            new ApiResponce(200, AllData, "All Date Get")
        )
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(
            new ApiErrorResponce(500, "Something went wrong !!")
        )
    }
}

//Update Schedule Data
const updateScheduleData = async (req, res) => {
    try {
        const scheduleData = await scheduleModel.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        if (!scheduleData) {
            return res.status(404).json(
                new ApiErrorResponce(404, "User not found!!")
            )
        }

        return res.status(200).json(
            new ApiResponce(200, scheduleData, "Data Updated Successfully!")
        )


    } catch (error) {
        console.log("error", error);
        return res.status(500).json(
            new ApiErrorResponce(500, "Something went wrong !!")
        )
    }
}


//Delete Schedule Data
const DeleteScheduleData = async (req, res) => {
    try {
        const DeleteData = await scheduleModel.deleteOne({ _id: req.params.id })

        if (!DeleteData) {
            return res.status(404).json(
                new ApiErrorResponce(404, "Not records found")
            )
        }

        return res.status(200).json(
            new ApiResponce(200, DeleteData, "Date Delete Successfully!")
        )
    } catch (error) {
        console.log("error", error);
        return res.status(500).json(
            new ApiErrorResponce(500, "Something went wrong !!")
        )
    }
}

//Add leave
const AddLeave = async (req, res) => {
    try {
        const { empId, decription, leavefrom, leaveto, returndate, leaveStatus } = req.body

        if (!decription || !leavefrom || !leaveto || !returndate) {
            return res.status(404).json(
                new ApiErrorResponce(404, "All fields are required!")
            )
        }


        const existedData = await leaveModel.findOne({
            $or: [{ empId }]
        })

        if (existedData) {
            // alert("Record already existed!")
            return res.status(400).json(
                new ApiErrorResponce(400, "Record already existed!")
            )
        }
        const empdata = await EmployeeModels.findOne({ empid: empId })

        // console.log('empdata', empdata);

        if (!empdata) {
            return res.status(400).json(
                new ApiErrorResponce(400, "User Not Found!")
            )
        }

        const { empid, fname } = empdata

        console.log('empName', fname);

        const createLeave = await leaveModel.create({
            empId: empid,
            empName: fname,
            decription,
            leavefrom,
            leaveto,
            returndate,
            leaveStatus
        })

        const CreatedLeave = await leaveModel.findById(createLeave._id)

        // console.log('CreatedLeave', CreatedLeave);

        return res.status(201).json(
            new ApiResponce(201, CreatedLeave, 'Leave Added Successfully!')
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            ApiErrorResponce(500, "Something went wrong while add leave data!")
        )
    }

}

//Getting all leave data
const GetLeaveData = async (req, res) => {
    try {
        const AllData = await leaveModel.find()

        if (!AllData) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'Data not found!')
            )
        }

        return res.status(200).json(
            new ApiResponce(200, AllData, 'Get All Data!')
        )

    } catch (error) {
        return res.status(500).json(
            new ApiErrorResponce(500, "Something went wrong while get data!")
        )
    }
}

//Update leave
const UpdateLeave = async (req, res) => {
    try {
        const UpdateLeave = await leaveModel.findByIdAndUpdate(
            {
                _id: req.params.id
            },
            {
                $set: req.body
            },
            {
                new: true
            }
        )

        if (!UpdateLeave) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'User not found!!')
            )
        }

        return res.status(200).json(
            new ApiResponce(200, UpdateLeave, 'Leave Updated Successfully!')
        )

    } catch (error) {
        console.log(error);
        return res.status(500).json(
            new ApiErrorResponce(500, "Something went wrong while update leave!")
        )
    }
}

//Delete leave
const DeleteLeave = async (req, res) => {
    try {
        const deleteData = await leaveModel.deleteOne({ _id: req.params.id })
        if (!deleteData) {
            return res.status(404).json(
                new ApiErrorResponce(404, "user not found!")
            )
        }

        return res.status(200).json(
            new ApiResponce(200, deleteData, 'Data deleted successfully!')
        )
    } catch (error) {
        console.log(error);
    }
}

//Add Department
const AddDepartment = async (req, res) => {
    try {
        const { departId, deptName, jobRole, deprtEmail, deprtStatus } = req.body

        if (!departId || !deptName || !jobRole || !deprtEmail || !deprtStatus) {
            return res.status(404).json(
                new ApiResponce(404, 'All fields are required!')
            )
        }

        const exitstDepartment = await departmentModel.findOne({
            $or: [{ departId }, { deptName }]
        })
        if (exitstDepartment) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'Department already existed!')
            )
        }

        const createDepart = await departmentModel.create({
            departId,
            deptName,
            jobRole,
            deprtEmail,
            deprtStatus,
        })

        const createdDepartment = await departmentModel.findById(createDepart._id)

        return res.status(201).json(
            new ApiResponce(201, createdDepartment, 'Department add successfully!')
        )
    } catch (error) {
        console.log(error);
        return res.status(500).json(
            ApiErrorResponce(500, "Something went wrong while add department data!")
        )
    }
}

//Getting all department data
const GetDepartmentData = async (req, res) => {
    try {
        const deprtData = await departmentModel.find()

        if (!deprtData) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'Data not found!')
            )
        }

        return res.status(200).json(
            new ApiResponce(200, deprtData, 'Get All Data!')
        )

    } catch (error) {
        console.log(error);
    }
}

const DeleteDepartment = async (req, res) => {
    try {
        const deleteDepart = await departmentModel.deleteOne({ _id: req.params.id })

        if (!deleteDepart) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'Data not found!')
            )
        }

        return res.status(200).json(
            new ApiResponce(200, deleteDepart, 'Data deleted successfully!')
        )
    } catch (error) {
        console.log(error);
    }
}

//Employee Login
const EmployeeLogin = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'All fiedls are required!')
            )
        }

        const employee = await EmployeeModels.findOne({
            $or: [{ email } || { password }]
        })

        const { accessToken, refreshToken } = await generatefreshTokenAccessToken(employee._id)

        if (!employee) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'Employee not found!')
            )
        }


        //It is manageble by server not frontend
        const options = {
            httpOnly: true,
            sameSite: 'None',
            secure: true
        }

        const loggedEmp = await EmployeeModels.findById(employee._id).select("-password");

        let resp = [
            { loggedEmp, accessToken: accessToken, refreshToken: refreshToken }
        ]

        return res.status(200).json(
            new ApiResponce(200, resp, 'Employee Logged Successfully!')
        )
    } catch (error) {
        console.log('error', error);
        return res.status(500).json(
            new ApiErrorResponce(500, 'Something went wrong!')
        )
    }
}

//Employee Logout
const LogoutEmployee = (async (req, res) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json(
                new ApiErrorResponce(401, "Unauthorized request!")
            )
        }

        // console.log(userUpdate);
        // const options = {
        //     httpOnly: true,
        //     secure: true,
        //     sameSite: 'None'
        // }

        return res.status(200)
            .json(
                new ApiResponce(200, "User Logout!")
            )

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong while logout!!")
        )
    }
})

//add report
const ReportAdd = async (req, res) => {
    try {
        const { empId, reportbox, reportdate } = req.body

        if (!empId || !reportbox || !reportdate) {
            return res.status(404).status(
                new ApiErrorResponce(404, 'All fiedls are required!')
            )
        }

        const empData = await EmployeeModels.findOne({ empid: empId })
        // console.log('empData', empData);


        if (!empData) {
            return res.status(404).json(
                new ApiErrorResponce(404, 'Employee not found!')
            )
        }

        const { empid, fname } = empData




        // console.log('empid', empid);
        // console.log('fname', fname);

        const createReport = await reportModel.create({
            empId: empid,
            empName: fname,
            reportbox,
            reportdate,
        })

        const createdReport = await reportModel.findById(createReport._id)

        // console.log('createdReport', createdReport);

        return res.status(201).json(
            new ApiResponce(201, createdReport, 'Report Created Successfully!')
        )

    } catch (error) {
        console.log(error);
        return res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong while report added!")
        )
    }
}

//getting report data
const getAllReportData = async (req, res) => {
    try {
        const allReportData = await reportModel.find()

        if (!allReportData) {
            return res.status(404).status(
                new ApiErrorResponce(404, 'Data not found!')
            )
        }

        return res.status(200).json(
            new ApiResponce(200, allReportData, 'Getting all data!')
        )
    } catch (error) {
        console.log(error);
        return res.status(400).json(
            new ApiErrorResponce(400, "Something went wrong while generating refresh and access token!!")
        )
    }
}
export {
    RegisterUser, LoginUser, generateAccessandrefreshToken, LogoutUsers, EmployeeAdd, EmpDataDisplay, ChangePassword, AdminDisplay,
    UpdateEmployee, DeleteEmployee, SingelEmpDataDisplay, ClockData, AttenedEmployee, Attendance, UpdateAttendance, AddCompany, ViewCompany
    , DeleteCompany, AddSchedule, GetScheduleData, updateScheduleData, DeleteScheduleData, AddLeave, GetLeaveData, DeleteLeave, AddDepartment,
    GetDepartmentData, DeleteDepartment, EmployeeLogin, LogoutEmployee, ReportAdd, getAllReportData, UpdateLeave
}
