const toTicketDTO = (ticket) => {

    if (!ticket) {
        return null
    }

    let userDTO = null

    if (ticket.user) {

        userDTO = {
            id: ticket.user._id?.toString() || ticket.user.id,
            first_name: ticket.user.first_name,
            last_name: ticket.user.last_name,
            email: ticket.user.email,
            role: ticket.user.role
        }

    }

    let eventDTO = null

    if (ticket.event) {

        eventDTO = {
            id: ticket.event._id?.toString() || ticket.event.id,
            title: ticket.event.title,
            date: ticket.event.date,
            location: ticket.event.location
        }

    }

    return {
        id: ticket._id?.toString() || ticket.id,
        user: userDTO,
        event: eventDTO,
        quantity: ticket.quantity,
        status: ticket.status,
        reservationCode: ticket.reservationCode,
        createdAt: ticket.createdAt,
        cancelledAt: ticket.cancelledAt
    }

}

export default {
    toTicketDTO
}