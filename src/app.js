import express from "express"
import healthRouter from "./routes/health.routes.js"
import eventsRouter from "./routes/events.routes.js"

const app = express()

app.use(express.json())

app.use("/api/health", healthRouter)

app.use("/api/events", eventsRouter)

export default app