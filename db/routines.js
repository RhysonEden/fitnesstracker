const { client } = require("../db/client");

async function getAllRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM routines
    `);
    console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getPublicRoutines() {
  try {
    const { rows } = await client.query(`
      SELECT *
      FROM routines
      WHERE public = true
    `);
    console.log(rows);
    return rows;
  } catch (error) {
    throw error;
  }
}

async function getAllRoutinesByUser(username) {
  try {
    const { routines } = await client.query(`
      SELECT *
      FROM routines
      WHERE id = ${username}
      JOIN routine_activities."routineId" ON routines.id
    `);
    return routines;
  } catch (error) {
    throw error;
  }
}

//not sure if this is right
async function getPublicRoutineActivities(activityId) {
  try {
    const {
      rows: [routine_activity],
    } = await client.query(`
      SELECT *
      FROM routine_activities
        JOIN routines ON routines.id = routine_activities."routineId"
      WHERE routine_activities.id = ${activityId}
    `);
    //console.log(routineIds);
    // TODO Loop over the routineIds and get the routine object by Id where routine is public
    //const routines = await Promise.all(
    // routineIds.map((routine) => getRoutineById(routine))
    //);
    // use Promise.all([ async functions ])
    return routine_activity;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getRoutineById({ routineId }) {
  try {
    const {
      rows: [routine],
    } = await client.query(
      `
      SELECT *
      FROM routines
      WHERE id=$1;
    `,
      [routineId]
    );
    console.log(routine);
    if (!routine) {
      throw {
        name: "RoutineNotFound",
        message: "Could not find a routine with that routineId",
      };
    }

    return routine;
  } catch (error) {
    throw error;
  }
}

async function createRoutine({ creatorId, public, name, goal }) {
  try {
    const {
      rows: [user],
    } = await client.query(
      `
      INSERT INTO routines("creatorId", public, name, goal)
      VALUES($1, $2, $3, $4)
      RETURNING *;
    `,
      [creatorId, public, name, goal]
    );

    return user;
  } catch (error) {
    throw error;
  }
}

//need help here
async function updateRoutine({ id, public, name, goal }) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }

  try {
    const {
      rows: [user],
    } = await client.query(
      `
      UPDATE users
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );

    return user;
  } catch (error) {
    throw error;
  }
}

async function updateRoutineActivities(id, fields) {
  const setString = Object.keys(fields)
    .map((key, index) => `"${key}"=$${index + 1}`)
    .join(", ");

  if (setString.length === 0) {
    return;
  }
  console.log(setString, id);
  try {
    const { rows: routine_activities } = await client.query(
      `
      UPDATE routine_activities
      SET ${setString}
      WHERE id=${id}
      RETURNING *;
    `,
      Object.values(fields)
    );
    console.log(routine_activities);
    return routine_activities;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

// SELECT tags.*
//       FROM tags
//       JOIN post_tags ON tags.id=post_tags."tagId"
//       WHERE post_tags."postId"=$1;

module.exports = {
  getAllRoutines,
  getPublicRoutines,
  getAllRoutinesByUser,
  getPublicRoutineActivities,
  createRoutine,
  updateRoutine,
  updateRoutineActivities,
};
