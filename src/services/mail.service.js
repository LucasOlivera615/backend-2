import nodemailer from "nodemailer"
import env from "../config/env.js"

const transporter = nodemailer.createTransport({
    host: env.MAIL_HOST,
    port: Number(env.MAIL_PORT),
    secure: false,
    auth: {
        user: env.MAIL_USER,
        pass: env.MAIL_PASS
    }
})

const sendTicketConfirmation = async (
    user,
    event,
    ticket
) => {

    await transporter.sendMail({

        from: env.MAIL_FROM,

        to: user.email,

        subject: "Confirmación de inscripción",

        html: `
            <h2>¡Inscripción confirmada!</h2>

            <p>Hola ${user.first_name},</p>

            <p>Tu inscripción fue confirmada correctamente.</p>

            <hr>

            <p><strong>Evento:</strong> ${event.title}</p>

            <p><strong>Fecha:</strong> ${new Date(event.date).toLocaleString()}</p>

            <p><strong>Lugar:</strong> ${event.location}</p>

            <p><strong>Cantidad:</strong> ${ticket.quantity}</p>

            <p><strong>Código de reserva:</strong></p>

            <h3>${ticket.reservationCode}</h3>

            <hr>

            <p>Gracias por utilizar CoderEventos.</p>
        `

    })

}

export default {
    sendTicketConfirmation
}