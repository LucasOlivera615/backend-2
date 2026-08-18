import ticketsService from "../services/tickets.service.js"
import TicketDTO from "../dto/ticket.dto.js"


const createTicket = async (req, res, next) => {

    try {

        const ticket =
            await ticketsService.createTicket(
                req.params.eid,
                req.user,
                req.body.quantity
            )

        return res.status(201).json({
            status: "success",
            payload: TicketDTO.toTicketDTO(ticket)
        })

    } catch (error) {

        next(error)

    }

}


const getMyTickets = async (req, res, next) => {

    try {

        const tickets =
            await ticketsService.getMyTickets(
                req.user.id
            )

        return res.status(200).json({
            status: "success",
            payload: tickets.map(
                ticket => TicketDTO.toTicketDTO(ticket)
            )
        })

    } catch (error) {

        next(error)

    }

}


const getEventTickets = async (req, res, next) => {

    try {

        const tickets =
            await ticketsService.getEventTickets(
                req.params.eid,
                req.user
            )

        return res.status(200).json({
            status: "success",
            payload: tickets.map(
                ticket => TicketDTO.toTicketDTO(ticket)
            )
        })

    } catch (error) {

        next(error)

    }

}


const cancelTicket = async (req, res, next) => {

    try {

        const ticket =
            await ticketsService.cancelTicket(
                req.params.tid,
                req.user
            )

        return res.status(200).json({
            status: "success",
            payload: TicketDTO.toTicketDTO(ticket)
        })

    } catch (error) {

        next(error)

    }

}


export default {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
}