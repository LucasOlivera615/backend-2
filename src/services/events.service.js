import eventsRepository from "../repositories/events.repository.js"
import AppError from "../utils/AppError.js"


const VALID_STATUS = [
  "draft",
  "published",
  "cancelled",
  "finished"
]


const createEvent = async (eventData, organizerId) => {

  const requiredFields = [
    "title",
    "description",
    "category",
    "location"
  ]


  for (const field of requiredFields) {

    if (!eventData[field]) {

      throw new AppError(
        `El campo ${field} es obligatorio`,
        400
      )

    }

  }


  if (new Date(eventData.date) < new Date()) {

    throw new AppError(
      "No se puede crear un evento con fecha pasada",
      400
    )

  }


  if (
    typeof eventData.capacity !== "number" ||
    eventData.capacity <= 0
  ) {

    throw new AppError(
      "La capacidad debe ser un número mayor a 0",
      400
    )

  }


  if (
    typeof eventData.price !== "number" ||
    eventData.price < 0
  ) {

    throw new AppError(
      "El precio debe ser un número mayor o igual a 0",
      400
    )

  }


  return await eventsRepository.createEvent({

    ...eventData,
    organizer: organizerId,
    status: "draft"

  })

}



const getAllEvents = async (query) => {


  const {
    status,
    category,
    location,
    dateFrom,
    dateTo,
    page = 1,
    limit = 10,
    sort

  } = query


  const filters = {}


  if (status)
    filters.status = status


  if (category)
    filters.category = category


  if (location)
    filters.location = location



  if (dateFrom || dateTo) {

    filters.date = {}


    if (dateFrom)
      filters.date.$gte = new Date(dateFrom)


    if (dateTo)
      filters.date.$lte = new Date(dateTo)

  }



  const options = {

    page: Number(page),
    limit: Number(limit),
    sort

  }


  return await eventsRepository.getAllEvents(
    filters,
    options
  )

}



const getEventById = async (id) => {


  const event =
    await eventsRepository.getEventById(id)


  if (!event) {

    throw new AppError(
      "Evento no encontrado",
      404
    )

  }


  return event

}



const validateOwnership = (event, user) => {


  const organizerId =
    event.organizer._id
      ? event.organizer._id.toString()
      : event.organizer.toString()



  const isOwner =
    organizerId === user.id


  const isAdmin =
    user.role === "admin"



  if (!isOwner && !isAdmin) {

    throw new AppError(
      "No autorizado",
      403
    )

  }

}



const updateEvent = async (id, data, user) => {


  const event =
    await eventsRepository.getEventById(id)



  if (!event) {

    throw new AppError(
      "Evento no encontrado",
      404
    )

  }



  if (event.status === "cancelled") {

    throw new AppError(
      "Un evento cancelado no puede modificarse",
      400
    )

  }



  validateOwnership(event, user)



  if (
    data.date &&
    new Date(data.date) < new Date()
  ) {

    throw new AppError(
      "La fecha no puede ser pasada",
      400
    )

  }



  if (
    data.capacity !== undefined &&
    (
      typeof data.capacity !== "number" ||
      data.capacity <= 0
    )
  ) {

    throw new AppError(
      "La capacidad debe ser un número mayor a 0",
      400
    )

  }



  if (
    data.price !== undefined &&
    (
      typeof data.price !== "number" ||
      data.price < 0
    )
  ) {

    throw new AppError(
      "El precio debe ser un número mayor o igual a 0",
      400
    )

  }



  delete data.status
  delete data.organizer
  delete data._id
  delete data.id



  return await eventsRepository.updateEvent(
    id,
    data
  )

}



const updateStatus = async (id, status, user) => {


  const event =
    await eventsRepository.getEventById(id)



  if (!event) {

    throw new AppError(
      "Evento no encontrado",
      404
    )

  }



  validateOwnership(event, user)



  if (!status) {

    throw new AppError(
      "Debe enviar un estado",
      400
    )

  }



  if (!VALID_STATUS.includes(status)) {

    throw new AppError(
      "Estado inválido",
      400
    )

  }



  if (event.status === "cancelled") {

    throw new AppError(
      "Un evento cancelado no puede cambiar de estado",
      400
    )

  }



  if (
    status === "published" &&
    event.status === "finished"
  ) {

    throw new AppError(
      "No se puede publicar un evento finalizado",
      400
    )

  }



  if (
    status === "published" &&
    event.date < new Date()
  ) {

    throw new AppError(
      "No se puede publicar un evento cuya fecha ya pasó",
      400
    )

  }



  return await eventsRepository.updateEvent(
    id,
    {
      status
    }
  )

}

export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  updateStatus
}