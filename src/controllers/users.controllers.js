import { EmpModel } from '../models/emp.models.js'
import { ApiResponce } from '../utils/ApiResponse.js'
import { ApiErrorResponce } from '../utils/ApiErrorRes.js'
import { uploadOnCloudinary } from '../utils/cloudnary.js'
import { EmployeeModels } from '../models/employee.model.js'
import { clockModel } from '../models/clock.models.js'
import jwt from 'jsonwebtoken'


const generateAccessandrefreshToken = async (userId) => {
    try {
        const users = await EmpModel.findById(userId)
        const accessToken = await users.generateAccessToken()
        const refreshToken = await users.generateRefreshToken()

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
        const data = await EmployeeModels.find();

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
        const { inoutTime, fullDate, TimeIn, TimeOut, empId } = req.body

        const empIds = Number(empId)
        const user = await EmployeeModels.findOne({ empid: empId })

        if (!user) {
            return res.status(404).json(
                new ApiErrorResponce(404, "User not found")
            )
        }

        // console.log(user.empid);
        const { fname: EmployeeName, empStatus: EmpStatus, empid: empid } = user


        // console.log("DD", fullDate);
        // console.log("ID", typeof empIds);
        // console.log("id", typeof empid);
        // console.log("EmployeeModels", user);
        // console.log(EmployeeName);
        // console.log(EmpStatus);

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
            EmpStatus
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


export {
    RegisterUser, LoginUser, generateAccessandrefreshToken, LogoutUsers, EmployeeAdd, EmpDataDisplay, ChangePassword, AdminDisplay,
    UpdateEmployee, DeleteEmployee, SingelEmpDataDisplay, ClockData, AttenedEmployee, Attendance
}
