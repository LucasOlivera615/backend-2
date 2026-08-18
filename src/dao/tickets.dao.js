import Ticket from "../models/Ticket.js"
import mongoose from "mongoose"


const createTicket = async (
    ticketData
) => {

    const ticket =
        await Ticket.create(ticketData)

    return await Ticket.findById(
        ticket._id
    )
        .populate(
            "user",
            "first_name last_name email role"
        )
        .populate(
            "event",
            "title date location"
        )

}


const getTicketById = async (
    id
) => {

    return await Ticket.findById(id)
        .populate(
            "user",
            "first_name last_name email role"
        )
        .populate(
            "event",
            "title date location organizer"
        )

}


const getUserTickets = async (
    userId
) => {

    return await Ticket.find({
        user: userId
    })
        .populate(
            "event",
            "title date location"
        )

}


const getEventTickets = async (
    eventId
) => {

    return await Ticket.find({
        event: eventId
    })
        .populate(
            "user",
            "first_name last_name email role"
        )

}


const getActiveTicket = async (
    userId,
    eventId
) => {

    return await Ticket.findOne({
        user: userId,
        event: eventId,
        status: {
            $in: [
                "confirmed",
                "pending"
            ]
        }
    })

}


const countReservedSeats = async (
    eventId
) => {

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
        return 0
    }

    const result = await Ticket.aggregate([
        {
            $match: {
                event: new mongoose.Types.ObjectId(
                    eventId
                ),
                status: {
                    $ne: "cancelled"
                }
            }
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: "$quantity"
                }
            }
        }
    ])


    return result.length > 0
        ? result[0].total
        : 0

}


const updateTicket = async (
    id,
    updateData
) => {

    const ticket =
        await Ticket.findByIdAndUpdate(
            id,
            updateData,
            {
                new: true,
                runValidators: true
            }
        )


    if (!ticket) {
        return null
    }


    return await Ticket.findById(
        ticket._id
    )
        .populate(
            "user",
            "first_name last_name email role"
        )
        .populate(
            "event",
            "title date location"
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