import request from "supertest"
import app from "../src/app.js"
import mongoose from "mongoose"
import connectDB from "../src/config/db.js"
import User from "../src/models/User.js"
import Event from "../src/models/Event.js"


beforeAll(async () => {
    await connectDB()
})


afterAll(async () => {

    await User.deleteMany({
        email: {
            $regex: "@testevents.com"
        }
    })

    await Event.deleteMany({})

    await mongoose.connection.close()

})


describe("Events API", () => {


    let organizerCookie
    let adminCookie
    let userCookie
    let secondOrganizerCookie

    let organizerId
    let userId
    let eventId
    let secondEventId



    const organizer = {
        first_name: "Organizer",
        last_name: "Test",
        email: `organizer${Date.now()}@testevents.com`,
        password: "Password123"
    }


    const normalUser = {
        first_name: "User",
        last_name: "Test",
        email: `user${Date.now()}@testevents.com`,
        password: "Password123"
    }


    const admin = {
        first_name: "Admin",
        last_name: "Test",
        email: `admin${Date.now()}@testevents.com`,
        password: "Password123"
    }



    test("Crear usuarios de prueba", async () => {


        const organizerResponse =
            await request(app)
                .post("/api/sessions/register")
                .send(organizer)


        organizerId =
            organizerResponse.body.payload._id


        await User.findByIdAndUpdate(
            organizerId,
            {
                role: "organizer"
            }
        )



        const userResponse =
            await request(app)
                .post("/api/sessions/register")
                .send(normalUser)


        userId =
            userResponse.body.payload._id



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


        expect(organizerId)
            .toBeDefined()

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



    test("Login user", async () => {


        const response =
            await request(app)
                .post("/api/sessions/login")
                .send({
                    email: normalUser.email,
                    password: normalUser.password
                })


        userCookie =
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



    test("Crear segundo organizer de prueba", async () => {


        const secondOrganizer = {
            first_name: "Second",
            last_name: "Organizer",
            email: `second${Date.now()}@testevents.com`,
            password: "Password123"
        }



        const registerResponse =
            await request(app)
                .post("/api/sessions/register")
                .send(secondOrganizer)



        await User.findByIdAndUpdate(
            registerResponse.body.payload._id,
            {
                role: "organizer"
            }
        )



        const loginResponse =
            await request(app)
                .post("/api/sessions/login")
                .send({
                    email: secondOrganizer.email,
                    password: secondOrganizer.password
                })


        secondOrganizerCookie =
            loginResponse.headers["set-cookie"]


        expect(loginResponse.statusCode)
            .toBe(200)

    })



    test("Organizer puede crear un evento", async () => {


        const response =
            await request(app)
                .post("/api/events")
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({

                    title: "Workshop Backend",
                    description: "Curso avanzado",
                    category: "workshop",
                    date: "2030-12-31",
                    location: "Montevideo",
                    capacity: 50,
                    price: 100

                })


        expect(response.statusCode)
            .toBe(201)


        expect(response.body.payload)
            .toHaveProperty(
                "status",
                "draft"
            )


        eventId =
            response.body.payload._id

    })



    test("Segundo organizer crea su evento", async () => {


        const response =
            await request(app)
                .post("/api/events")
                .set(
                    "Cookie",
                    secondOrganizerCookie
                )
                .send({

                    title: "Evento segundo organizer",
                    description: "Evento privado",
                    category: "workshop",
                    date: "2030-12-31",
                    location: "Montevideo",
                    capacity: 30,
                    price: 50

                })


        expect(response.statusCode)
            .toBe(201)


        secondEventId =
            response.body.payload._id

    })



    test("Usuario normal no puede crear eventos", async () => {


        const response =
            await request(app)
                .post("/api/events")
                .set(
                    "Cookie",
                    userCookie
                )
                .send({

                    title: "Evento ilegal",
                    description: "Test",
                    category: "workshop",
                    date: "2030-01-01",
                    location: "Montevideo",
                    capacity: 20,
                    price: 0

                })


        expect(response.statusCode)
            .toBe(403)

    })



    test("No permite crear evento con fecha pasada", async () => {


        const response =
            await request(app)
                .post("/api/events")
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({

                    title: "Evento viejo",
                    description: "Test",
                    category: "workshop",
                    date: "1999-01-01",
                    location: "Montevideo",
                    capacity: 20,
                    price: 0

                })


        expect(response.statusCode)
            .toBe(400)

    })



    test("No permite capacity menor o igual a cero", async () => {


        const response =
            await request(app)
                .post("/api/events")
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({

                    title: "Evento inválido",
                    description: "Test",
                    category: "workshop",
                    date: "2030-01-01",
                    location: "Montevideo",
                    capacity: 0,
                    price: 0

                })


        expect(response.statusCode)
            .toBe(400)

    })



    test("GET /api/events permite filtros y paginación", async () => {


        const response =
            await request(app)
                .get(
                    "/api/events?status=draft&category=workshop&page=1&limit=5"
                )


        expect(response.statusCode)
            .toBe(200)


        expect(response.body)
            .toHaveProperty("data")


        expect(response.body)
            .toHaveProperty("totalPages")

    })



    test("Consulta evento inexistente devuelve 404", async () => {


        const response =
            await request(app)
                .get(
                    "/api/events/000000000000000000000000"
                )


        expect(response.statusCode)
            .toBe(404)

    })



    test("Organizer puede modificar su propio evento", async () => {


        const response =
            await request(app)
                .put(`/api/events/${eventId}`)
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({
                    title: "Workshop actualizado"
                })


        expect(response.statusCode)
            .toBe(200)

    })



    test("Organizer no puede modificar evento ajeno", async () => {


        const response =
            await request(app)
                .put(`/api/events/${secondEventId}`)
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({
                    title: "Cambio ilegal"
                })


        expect(response.statusCode)
            .toBe(403)


        expect(response.body.message)
            .toBe("No autorizado")

    })



    test("Admin puede modificar evento de otro organizer", async () => {


        const response =
            await request(app)
                .put(`/api/events/${secondEventId}`)
                .set(
                    "Cookie",
                    adminCookie
                )
                .send({
                    title: "Evento modificado por admin"
                })


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.payload.title)
            .toBe("Evento modificado por admin")

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



    test("Cancelar evento correctamente", async () => {


        const response =
            await request(app)
                .patch(`/api/events/${eventId}/status`)
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({
                    status: "cancelled"
                })


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.payload.status)
            .toBe("cancelled")

    })



    test("Evento cancelado no puede modificarse", async () => {


        const response =
            await request(app)
                .put(`/api/events/${eventId}`)
                .set(
                    "Cookie",
                    organizerCookie
                )
                .send({
                    title: "Cambio ilegal"
                })


        expect(response.statusCode)
            .toBe(400)


        expect(response.body.message)
            .toBe(
                "Un evento cancelado no puede modificarse"
            )

    })


})