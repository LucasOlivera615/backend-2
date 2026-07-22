import sessionsService from "../services/sessions.service.js"

const register = async (req, res) => {
  try {
    const user = await sessionsService.registerUser(req.body)

    res.status(201).json({
      status: "success",
      payload: user
    })

  } catch (error) {
    res.status(error.statusCode || 400).json({
      status: "error",
      message: error.message
    })
  }
}

export default {
  register
}