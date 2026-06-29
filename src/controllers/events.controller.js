import eventsService from "../services/events.service.js"

const eventsController = (req, res) => {
    const events = eventsService.getAllEvents()

    res.json({
        success: true,
        data: events
    })
}

export default eventsController