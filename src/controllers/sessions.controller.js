import jwtUtils from "../utils/jwt.js"
import env from "../config/env.js"
import UserDTO from "../dto/user.dto.js"

const register = async (req, res, next) => {

    try {

        return res.status(201).json({
            status: "success",
            payload: UserDTO.toUserDTO(req.user)
        })

    } catch (error) {

        next(error)

    }

}

const login = async (req, res, next) => {

    try {

        const token =
            jwtUtils.generateToken(req.user)

        return res
            .cookie("currentUser", token, {
                httpOnly: true,
                sameSite: "lax",
                maxAge: 3600000,
                secure: env.NODE_ENV === "production"
            })
            .status(200)
            .json({
                status: "success",
                message: "Login correcto"
            })

    } catch (error) {

        next(error)

    }

}

const current = async (req, res, next) => {

    try {

        return res.status(200).json({
            status: "success",
            payload: UserDTO.toUserDTO(req.user)
        })

    } catch (error) {

        next(error)

    }

}

const logout = async (req, res, next) => {

    try {

        res.clearCookie("currentUser")

        return res.status(200).json({
            status: "success",
            message: "Sesión cerrada"
        })

    } catch (error) {

        next(error)

    }

}

export default {
    register,
    login,
    current,
    logout
}