const jwt = require("jsonwebtoken");
const express = require("express");
const apiRouter = express.Router();
require("dotenv").config();
const { JWT_SECRET } = process.env;
const { getUserById } = require("../db/users");
apiRouter.use(async (req, res, next) => {
  try {
    console.log("ApiRouter");
    const prefix = "Bearer ";
    const auth = req.header("Authorization");

    if (!auth) {
      // nothing to see here
      next();
    } else if (auth.startsWith(prefix)) {
      const token = auth.slice(prefix.length);

      try {
        const { id } = jwt.verify(token, JWT_SECRET);
        console.log("id", id);
        if (id) {
          req.user = await getUserById(id);
          console.log("req.user", req.user);
          next();
        }
      } catch ({ name, message }) {
        console.log(name, message);
        next({ name, message });
      }
    } else {
      next({
        name: "AuthorizationHeaderError",
        message: `Authorization token must start with ${prefix}`,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

const usersRouter = require("./users");
apiRouter.use("/users", usersRouter);

const activitiesRouter = require("./activities");
apiRouter.use("/activities", activitiesRouter);

const routinesRouter = require("./routines");
apiRouter.use("/routines", routinesRouter);

const routinesActivitiesRouter = require("./routines_activies");
apiRouter.use("/routines_activities", routinesActivitiesRouter);

module.exports = apiRouter;
