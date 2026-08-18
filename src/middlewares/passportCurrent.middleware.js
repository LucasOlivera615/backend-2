import passport from "passport"

const passportCurrent = (req, res, next) => {

  passport.authenticate(
    "current",
    { session: false },
    (error, user) => {

      if (error) {
        return next(error)
      }

      if (!user) {

        const authError =
          new Error("No autenticado")

        authError.statusCode = 401

        return next(authError)
      }

      req.user = user

      next()
    }
  )(req, res, next)

}

export default passportCurrent