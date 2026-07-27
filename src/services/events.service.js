import eventsRepository from "../repositories/events.repository.js"

const getAllEvents = () => {
  return eventsRepository.getAllEvents()
}

const createEvent = (eventData) => {

  const {
    title,
    description,
    date,
    location,
    organizer
  } = eventData

  if (!title || !description || !date || !location) {
    const error = new Error("Faltan campos obligatorios del evento")
    error.statusCode = 400
    throw error
  }

  return eventsRepository.createEvent({
    title,
    description,
    date,
    location,
    organizer
  })
}

const updateEvent = (id, data, user) => {

  const event = eventsRepository.getEventById(id)

  if (!event) {
    const error = new Error("Evento no encontrado")
    error.statusCode = 404
    throw error
  }


  const isAdmin = user.role === "admin"

  const isOwner = event.organizer === user.id


  if (!isAdmin && !isOwner) {
    const error = new Error(
      "No tenés permisos para modificar este evento"
    )

    error.statusCode = 403
    throw error
  }


  return eventsRepository.updateEvent(id, data)
}

export default {
  getAllEvents,
  createEvent,
  updateEvent
}