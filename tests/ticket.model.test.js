import Ticket from "../src/models/Ticket.js"

describe("Modelo Ticket", () => {

    test("Debe cargar correctamente", () => {

        expect(Ticket).toBeDefined()
        expect(Ticket.modelName).toBe("Ticket")

    })

})