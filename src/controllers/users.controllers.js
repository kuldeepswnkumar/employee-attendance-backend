import { EmpModel } from '../models/emp.models.js'
import { ApiResponce } from '../utils/ApiResponse.js'
import { ApiErrors } from '../utils/ApiError.js'

const RegisterUser = (async (req, res) => {
    try {
        const { empId, empName, email, mobile, accType, empRole, status, password, cfmpassword } = req.body

        if (!empId === "") {
            throw new ApiErrors("Id is required!")
        }
        if (!empName === "") {
            throw new ApiErrors("Name is required!")
        }
        if (!email === "") {
            throw new ApiErrors("Email is required!")
        }
        if (!mobile === "") {
            throw new ApiErrors("Mobile is required!")
        }
        if (!password === "") {
            throw new ApiErrors("Password is required!")
        }

        const existsUser = EmpModel.findOne({
            $or: [{ empId }, { email }]
        })
        // console.log('existsUser', existsUser);

        if (!existsUser) {
            throw new ApiErrors(402, "User with id and email are already existed!")
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
            throw new ApiErrors(404, "Somethings went worng while register user!")
        }


        return res.status(201).json(
            new ApiResponce(200, createdUser, "You are registered!")
        )
    } catch (err) {
        // console.log("err", err)
        return res.status(400).json(
            new ApiResponce(400, [], "Oops! Something went wrong")
        )

    }


})

export { RegisterUser }
