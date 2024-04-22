import { EmpModel } from '../models/emp.models.js'
import { ApiResponce } from '../utils/ApiResponse.js'
import { ApiErrorResponce } from '../utils/ApiErrorRes.js'
import { uploadOnCloudinary } from '../utils/cloudnary.js'
import { EmployeeModels } from '../models/employee.model.js'

const generateAccessandrefreshToken = async (userId) => {
    try {
        const users = await EmpModel.findById(userId)
        const accessToken = await users.generateAccessToken()
        const refreshToken = await users.generateRefreshToken()

        users.refreshToken = refreshToken


        //refreshToken save in data base
        await users.save({ validateBeforeSave: false })
        return { accessToken, refreshToken }

    } catch (error) {
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
        return res.status(200).cookie("accessToken", accessToken, options).cookie("refreshToken", refreshToken, options).json(
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
        await EmpModel.findByIdAndUpdate(
            req.user?._id,
            {
                $set: {
                    "refreshToken": undefined
                }
            },
            {
                new: true
            }
        )
        console.log("Ref", req.user._id);
        console.log(req.user);
        const options = {
            httpOnly: true,
            secure: true,
            sameSite: 'None'
        }

        return res.status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
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
        //Here I am getting local profile img path
        // console.log("Body", req.body);
        // console.log("File", req.file);
        // console.log("Files", req.files);

        // if (!req.file) {
        //     return res.status(400).send('No file uploaded.');
        // }

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


export { RegisterUser, LoginUser, generateAccessandrefreshToken, LogoutUsers, EmployeeAdd, EmpDataDisplay, ChangePassword, AdminDisplay, UpdateEmployee, DeleteEmployee, SingelEmpDataDisplay }
