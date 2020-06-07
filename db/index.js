const { client } = require("../db/client");

module.exports = {
  ...require("./client"),
  ...require("./users"),
  ...require("./activities"),
  ...require("./routines"),
  ...require("./routine_activities"),
};
