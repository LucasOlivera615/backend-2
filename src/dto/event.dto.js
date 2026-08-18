const toEventDTO = (event) => {

    if (!event) {
        return null
    }

    const organizer = event.organizer

    let organizerDTO = null

    if (organizer) {

        organizerDTO = {
            id: organizer._id?.toString() || organizer.id,
            first_name: organizer.first_name,
            last_name: organizer.last_name,
            email: organizer.email,
            role: organizer.role
        }

    }

    return {
        id: event._id?.toString() || event.id,
        title: event.title,
        description: event.description,
        category: event.category,
        date: event.date,
        location: event.location,
        capacity: event.capacity,
        price: event.price,
        status: event.status,
        organizer: organizerDTO
    }

}

export default {
    toEventDTO
}