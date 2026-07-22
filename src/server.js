import app from "./app.js"
import env from "./config/env.js"
import connectDB from "./config/db.js"

await connectDB()

app.listen(env.PORT, () => {
  console.log(`Servidor corriendo en el puerto ${env.PORT}`)
})