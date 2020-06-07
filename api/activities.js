const express = require("express");
const activitiesRouter = express.Router();
const { createActivity, getAllActivities } = require("../db/activities");
const { requireUser } = require("./utils");

activitiesRouter.get("/", async (req, res) => {
  try {
    const allActivities = await getAllActivities();

    res.send({
      allActivities,
    });
  } catch ({ name, message }) {
    next({ name, message });
  }
});

activitiesRouter.post("/activities", requireUser, async (req, res, next) => {
  const { name, description = "" } = req.body;

  const postData = {};

  try {
    postData.authorId = req.user.id;
    postData.name = name;
    postData.description = description;
    const post = await createActivity(name, description);

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

activitiesRouter.patch("/:activityId", requireUser, async (req, res, next) => {
  const { activityId } = req.params;
  const { id, fields } = req.body;

  const updateFields = {};

  try {
    const updatedPost = await updatePost(postId, updateFields);
    res.send({ updatedPost });
  } catch ({ name, message }) {
    next({ name, message });
  }
});
module.exports = activitiesRouter;
