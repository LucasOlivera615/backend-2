import { Router } from "express"
import sessionController from "../controllers/sessions.controller.js"

const router = Router()

router.get("/", sessionController)

export default router