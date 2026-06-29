import { Router } from "express"
import sessionController from "../controllers/sessions.controllers.js"

const router = Router()

router.get("/", sessionController)

export default router