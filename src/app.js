import express from "express"
import healthRouter from "./routes/health.routes.js"
import eventsRouter from "./routes/events.routes.js"
import sessionsRouter from "./routes/sessions.routes.js"
import loggerMiddleware from "./middlewares/logger.middleware.js"
import cookieParser from "cookie-parser"
import passport from "passport"
import initializePassport from "./config/passport.config.js"

const app = express()

app.use(express.json())

app.use(cookieParser())

initializePassport()

app.use(passport.initialize())

app.use(loggerMiddleware)

app.use("/api/health", healthRouter)

app.use("/api/events", eventsRouter)

app.use("/api/sessions", sessionsRouter)

export default app