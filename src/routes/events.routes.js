import { Router } from "express"
import eventsController from "../controllers/events.controller.js"
import passportCurrent from "../middlewares/passportCurrent.middleware.js"
import authorize from "../middlewares/authorize.middleware.js"

const router = Router()


// Público
router.get(
    "/",
    eventsController.getAllEvents
)


router.get(
    "/:id",
    eventsController.getEventById
)


// Organizer / Admin
router.post(
    "/",
    passportCurrent,
    authorize("organizer", "admin"),
    eventsController.createEvent
)


router.put(
    "/:id",
    passportCurrent,
    authorize("organizer", "admin"),
    eventsController.updateEvent
)


router.patch(
    "/:id/status",
    passportCurrent,
    authorize("organizer", "admin"),
    eventsController.updateStatus
)


export default router