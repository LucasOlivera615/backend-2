import Event from "../models/Event.js"

const createEvent = async (eventData) => {

  return await Event.create(eventData)

}

const getAllEvents = async (filters = {}, options = {}) => {

  const page = options.page || 1
  const limit = options.limit || 10
  const skip = (page - 1) * limit

  let sort = {}

  if (options.sort === "date") {
    sort.date = 1
  }

  if (options.sort === "-date") {
    sort.date = -1
  }

  const data = await Event.find(filters)
    .populate("organizer", "first_name last_name email role")
    .sort(sort)
    .skip(skip)
    .limit(limit)

  const total = await Event.countDocuments(filters)

  return {
    data,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  }

}

const getEventById = async (id) => {

  return await Event.findById(id)
    .populate("organizer", "first_name last_name email role")

}

const updateEvent = async (id, updateData) => {

  return await Event.findByIdAndUpdate(
    id,
    updateData,
    {
      new: true,
      runValidators: true
    }
  )

}

export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent
}