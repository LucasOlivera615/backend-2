import eventsService from "../services/events.service.js"

const getAllEvents = (req, res) => {
    const events = eventsService.getAllEvents()

    res.status(200).json({
        status: "success",
        payload: events
    })
}

const createEvent = (req, res) => {
    try {
        const event = eventsService.createEvent({
            ...req.body,
            organizer: req.user.id
        })

        res.status(201).json({
            status: "success",
            payload: event
        })

    } catch (error) {
        res.status(error.statusCode || 400).json({
            status: "error",
            message: error.message
        })
    }
}

const getAdminData = (req, res) => {
    res.status(200).json({
        status: "success",
        message: "Bienvenido administrador",
        user: req.user
    })
}

const updateEvent = (req, res) => {
    try {

        const event = eventsService.updateEvent(
            req.params.id,
            req.body,
            req.user
        )

        res.status(200).json({
            status: "success",
            payload: event
        })


    } catch (error) {

        res.status(error.statusCode || 400).json({
            status: "error",
            message: error.message
        })

    }
}

export default {
    getAllEvents,
    createEvent,
    getAdminData,
    updateEvent
}