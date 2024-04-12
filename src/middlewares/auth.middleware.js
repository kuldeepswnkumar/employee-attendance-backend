import { EmpModel } from "../models/emp.models.js";
import jwt from 'jsonwebtoken'
import { ApiErrorResponce } from "../utils/ApiErrorRes.js";


const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(400).json(
                new ApiErrorResponce(401, "Unauthorized request!")
            )
        }
        // console.log(token);

        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

        console.log("Decode Token", decodeToken)
        const user = await EmpModel.findById(decodeToken._id)
            .select("-password -refreshToken")

        if (!user) {
            return res.status(400).json(
                new ApiErrorResponce(401, "Invalid Access Token")
            )
        }

        req.user = user
        next()
    } catch (error) {
        return res.status(400).json(
            new ApiErrorResponce(401, "Invalid Access Token")
        )
    }

}

export { verifyToken }