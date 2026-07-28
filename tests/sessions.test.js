import request from "supertest"
import app from "../src/app.js"
import mongoose from "mongoose"
import connectDB from "../src/config/db.js"


beforeAll(async () => {
    await connectDB()
})


afterAll(async () => {
    await mongoose.connection.close()
})


describe("Sessions authentication", () => {


    const testUser = {
        first_name: "Test",
        last_name: "User",
        email: `test${Date.now()}@email.com`,
        password: "Password123"
    }


    let authCookie


    test("Debe registrar un usuario correctamente", async () => {

        const response = await request(app)
            .post("/api/sessions/register")
            .send(testUser)


        expect(response.statusCode)
            .toBe(201)


        expect(response.body.status)
            .toBe("success")


        expect(response.body.payload)
            .toHaveProperty(
                "email",
                testUser.email
            )


        expect(response.body.payload)
            .not
            .toHaveProperty("password")

    })


    test("No debe permitir registrar email duplicado", async () => {

        const response = await request(app)
            .post("/api/sessions/register")
            .send(testUser)


        expect(response.statusCode)
            .toBe(409)


        expect(response.body.status)
            .toBe("error")

    })


    test("Debe iniciar sesión correctamente", async () => {

        const response = await request(app)
            .post("/api/sessions/login")
            .send({
                email: testUser.email,
                password: testUser.password
            })


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.message)
            .toBe("Login correcto")


        expect(response.headers["set-cookie"])
            .toBeDefined()


        authCookie = response.headers["set-cookie"]

    })


    test("Debe rechazar credenciales incorrectas", async () => {

        const response = await request(app)
            .post("/api/sessions/login")
            .send({
                email: testUser.email,
                password: "PasswordIncorrecta"
            })


        expect(response.statusCode)
            .toBe(401)


        expect(response.body.message)
            .toBe("Credenciales inválidas")

    })


    test("Debe obtener usuario autenticado con current", async () => {

        const response = await request(app)
            .get("/api/sessions/current")
            .set(
                "Cookie",
                authCookie
            )


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.status)
            .toBe("success")


        expect(response.body.payload)
            .toHaveProperty(
                "email",
                testUser.email
            )

    })


    test("Debe cerrar sesión correctamente", async () => {

        const response = await request(app)
            .post("/api/sessions/logout")
            .set(
                "Cookie",
                authCookie
            )


        expect(response.statusCode)
            .toBe(200)


        expect(response.body.status)
            .toBe("success")


        expect(response.headers["set-cookie"])
            .toBeDefined()

    })


})