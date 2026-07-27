import crypto from "crypto"

const events = []

const getAllEvents = () => {
  return events
}

const createEvent = (eventData) => {
  const newEvent = {
    id: crypto.randomUUID(),
    ...eventData
  }

  events.push(newEvent)

  return newEvent
}

const getEventById = (id) => {
  return events.find(event => event.id === id)
}

const updateEvent = (id, data) => {
  const eventIndex = events.findIndex(event => event.id === id)

  if (eventIndex === -1) {
    return null
  }

  events[eventIndex] = {
    ...events[eventIndex],
    ...data
  }

  return events[eventIndex]
}

export default {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent
}