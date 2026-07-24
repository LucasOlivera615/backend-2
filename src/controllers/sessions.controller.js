import sessionsService from "../services/sessions.service.js"
import env from "../config/env.js"

const register = async (req, res) => {
  try {
    const user = await sessionsService.registerUser(req.body)

    res.status(201).json({
      status: "success",
      payload: user
    })

  } catch (error) {
    res.status(error.statusCode || 400).json({
      status: "error",
      message: error.message
    })
  }
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body

    const token = await sessionsService.loginUser(email, password)

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

  } catch (error) {
    res.status(error.statusCode || 401).json({
      status: "error",
      message: error.message
    })
  }
}

const current = (req, res) => {
  res.status(200).json({
    status: "success",
    payload: req.user
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