import usersDao from "../dao/users.dao.js"

const createUser = async (userData) => {

  return await usersDao.createUser(
    userData
  )

}

const getUserByEmail = async (email) => {

  return await usersDao.getUserByEmail(
    email
  )

}

const getUserById = async (id) => {

  return await usersDao.getUserById(
    id
  )

}

export default {
  createUser,
  getUserByEmail,
  getUserById
}