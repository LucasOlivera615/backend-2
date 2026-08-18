import { Router } from "express"
import passport from "passport"
import sessionsController from "../controllers/sessions.controller.js"
import passportCurrent from "../middlewares/passportCurrent.middleware.js"

const router = Router()

router.post(
    "/register",
    (req, res, next) => {

        passport.authenticate(
            "register",
            { session: false },
            (error, user, info) => {

                if (error) {
                    return next(error)
                }

                if (!user) {

                    const authError =
                        new Error(
                            info?.message ||
                            "No se pudo registrar el usuario"
                        )

                    authError.statusCode =
                        info?.statusCode || 400

                    return next(authError)
                }

                req.user = user

                next()
            }
        )(req, res, next)

    },
    sessionsController.register
)

router.post(
    "/login",
    (req, res, next) => {

        passport.authenticate(
            "login",
            { session: false },
            (error, user, info) => {

                if (error) {
                    return next(error)
                }

                if (!user) {

                    const authError =
                        new Error(
                            info?.message ||
                            "Credenciales inválidas"
                        )

                    authError.statusCode =
                        info?.statusCode || 401

                    return next(authError)
                }

                req.user = user

                next()
            }
        )(req, res, next)

    },
    sessionsController.login
)

router.get(
    "/current",
    passportCurrent,
    sessionsController.current
)

router.post(
    "/logout",
    sessionsController.logout
)

export default router