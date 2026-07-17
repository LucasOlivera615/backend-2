import eventsDao from "../dao/events.dao.js"

const getAllEvents = () => {
  return eventsDao.getAllEvents();
}

export default {
  getAllEvents,
}