import eventsRepository from "../repositories/events.repository.js"
import EventDTO from "../dto/event.dto.js"
import AppError from "../utils/AppError.js"


const VALID_STATUS = [
  "draft",
  "published",
  "cancelled",
  "finished"
]


const createEvent = async (
  eventData,
  organizerId
) => {

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

  const eventDate =
    new Date(eventData.date)

  if (isNaN(eventDate.getTime())) {

    throw new AppError(
      "La fecha del evento no es válida",
      400
    )

  }

  if (eventDate < new Date()) {

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

  const event =
    await eventsRepository.createEvent({
      ...eventData,
      organizer: organizerId,
      status: "draft"
    })

  return EventDTO.toEventDTO(event)

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


  if (status) {

    filters.status = status

  }


  if (category) {

    filters.category = category

  }


  if (location) {

    filters.location = location

  }


  if (dateFrom || dateTo) {

    filters.date = {}


    if (dateFrom) {

      const parsedDateFrom =
        new Date(dateFrom)

      if (
        isNaN(
          parsedDateFrom.getTime()
        )
      ) {

        throw new AppError(
          "La fecha inicial no es válida",
          400
        )

      }

      filters.date.$gte =
        parsedDateFrom

    }


    if (dateTo) {

      const parsedDateTo =
        new Date(dateTo)

      if (
        isNaN(
          parsedDateTo.getTime()
        )
      ) {

        throw new AppError(
          "La fecha final no es válida",
          400
        )

      }

      filters.date.$lte =
        parsedDateTo

    }

  }


  const parsedPage =
    Number(page)

  const parsedLimit =
    Number(limit)


  if (
    !Number.isInteger(parsedPage) ||
    parsedPage < 1
  ) {

    throw new AppError(
      "El número de página no es válido",
      400
    )

  }


  if (
    !Number.isInteger(parsedLimit) ||
    parsedLimit < 1
  ) {

    throw new AppError(
      "El límite de resultados no es válido",
      400
    )

  }


  const options = {
    page: parsedPage,
    limit: parsedLimit,
    sort
  }


  const result =
    await eventsRepository.getAllEvents(
      filters,
      options
    )


  return {
    ...result,
    data: result.data.map(
      event => EventDTO.toEventDTO(event)
    )
  }

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


  return EventDTO.toEventDTO(event)

}


const validateOwnership = (
  event,
  user
) => {

  const organizerId =
    event.organizer?._id
      ? event.organizer._id.toString()
      : event.organizer?.toString()


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


const updateEvent = async (
  id,
  data,
  user
) => {

  const event =
    await eventsRepository.getEventById(id)


  if (!event) {

    throw new AppError(
      "Evento no encontrado",
      404
    )

  }


  if (
    event.status === "cancelled"
  ) {

    throw new AppError(
      "Un evento cancelado no puede modificarse",
      400
    )

  }


  validateOwnership(
    event,
    user
  )


  if (data.date !== undefined) {

    const eventDate =
      new Date(data.date)


    if (
      isNaN(
        eventDate.getTime()
      )
    ) {

      throw new AppError(
        "La fecha del evento no es válida",
        400
      )

    }


    if (eventDate < new Date()) {

      throw new AppError(
        "La fecha no puede ser pasada",
        400
      )

    }

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


  const updateData = {
    ...data
  }


  delete updateData.status
  delete updateData.organizer
  delete updateData._id
  delete updateData.id


  const updatedEvent =
    await eventsRepository.updateEvent(
      id,
      updateData
    )


  return EventDTO.toEventDTO(
    updatedEvent
  )

}


const updateStatus = async (
  id,
  status,
  user
) => {

  const event =
    await eventsRepository.getEventById(id)


  if (!event) {

    throw new AppError(
      "Evento no encontrado",
      404
    )

  }


  validateOwnership(
    event,
    user
  )


  if (!status) {

    throw new AppError(
      "Debe enviar un estado",
      400
    )

  }


  if (
    !VALID_STATUS.includes(status)
  ) {

    throw new AppError(
      "Estado inválido",
      400
    )

  }


  if (
    event.status === "cancelled"
  ) {

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


  const updatedEvent =
    await eventsRepository.updateEvent(
      id,
      {
        status
      }
    )


  return EventDTO.toEventDTO(
    updatedEvent
  )

}


export default {
  createEvent,
  getAllEvents,
  getEventById,
  updateEvent,
  updateStatus
}