import ticketsService from "../services/tickets.service.js"

const createTicket = async (req, res) => {

    try {

        const ticket = await ticketsService.createTicket(
            req.params.eid,
            req.user,
            req.body.quantity
        )

        return res.status(201).json({
            status: "success",
            payload: ticket
        })

    } catch (error) {

        const status =
            error.message === "Evento no encontrado"
                ? 404
                : error.message === "No autorizado"
                    ? 403
                    : error.statusCode || 400

        return res.status(status).json({
            status: "error",
            message: error.message
        })

    }

}

const getMyTickets = async (req, res) => {

    try {

        const tickets = await ticketsService.getMyTickets(
            req.user.id
        )

        return res.status(200).json({
            status: "success",
            payload: tickets
        })

    } catch (error) {

        return res.status(error.statusCode || 500).json({
            status: "error",
            message: error.message
        })

    }

}

const getEventTickets = async (req, res) => {

    try {

        const tickets = await ticketsService.getEventTickets(
            req.params.eid,
            req.user
        )

        return res.status(200).json({
            status: "success",
            payload: tickets
        })

    } catch (error) {

        const status =
            error.message === "Evento no encontrado"
                ? 404
                : error.message === "No autorizado"
                    ? 403
                    : error.statusCode || 400

        return res.status(status).json({
            status: "error",
            message: error.message
        })

    }

}

const cancelTicket = async (req, res) => {

    try {

        const ticket = await ticketsService.cancelTicket(
            req.params.tid,
            req.user
        )

        return res.status(200).json({
            status: "success",
            payload: ticket
        })

    } catch (error) {

        const status =
            error.message === "Ticket no encontrado"
                ? 404
                : error.message === "No autorizado"
                    ? 403
                    : error.statusCode || 400

        return res.status(status).json({
            status: "error",
            message: error.message
        })

    }

}

export default {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
}