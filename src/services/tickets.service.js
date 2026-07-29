import crypto from "crypto"
import ticketsRepository from "../repositories/tickets.repository.js"
import eventsRepository from "../repositories/events.repository.js"
import mailService from "./mail.service.js"
import usersRepository from "../repositories/users.repository.js"

const createTicket = async (
    eventId,
    user,
    quantity
) => {

    const event = await eventsRepository.getEventById(eventId)

    if (!event) {
        throw new Error("Evento no encontrado")
    }

    if (event.status !== "published") {
        throw new Error(
            "Solo es posible inscribirse a eventos publicados"
        )
    }

    if (
        event.status === "cancelled" ||
        event.status === "finished"
    ) {
        throw new Error(
            "No es posible inscribirse a este evento"
        )
    }

    if (
        typeof quantity !== "number" ||
        quantity <= 0
    ) {
        throw new Error(
            "La cantidad debe ser un número mayor a 0"
        )
    }

    const duplicatedTicket =
        await ticketsRepository.getActiveTicket(
            user.id,
            eventId
        )

    if (duplicatedTicket) {
        throw new Error(
            "Ya tienes una inscripción activa para este evento"
        )
    }

    const reservedSeats =
        await ticketsRepository.countReservedSeats(
            eventId
        )

    const availableSeats =
        event.capacity - reservedSeats

    if (availableSeats < quantity) {
        throw new Error(
            "No hay cupos disponibles suficientes"
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
            await usersRepository.getUserById(user.id)

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

    return ticket

}

const getMyTickets = async (userId) => {

    return await ticketsRepository.getUserTickets(
        userId
    )

}

const getEventTickets = async (
    eventId,
    user
) => {

    const event =
        await eventsRepository.getEventById(eventId)

    if (!event) {
        throw new Error("Evento no encontrado")
    }

    const organizerId =
        event.organizer._id
            ? event.organizer._id.toString()
            : event.organizer.toString()

    const isOwner =
        organizerId === user.id

    const isAdmin =
        user.role === "admin"

    if (!isOwner && !isAdmin) {
        throw new Error("No autorizado")
    }

    return await ticketsRepository.getEventTickets(
        eventId
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
        throw new Error("Ticket no encontrado")
    }

    const ownerId =
        ticket.user._id
            ? ticket.user._id.toString()
            : ticket.user.toString()

    const isOwner =
        ownerId === user.id

    const isAdmin =
        user.role === "admin"

    if (!isOwner && !isAdmin) {
        throw new Error("No autorizado")
    }

    if (ticket.status === "cancelled") {
        throw new Error(
            "El ticket ya fue cancelado"
        )
    }

    return await ticketsRepository.updateTicket(
        ticketId,
        {
            status: "cancelled",
            cancelledAt: new Date()
        }
    )

}

export default {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
}