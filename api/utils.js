function requireUser(req, res, next) {
  // console.log("this is the request", req);
  // console.log("this is req.user", req.user);
  if (!req.user) {
    console.log("Something", req.user);
    next({
      name: "MissingUserError",
      message: "You must be logged in to perform this action",
    });
  }

  next();
}

module.exports = {
  requireUser,
};
