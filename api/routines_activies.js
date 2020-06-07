const express = require("express");
const routinesActivitiesRouter = express.Router();
const { requireUser } = require("./utils");
const {
  updateRoutineActivities,
  getPublicRoutineActivities,
  updateRoutineActivity,
} = require("../db/routines");

routinesActivitiesRouter.patch(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    const { routineActivityId } = req.params;

    try {
      console.log(req.user.id);
      const routine_activities = await getPublicRoutineActivities(
        routineActivityId
      );
      console.log("something else", routine_activities);
      if (routine_activities.creatorId === req.user.id) {
        console.log("tst");
        const updatedPost = await updateRoutineActivities(
          routineActivityId,
          req.body
        );
        res.send({ post: updatedPost });
      } else {
        next({
          name: "UnauthorizedUserError",
          message: "You cannot update a routine that is not yours",
        });
      }
    } catch ({ name, message }) {
      console.log(name, message);
      next({ name, message });
    }
  }
);

routinesActivitiesRouter.delete(
  "/:routineActivityId",
  requireUser,
  async (req, res, next) => {
    try {
      const post = await getPublicRoutinesByActivity(routineId);

      if (post && post.author.id === req.user.id) {
        const updatedPost = await updateRoutineActivity(post.id, {
          active: false,
        });

        res.send({ post: updatedPost });
      } else {
        next(
          post
            ? {
                name: "UnauthorizedUserError",
                message: "You cannot delete a post which is not yours",
              }
            : {
                name: "PostNotFoundError",
                message: "That post does not exist",
              }
        );
      }
    } catch ({ name, message }) {
      next({ name, message });
    }
  }
);

module.exports = routinesActivitiesRouter;
