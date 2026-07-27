import { Router } from "express"
import eventsController from "../controllers/events.controller.js"
import passportCurrent from "../middlewares/passportCurrent.middleware.js"
import authorize from "../middlewares/authorize.middleware.js"

const router = Router()

router.get("/", eventsController.getAllEvents)

router.post(
    "/",
    passportCurrent,
    authorize("organizer", "admin"),
    eventsController.createEvent
)

router.get(
    "/admin",
    passportCurrent,
    authorize("admin"),
    eventsController.getAdminData
)

router.put(
    "/:id",
    passportCurrent,
    authorize("organizer", "admin"),
    eventsController.updateEvent
)

export default router