import eventsService from "../services/events.service.js"
import EventDTO from "../dto/event.dto.js"


const createEvent = async (req, res) => {

    const event =
        await eventsService.createEvent(
            req.body,
            req.user.id
        )

    return res.status(201).json({
        status: "success",
        payload: EventDTO.toEventDTO(event)
    })

}


const getAllEvents = async (req, res) => {

    const result =
        await eventsService.getAllEvents(
            req.query
        )

    return res.status(200).json({
        status: "success",
        data: result.data.map(
            event => EventDTO.toEventDTO(event)
        ),
        page: result.page,
        limit: result.limit,
        total: result.total,
        totalPages: result.totalPages
    })

}


const getEventById = async (req, res) => {

    const event =
        await eventsService.getEventById(
            req.params.id
        )

    return res.status(200).json({
        status: "success",
        payload: EventDTO.toEventDTO(event)
    })

}


const updateEvent = async (req, res) => {

    const event =
        await eventsService.updateEvent(
            req.params.id,
            req.body,
            req.user
        )

    return res.status(200).json({
        status: "success",
        payload: EventDTO.toEventDTO(event)
    })

}


const updateStatus = async (req, res) => {

    const event =
        await eventsService.updateStatus(
            req.params.id,
            req.body.status,
            req.user
        )

    return res.status(200).json({
        status: "success",
        payload: EventDTO.toEventDTO(event)
    })

}


export default {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    updateStatus
}