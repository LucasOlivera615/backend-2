import jwtUtils from "../utils/jwt.js"

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.currentUser

    if (!token) {
      return res.status(401).json({
        status: "error",
        message: "No autenticado"
      })
    }

    const user = jwtUtils.verifyToken(token)

    req.user = user

    next()

  } catch (error) {
    return res.status(401).json({
      status: "error",
      message: "No autenticado"
    })
  }
}

export default authMiddleware