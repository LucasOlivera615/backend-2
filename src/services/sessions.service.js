import usersRepository from "../repositories/users.repository.js"
import { createHash } from "../utils/hash.js"

const registerUser = async (userData) => {
  const { first_name, last_name, email, password } = userData

  if (!first_name || !last_name || !email || !password) {
    throw new Error("Faltan campos obligatorios")
  }

  if (!email.includes("@")) {
    throw new Error("Email inválido")
  }

  if (password.length < 8) {
    throw new Error("La contraseña debe tener al menos 8 caracteres")
  }

  const normalizedEmail = email.trim().toLowerCase()

  const existingUser = await usersRepository.getUserByEmail(normalizedEmail)

  if (existingUser) {
    const error = new Error("El email ya está registrado")
    error.statusCode = 409
    throw error
  }

  const hashedPassword = await createHash(password)

  const newUser = await usersRepository.createUser({
    first_name,
    last_name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "user"
  })

  const { password: _, ...userWithoutPassword } = newUser.toObject()

  return userWithoutPassword
}

export default {
  registerUser
}