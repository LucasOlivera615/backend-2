import { Router } from "express"
import eventsController from "../controllers/events.controller.js"
import passportCurrent from "../middlewares/passportCurrent.middleware.js"
import authorize from "../middlewares/authorize.middleware.js"
import ticketsController from "../controllers/tickets.controller.js"

const router = Router()


router.get(
    "/",
    eventsController.getAllEvents
)


router.get(
    "/:id",
    eventsController.getEventById
)

router.get(
    "/:eid/tickets",
    passportCurrent,
    authorize("organizer", "admin"),
    ticketsController.getEventTickets
)


router.post(
    "/",
    passportCurrent,
    authorize("organizer", "admin"),
    eventsController.createEvent
)

router.post(
    "/:eid/tickets",
    passportCurrent,
    ticketsController.createTicket
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