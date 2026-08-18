import { Router } from "express"
import ticketsController from "../controllers/tickets.controller.js"
import passportCurrent from "../middlewares/passportCurrent.middleware.js"
import authorize from "../middlewares/authorize.middleware.js"

const router = Router()


router.get(
    "/my-tickets",
    passportCurrent,
    ticketsController.getMyTickets
)


router.patch(
    "/:tid/cancel",
    passportCurrent,
    ticketsController.cancelTicket
)


router.get(
    "/events/:eid",
    passportCurrent,
    authorize("organizer", "admin"),
    ticketsController.getEventTickets
)


export default router