import ticketsDao from "../dao/tickets.dao.js"

const createTicket = async (ticketData) => {

    return await ticketsDao.createTicket(
        ticketData
    )

}

const getTicketById = async (id) => {

    return await ticketsDao.getTicketById(id)

}

const getUserTickets = async (userId) => {

    return await ticketsDao.getUserTickets(userId)

}

const getEventTickets = async (eventId) => {

    return await ticketsDao.getEventTickets(eventId)

}

const getActiveTicket = async (userId, eventId) => {

    return await ticketsDao.getActiveTicket(
        userId,
        eventId
    )

}

const countReservedSeats = async (eventId) => {

    return await ticketsDao.countReservedSeats(
        eventId
    )

}

const updateTicket = async (id, updateData) => {

    return await ticketsDao.updateTicket(
        id,
        updateData
    )

}

export default {
    createTicket,
    getTicketById,
    getUserTickets,
    getEventTickets,
    getActiveTicket,
    countReservedSeats,
    updateTicket
}