import mongoose from "mongoose"


const ticketSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },

        event: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true
        },

        status: {
            type: String,
            enum: [
                "confirmed",
                "pending",
                "cancelled"
            ],
            default: "confirmed",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 1,
            validate: {
                validator: Number.isInteger,
                message: "La cantidad debe ser un número entero"
            }
        },

        reservationCode: {
            type: String,
            required: true,
            unique: true,
            trim: true
        },

        cancelledAt: {
            type: Date,
            default: null
        }

    },
    {
        timestamps: true
    }
)


ticketSchema.index({
    user: 1,
    event: 1
})


const Ticket =
    mongoose.model(
        "Ticket",
        ticketSchema
    )


export default Ticket