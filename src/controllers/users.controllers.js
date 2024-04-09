import { EmpModel } from '../models/emp.models.js'
import { ApiResponce } from '../utils/ApiResponse.js'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiErrorResponce } from '../utils/ApiErrorRes.js'


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
            "-password -cfmpassword"
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

        if (!validPassword) {
            return res.status(404).json(
                new ApiErrorResponce(400, "Invalid Credential")
            )
        }

        res.status(201).json(
            new ApiResponce(200, "User Logged In!")
        )
    } catch (error) {
        console.log("An error occor", error);
        return res.status(404).json(
            new ApiErrorResponce(404, [], "Oops! Somethings went wrong!")
        )
    }
})

export { RegisterUser, LoginUser }
