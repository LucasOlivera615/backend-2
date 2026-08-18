import crypto from "crypto"
import ticketsRepository from "../repositories/tickets.repository.js"
import eventsRepository from "../repositories/events.repository.js"
import usersRepository from "../repositories/users.repository.js"
import mailService from "./mail.service.js"
import TicketDTO from "../dto/ticket.dto.js"
import AppError from "../utils/AppError.js"


const createTicket = async (
    eventId,
    user,
    quantity
) => {

    const event =
        await eventsRepository.getEventById(
            eventId
        )


    if (!event) {

        throw new AppError(
            "Evento no encontrado",
            404
        )

    }


    if (event.status !== "published") {

        throw new AppError(
            "Solo es posible inscribirse a eventos publicados",
            400
        )

    }


    if (
        event.status === "cancelled" ||
        event.status === "finished"
    ) {

        throw new AppError(
            "No es posible inscribirse a este evento",
            400
        )

    }


    if (
        typeof quantity !== "number" ||
        quantity <= 0
    ) {

        throw new AppError(
            "La cantidad debe ser un número mayor a 0",
            400
        )

    }


    const duplicatedTicket =
        await ticketsRepository.getActiveTicket(
            user.id,
            eventId
        )


    if (duplicatedTicket) {

        throw new AppError(
            "Ya tienes una inscripción activa para este evento",
            409
        )

    }


    const reservedSeats =
        await ticketsRepository.countReservedSeats(
            eventId
        )


    const availableSeats =
        event.capacity - reservedSeats


    if (availableSeats < quantity) {

        throw new AppError(
            "No hay cupos disponibles suficientes",
            400
        )

    }


    const reservationCode =
        crypto.randomUUID()


    const ticket =
        await ticketsRepository.createTicket({

            user: user.id,
            event: eventId,
            quantity,
            status: "confirmed",
            reservationCode

        })


    try {

        const fullUser =
            await usersRepository.getUserById(
                user.id
            )


        await mailService.sendTicketConfirmation(
            fullUser,
            event,
            ticket
        )

    } catch (error) {

        console.error(
            "Error enviando email de confirmación:",
            error.message
        )

    }


    return TicketDTO.toTicketDTO(
        ticket
    )

}


const getMyTickets = async (
    userId
) => {

    const tickets =
        await ticketsRepository.getUserTickets(
            userId
        )


    return tickets.map(
        ticket => TicketDTO.toTicketDTO(ticket)
    )

}


const getEventTickets = async (
    eventId,
    user
) => {

    const event =
        await eventsRepository.getEventById(
            eventId
        )


    if (!event) {

        throw new AppError(
            "Evento no encontrado",
            404
        )

    }


    const organizerId =
        event.organizer?._id
            ? event.organizer._id.toString()
            : event.organizer?.toString()


    const isOwner =
        organizerId === user.id


    const isAdmin =
        user.role === "admin"


    if (!isOwner && !isAdmin) {

        throw new AppError(
            "No autorizado",
            403
        )

    }


    const tickets =
        await ticketsRepository.getEventTickets(
            eventId
        )


    return tickets.map(
        ticket => TicketDTO.toTicketDTO(ticket)
    )

}


const cancelTicket = async (
    ticketId,
    user
) => {

    const ticket =
        await ticketsRepository.getTicketById(
            ticketId
        )


    if (!ticket) {

        throw new AppError(
            "Ticket no encontrado",
            404
        )

    }


    const ownerId =
        ticket.user?._id
            ? ticket.user._id.toString()
            : ticket.user?.toString()


    const isOwner =
        ownerId === user.id


    const isAdmin =
        user.role === "admin"


    if (!isOwner && !isAdmin) {

        throw new AppError(
            "No autorizado",
            403
        )

    }


    if (ticket.status === "cancelled") {

        throw new AppError(
            "El ticket ya fue cancelado",
            400
        )

    }


    const updatedTicket =
        await ticketsRepository.updateTicket(
            ticketId,
            {
                status: "cancelled",
                cancelledAt: new Date()
            }
        )


    return TicketDTO.toTicketDTO(
        updatedTicket
    )

}


export default {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
}