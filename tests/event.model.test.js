import Event from "../src/models/Event.js"


test("Event debe tener los campos requeridos", () => {

    const fields = Event.schema.paths


    expect(fields.title).toBeDefined()
    expect(fields.description).toBeDefined()
    expect(fields.category).toBeDefined()
    expect(fields.date).toBeDefined()
    expect(fields.location).toBeDefined()
    expect(fields.capacity).toBeDefined()
    expect(fields.price).toBeDefined()
    expect(fields.status).toBeDefined()
    expect(fields.organizer).toBeDefined()

})