import jwtUtils from "../utils/jwt.js"
import env from "../config/env.js"

const register = (req, res) => {

  res.status(201).json({
    status: "success",
    payload: req.user
  })

}

const login = (req, res) => {

  const token = jwtUtils.generateToken(req.user)

  res
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

}

const current = (req, res) => {

  const { id, email, role } = req.user

  res.status(200).json({
    status: "success",
    payload: {
      id,
      email,
      role
    }
  })

}

const logout = (req, res) => {
  res.clearCookie("currentUser")

  res.status(200).json({
    status: "success",
    message: "Sesión cerrada"
  })
}

export default {
  register,
  login,
  current,
  logout
}