import { EmpModel } from '../models/emp.models.js';
import jwt from 'jsonwebtoken'
import { ApiErrorResponce } from "../utils/ApiErrorRes.js";
import { EmployeeModels } from '../models/employee.model.js';



const verifyToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        // console.log(req.headers);

        if (!token) {
            return res.status(401).json(
                new ApiErrorResponce(401, "Unauthorized request!")
            )
        }

        // console.log(token);

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        // console.log("Decode Token", decodeToken)
        const user = await EmpModel.findById(decodeToken._id)
            .select("-password -refreshToken")

        if (!user) {
            return res.status(401).json(
                new ApiErrorResponce(401, "Invalid Access Token")
            )
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json(
            new ApiErrorResponce(401, "Invalid Access Token")
        )
    }

}

const verifyEmployeeToken = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            return res.status(401).json(
                new ApiErrorResponce(401, "Unauthorized request!")
            )
        }

        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        // console.log("Decode Token", decodedToken)

        const user = await EmployeeModels.findById(decodedToken._id)

        // console.log('user', user);
        if (!user) {
            return res.status(401).json(
                new ApiErrorResponce(401, "Invalid Access Token")
            )
        }

        req.user = user
        next()
    } catch (error) {
        console.log(error);
        return res.status(401).json(
            new ApiErrorResponce(401, "Invalid Access Token")
        )
    }

}

export { verifyToken, verifyEmployeeToken }