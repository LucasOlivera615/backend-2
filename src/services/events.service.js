import eventsRepository from "../repositories/events.repository.js"

const getAllEvents = () => {
  return eventsRepository.getAllEvents()
}

export default {
  getAllEvents,
}