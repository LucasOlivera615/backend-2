import jwt from "jsonwebtoken"
import env from "../config/env.js"

const generateToken = (user) => {

  return jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role
    },
    env.JWT_SECRET,
    {
      expiresIn: env.JWT_EXPIRES_IN
    }
  )

}

const verifyToken = (token) => {

  return jwt.verify(
    token,
    env.JWT_SECRET
  )

}

export default {
  generateToken,
  verifyToken
}