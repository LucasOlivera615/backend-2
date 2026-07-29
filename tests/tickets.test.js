import request from "supertest"
import app from "../src/app.js"
import mongoose from "mongoose"
import connectDB from "../src/config/db.js"

import User from "../src/models/User.js"
import Event from "../src/models/Event.js"
import Ticket from "../src/models/Ticket.js"


beforeAll(async () => {
    await connectDB()
})


afterAll(async () => {

    await Ticket.deleteMany({})
    await Event.deleteMany({})
    await User.deleteMany({})

    await mongoose.connection.close()

})


describe("Tickets API", () => {


    let userCookie
    let organizerCookie
    let adminCookie

    let eventId
    let ticketId


    const user = {
        first_name: "User",
        last_name: "Test",
        email: `user${Date.now()}@ticktest.com`,
        password: "Password123"
    }


    const organizer = {
        first_name: "Organizer",
        last_name: "Test",
        email: `organizer${Date.now()}@ticktest.com`,
        password: "Password123"
    }


    const admin = {
        first_name: "Admin",
        last_name: "Test",
        email: `admin${Date.now()}@ticktest.com`,
        password: "Password123"
    }



    test("Crear usuarios de prueba", async () => {


        const userResponse =
            await request(app)
                .post("/api/sessions/register")
                .send(user)


        expect(userResponse.statusCode)
            .toBe(201)



        const organizerResponse =
            await request(app)
                .post("/api/sessions/register")
                .send(organizer)


        await User.findByIdAndUpdate(
            organizerResponse.body.payload._id,
            {
                role: "organizer"
            }
        )



        const adminResponse =
            await request(app)
                .post("/api/sessions/register")
                .send(admin)


        await User.findByIdAndUpdate(
            adminResponse.body.payload._id,
            {
                role: "admin"
            }
        )


        expect(userResponse.body.payload)
            .toHaveProperty("_id")

    })



    test("Login usuario", async () => {


        const response =
            await request(app)
                .post("/api/sessions/login")
                .send({
                    email: user.email,
                    password: user.password
                })


        userCookie =
            response.headers["set-cookie"]


        expect(response.statusCode)
            .toBe(200)

    })



    test("Login organizer", async () => {


        const response =
            await request(app)
                .post("/api/sessions/login")
                .send({
                    email: organizer.email,
                    password: organizer.password
                })


        organizerCookie =
            response.headers["set-cookie"]


        expect(response.statusCode)
            .toBe(200)

    })



    test("Login admin", async () => {


        const response =
            await request(app)
                .post("/api/sessions/login")
                .send({
                    email: admin.email,
                    password: admin.password
                })


        adminCookie =
            response.headers["set-cookie"]


        expect(response.statusCode)
            .toBe(200)

    })



    test("Organizer puede crear evento", async () => {


        const response =
            await request(app)
                .post("/api/events")
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({

                    title: "Evento Ticket Test",
                    description: "Evento para probar tickets",
                    category: "workshop",
                    date: "2030-12-20",
                    location: "Montevideo",
                    capacity: 5,
                    price: 100

                })


        expect(response.statusCode)
            .toBe(201)



        eventId =
            response.body.payload._id


        expect(eventId)
            .toBeDefined()

    })



    test("Publicar evento correctamente", async () => {


        const response =
            await request(app)
                .patch(`/api/events/${eventId}/status`)
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({
                    status: "published"
                })


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.payload.status)
            .toBe("published")

    })



    test("Usuario autenticado puede crear ticket", async () => {


        const response =
            await request(app)
                .post(`/api/events/${eventId}/tickets`)
                .set(
                    "Cookie",
                    userCookie
                )
                .send({
                    quantity: 1
                })


        expect(response.statusCode)
            .toBe(201)


        expect(response.body.status)
            .toBe("success")


        expect(response.body.payload)
            .toHaveProperty("_id")


        expect(response.body.payload.status)
            .toBe("confirmed")


        expect(response.body.payload.quantity)
            .toBe(1)


        ticketId =
            response.body.payload._id

    })



    test("Usuario no puede duplicar inscripción activa", async () => {


        const response =
            await request(app)
                .post(`/api/events/${eventId}/tickets`)
                .set(
                    "Cookie",
                    userCookie
                )
                .send({
                    quantity: 1
                })


        expect(response.statusCode)
            .toBe(400)


        expect(response.body.message)
            .toContain(
                "inscripción activa"
            )

    })



    test("Usuario puede consultar sus tickets", async () => {


        const response =
            await request(app)
                .get("/api/tickets/my-tickets")
                .set(
                    "Cookie",
                    userCookie
                )


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.status)
            .toBe("success")


    })



    test("Organizer puede ver tickets de su evento", async () => {


        const response =
            await request(app)
                .get(`/api/events/${eventId}/tickets`)
                .set(
                    "Cookie",
                    organizerCookie
                )


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.status)
            .toBe("success")

    })



    test("Usuario común no puede ver tickets del evento", async () => {


        const response =
            await request(app)
                .get(`/api/events/${eventId}/tickets`)
                .set(
                    "Cookie",
                    userCookie
                )


        expect(response.statusCode)
            .toBe(403)

    })



    test("Usuario puede cancelar su ticket", async () => {


        const response =
            await request(app)
                .patch(`/api/tickets/${ticketId}/cancel`)
                .set(
                    "Cookie",
                    userCookie
                )


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.status)
            .toBe("success")


        expect(response.body.payload.status)
            .toBe("cancelled")


        expect(response.body.payload.cancelledAt)
            .toBeDefined()

    })



    test("Usuario puede volver a ocupar cupo luego de cancelar", async () => {


        const response =
            await request(app)
                .post(`/api/events/${eventId}/tickets`)
                .set(
                    "Cookie",
                    userCookie
                )
                .send({
                    quantity: 1
                })


        expect(response.statusCode)
            .toBe(201)


        expect(response.body.payload.status)
            .toBe("confirmed")

    })



    test("Admin puede cancelar ticket", async () => {


        const ticketResponse =
            await request(app)
                .post(`/api/events/${eventId}/tickets`)
                .set(
                    "Cookie",
                    adminCookie
                )
                .send({
                    quantity: 1
                })


        const response =
            await request(app)
                .patch(
                    `/api/tickets/${ticketResponse.body.payload._id}/cancel`
                )
                .set(
                    "Cookie",
                    adminCookie
                )


        expect(response.statusCode)
            .toBe(200)

    })


})