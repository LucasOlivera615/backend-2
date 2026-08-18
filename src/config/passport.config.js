import passport from "passport"
import { Strategy as LocalStrategy } from "passport-local"
import {
    Strategy as JwtStrategy,
    ExtractJwt
} from "passport-jwt"

import env from "./env.js"
import sessionsService from "../services/sessions.service.js"


const cookieExtractor = (req) => {

    if (
        req &&
        req.cookies &&
        req.cookies.currentUser
    ) {

        return req.cookies.currentUser

    }

    return null
}

const initializePassport = () => {

    passport.use(
        "register",

        new LocalStrategy(
            {
                usernameField: "email",
                passReqToCallback: true
            },

            async (
                req,
                email,
                password,
                done
            ) => {

                try {

                    const user =
                        await sessionsService.registerUser({
                            first_name:
                                req.body.first_name,

                            last_name:
                                req.body.last_name,

                            email,
                            password
                        })

                    return done(
                        null,
                        user
                    )

                } catch (error) {

                    return done(
                        error
                    )

                }

            }
        )
    )

    passport.use(
        "login",

        new LocalStrategy(
            {
                usernameField: "email"
            },

            async (
                email,
                password,
                done
            ) => {

                try {

                    const user =
                        await sessionsService.authenticateUser(
                            email,
                            password
                        )

                    return done(
                        null,
                        user
                    )

                } catch (error) {

                    return done(
                        error
                    )

                }

            }
        )
    )

    passport.use(
        "current",

        new JwtStrategy(
            {
                jwtFromRequest:
                    ExtractJwt.fromExtractors([
                        cookieExtractor
                    ]),

                secretOrKey:
                    env.JWT_SECRET
            },

            async (
                payload,
                done
            ) => {

                try {

                    return done(
                        null,
                        payload
                    )

                } catch (error) {

                    return done(
                        error,
                        false
                    )

                }

            }
        )
    )

}


export default initializePassport