import User from "../models/User.js"

const createUser = async (userData) => {
  return await User.create(userData)
}

const getUserByEmail = async (email) => {
  return await User.findOne({ email })
}

export default {
  createUser,
  getUserByEmail
}