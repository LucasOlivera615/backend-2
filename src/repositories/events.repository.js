import eventsDao from "../dao/events.dao.js"

const getAllEvents = () => {
  return eventsDao.getAllEvents()
}

const createEvent = (eventData) => {
  return eventsDao.createEvent(eventData)
}

const getEventById = (id) => {
  return eventsDao.getEventById(id)
}

const updateEvent = (id, data) => {
  return eventsDao.updateEvent(id, data)
}

export default {
  getAllEvents,
  createEvent,
  getEventById,
  updateEvent
}