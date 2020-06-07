const { getAllRoutines, getUserById, createRoutine } = require("../db/index");

const { client } = require("../db/client");

const { createUser, getAllUsers, updateUser } = require("../db/users");

const { addActivityToRoutine } = require("../db/routine_activities");

const {
  createActivity,
  getAllActivities,
  updateActivity,
} = require("../db/activities");

require("../db");

async function dropTables() {
  try {
    await client.query(`
     DROP TABLE IF EXISTS routine_activities;
      DROP TABLE IF EXISTS routines;
      DROP TABLE IF EXISTS users;
      DROP TABLE IF EXISTS activities;
    `);
  } catch (error) {
    throw error;
  }
}

async function createIntialActivity() {
  try {
    await createActivity({
      name: "Jumping Jacks",
      description: "You should know this from school already",
    });
    await createActivity({
      name: "pushups",
      description: "Use your arms to push yourself up while laying face down",
    });
    await createActivity({
      name: "Running in place",
      description: "Its running in place, what more do you need",
    });
  } catch (error) {
    throw error;
  }
}
async function createIntialRoutineActivity() {
  try {
    await addActivityToRoutine({
      routineId: 1,
      activityId: 1,
      count: 5,
      duration: 5,
    });
    await addActivityToRoutine({
      routineId: 2,
      activityId: 2,
      count: 7,
      duration: 15,
    });
    await addActivityToRoutine({
      routineId: 3,
      activityId: 3,
      count: 15,
      duration: 10,
    });
  } catch (error) {
    throw error;
  }
}

async function createInitialRoutines() {
  try {
    const [albert, sandra, glamgal] = await getAllUsers();

    await createRoutine({
      creatorId: albert.id,
      public: true,
      name: "First Post",
      goal: "To get fit",
    });
    await createRoutine({
      creatorId: sandra.id,
      public: true,
      name: "Second Post",
      goal: "To lose weight",
    });
    await createRoutine({
      creatorId: glamgal.id,
      public: true,
      name: "Third Post",
      goal: "To feel healthy",
    });
    await createRoutine({
      creatorId: glamgal.id,
      public: false,
      name: "Fourth Post",
      goal: "If you see this, the hamsters failed.",
    });
  } catch (error) {
    throw error;
  }
}

async function createTables() {
  try {
    console.log("Starting to build tables...");

    await client.query(`
      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL
      );
        CREATE TABLE routines (
        id SERIAL PRIMARY KEY,
        "creatorId" INTEGER REFERENCES users(id),
        public BOOLEAN DEFAULT false,
        name VARCHAR(255) UNIQUE NOT NULL,
        goal TEXT NOT NULL
      );
       CREATE TABLE activities (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        description VARCHAR(255) NOT NULL
      );
      CREATE TABLE routine_activities (
        id SERIAL PRIMARY KEY,
        "routineId" INTEGER REFERENCES routines(id),
        "activityId" INTEGER REFERENCES activities(id),
        duration INTEGER,
        count INTEGER,
        UNIQUE ("routineId", "activityId")
       );

    `);
    console.log("Finished building tables!");
  } catch (error) {
    console.error("Error building tables!");
    throw error;
  }
}

async function createInitialUsers() {
  try {
    console.log("Starting to create users...");

    await createUser({ username: "albert", password: "bertie99" });
    await createUser({ username: "sandra", password: "2sandy4me" });
    await createUser({ username: "glamgal", password: "soglam" });

    console.log("Finished creating users!");
  } catch (error) {
    console.error("Error creating users!");
    throw error;
  }
}

async function rebuildDB() {
  try {
    client.connect();

    await dropTables();
    await createTables();
    await createInitialUsers();
    await createIntialActivity();
    await createInitialRoutines();
    await createIntialRoutineActivity();
  } catch (error) {
    throw error;
  }
}

async function testDB() {
  try {
    console.log("Starting to test database...");

    console.log("Calling getAllUsers");
    const users = await getAllUsers();
    console.log("Result:", users);

    console.log("Calling updateUser on users[0]");
    const updateUserResult = await updateUser(users[0].id, {
      password: "Newname",
    });
    console.log("Result:", updateUserResult);

    console.log("Calling getAllRoutines");
    const routines = await getAllRoutines();
    console.log("Result:", routines);

    // console.log("Calling updatePost on posts[0]");
    // const updatePostResult = await updatePost(posts[0].id, {
    //   title: "New Title",
    //   content: "Updated Content",
    // });
    // console.log("Result:", updatePostResult);

    console.log("Calling getUserById with 1");
    const albert = await getUserById(1);
    console.log("Result:", albert);

    console.log("Calling getUserById with 2");
    const sandra = await getUserById(2);
    console.log("Result:", sandra);

    console.log("Calling getUserById with 3");
    const glamgal = await getUserById(3);
    console.log("Result:", glamgal);

    console.log("Calling getAllActivites");
    const activities = await getAllActivities();
    console.log("Result:", activities);

    console.log("Finished database tests!");
  } catch (error) {
    console.log("Error during testDB");
    throw error;
  }
}

rebuildDB()
  .then(testDB)
  .catch(console.error)
  .finally(() => client.end());
