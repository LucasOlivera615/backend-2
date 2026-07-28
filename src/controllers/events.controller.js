import eventsService from "../services/events.service.js"



const createEvent = async (req, res) => {

    try {

        const event =
            await eventsService.createEvent(
                req.body,
                req.user.id
            )


        return res.status(201).json({
            status: "success",
            payload: event
        })


    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({

            status: "error",
            message: error.message

        })

    }

}



const getAllEvents = async (req, res) => {

    try {

        const result =
            await eventsService.getAllEvents(
                req.query
            )


        return res.status(200).json({

            status: "success",
            data: result.data,
            page: result.page,
            limit: result.limit,
            total: result.total,
            totalPages: result.totalPages

        })


    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({

            status: "error",
            message: error.message

        })

    }

}



const getEventById = async (req, res) => {

    try {

        const event =
            await eventsService.getEventById(
                req.params.id
            )


        return res.status(200).json({

            status: "success",
            payload: event

        })


    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({

            status: "error",
            message: error.message

        })

    }

}



const updateEvent = async (req, res) => {

    try {

        const event =
            await eventsService.updateEvent(
                req.params.id,
                req.body,
                req.user
            )


        return res.status(200).json({

            status: "success",
            payload: event

        })


    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({

            status: "error",
            message: error.message

        })

    }

}



const updateStatus = async (req, res) => {

    try {

        const event =
            await eventsService.updateStatus(
                req.params.id,
                req.body.status,
                req.user
            )


        return res.status(200).json({

            status: "success",
            payload: event

        })


    } catch (error) {

        return res.status(
            error.statusCode || 500
        ).json({

            status: "error",
            message: error.message

        })

    }

}



export default {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    updateStatus
}