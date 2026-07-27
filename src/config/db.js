import mongoose from "mongoose"
import env from "./env.js"

const connectDB = async () => {
  try {

    await mongoose.connect(env.MONGO_URL)

    console.log("MongoDB conectado correctamente")

  } catch (error) {
    console.error("Error al conectar MongoDB:", error)

    process.exit(1)
  }
}

export default connectDB