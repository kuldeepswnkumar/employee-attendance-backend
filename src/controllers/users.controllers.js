import express from 'express'
import mongoose from 'mongoose'
import { EmpModel } from '../models/emp.models.js'
import { ApiResponce } from '../utils/ApiResponse.js'
import { ApiErrors } from '../utils/ApiError.js'

const RegisterUser = (async (req, res) => {
    const { EmpId, EmpName, Email, Mobile, AccoutType, EmpRole, Password, Confirm_Password, Status } = req.body

    if (!EmpId === "") {
        throw new ApiErrors("Id is required!")
    }
    if (!EmpName === "") {
        throw new ApiErrors("Name is required!")
    }
    if (!Email === "") {
        throw new ApiErrors("Email is required!")
    }
    if (!Mobile === "") {
        throw new ApiErrors("Mobile is required!")
    }
    if (!Password === "") {
        throw new ApiErrors("Password is required!")
    }

    const existsUser = EmpModel.findOne({
        $or: [{ EmpId }, { Email }]
    })

    if (!existsUser) {
        throw new ApiErrors(402, "User with id and email are already existed!")
    }

    const user = await EmpModel.create({
        EmpId,
        EmpName,
        Email,
        Mobile,
        AccoutType,
        EmpRole,
        Password,
        Confirm_Password,
        Status

    })

    const createdUser = await EmpModel.findOne(user._id).select(
        "-Password -Confirm_Password"
    )

    if (!createdUser) {
        throw new ApiErrors(404, "Somethings went worng while register user!")
    }


    return res.status(201).json(
        new ApiResponce(200, createdUser, "You are registered!")
    )

})

export { RegisterUser }
