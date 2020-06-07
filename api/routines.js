const express = require("express");
const routinesRouter = express.Router();
const {
  createActivity,
  getAllActivities,
  getPublicRoutines,
  getAllRoutines,
} = require("../db/routines");
const { requireUser } = require("./utils");

routinesRouter.get("/", async (req, res) => {
  try {
    const allRoutines = await getPublicRoutines();
    console.log(allRoutines);
    res.send({
      allRoutines,
    });
  } catch (error) {
    console.log(error);
  }
});

routinesRouter.post("/", requireUser, async (req, res, next) => {
  const { creatorId, public, name, goal = "" } = req.body;

  const postData = {};

  try {
    postData.creatorId = req.user.id;
    postData.pubic = public;
    postData.name = name;
    postData.goal = goal;
    const post = await createRoutine(postData);
    if (post) {
      res.send({ post });
    } else {
      ({
        name: "Missing Post Data",
        message: "Post Data is missing",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.patch("/:routineId", requireUser, async (req, res, next) => {
  const { routineId } = req.params;
  const { id, public, name, goal } = req.body;

  const updateFields = {};

  try {
    const originalPost = await getPublicRoutinesByActivity(routineId);

    if (originalPost.author.id === req.user.id) {
      const updatedPost = await updateRoutine(id, public, name, goal);
      res.send({ post: updatedPost });
    } else {
      next({
        name: "UnauthorizedUserError",
        message: "You cannot update a routine that is not yours",
      });
    }
  } catch ({ name, message }) {
    next({ name, message });
  }
});

routinesRouter.delete("/:routineId", requireUser, async (req, res, next) => {
  try {
    const post = await getAllRoutinesByUser(username);

    if (post && post.author.id === req.user.id) {
      const updatedPost = await deleteRoutine(post.id, { active: false });

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
});
module.exports = routinesRouter;
