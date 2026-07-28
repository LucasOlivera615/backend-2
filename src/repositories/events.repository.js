import eventsDao from "../dao/events.dao.js"

const createEvent = async (eventData) => {

  return await eventsDao.createEvent(eventData)

}

const getAllEvents = async (filters, options) => {

  return await eventsDao.getAllEvents(filters, options)

}

const getEventById = async (id) => {

  return await eventsDao.getEventById(id)

}

const updateEvent = async (id, eventData) => {

  return await eventsDao.updateEvent(id, eventData)

}

export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent
}