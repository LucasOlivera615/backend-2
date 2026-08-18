import usersRepository from "../repositories/users.repository.js"
import { createHash, isValidPassword } from "../utils/hash.js"
import AppError from "../utils/AppError.js"

const registerUser = async (userData) => {

  const {
    first_name,
    last_name,
    email,
    password
  } = userData

  if (
    !first_name ||
    !last_name ||
    !email ||
    !password
  ) {

    throw new AppError(
      "Faltan campos obligatorios",
      400
    )

  }

  const normalizedEmail =
    email.trim().toLowerCase()

  if (!normalizedEmail.includes("@")) {

    throw new AppError(
      "Email inválido",
      400
    )

  }

  if (password.length < 8) {

    throw new AppError(
      "La contraseña debe tener al menos 8 caracteres",
      400
    )

  }

  const existingUser =
    await usersRepository.getUserByEmail(
      normalizedEmail
    )

  if (existingUser) {

    throw new AppError(
      "El email ya está registrado",
      409
    )

  }

  const hashedPassword =
    await createHash(password)

  const newUser =
    await usersRepository.createUser({

      first_name,
      last_name,
      email: normalizedEmail,
      password: hashedPassword,
      role: "user"

    })

  return newUser
}

const authenticateUser = async (
  email,
  password
) => {

  if (!email || !password) {

    throw new AppError(
      "Credenciales inválidas",
      401
    )

  }

  const normalizedEmail =
    email.trim().toLowerCase()

  const user =
    await usersRepository.getUserByEmail(
      normalizedEmail
    )

  if (!user) {

    throw new AppError(
      "Credenciales inválidas",
      401
    )

  }

  const validPassword =
    await isValidPassword(
      password,
      user.password
    )

  if (!validPassword) {

    throw new AppError(
      "Credenciales inválidas",
      401
    )

  }

  return user
}

export default {
  registerUser,
  authenticateUser
}