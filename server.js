const Hapi = require("@hapi/hapi");

const RoleController = require("./controllers/RoleController");
const UserController = require("./controllers/UserController");
const DBController = require("./controllers/DBController");
const GameController = require("./controllers/GameController");
const AuthController = require("./controllers/AuthController");

const init = async () => {
  const server = Hapi.server({
    port: 3200,
    host: "0.0.0.0",
  });

  await server.start();
  console.log("Server running on %s", server.info.uri);

  //DB ROUTES
  server.route({
    method: "GET",
    path: "/createGamesDB",
    options: {
      cors: true,
      handler: DBController.createGameDB,
    },
  });

  server.route({
    method: "POST",
    path: "/createDB",
    handler: DBController.createUserDB,
  });

  server.route({
    method: "POST",
    path: "/deleteDB",
    handler: DBController.deleteUserDB,
  });

  server.route({
    method: "POST",
    path: "/createDBRoles",
    handler: DBController.createDBRoles,
  });

  server.route({
    method: "DELETE",
    path: "/deleteDBGames",
    handler: DBController.deleteGamesDB,
  });

  server.route({
    method: "POST",
    path: "/deleteDBRoles",
    handler: DBController.deleteDBRoles,
  });

  //AUth Routes

  server.route({
    method: "POST",
    path: "/login",
    options: {
      cors: true,
      handler: AuthController.login,
    },
  });

  //ROles ROutes

  server.route({
    method: "PATCH",
    path: "/updateRole",
    options: {
      cors: true,
      handler: RoleController.updateRole,
    },
  });

  server.route({
    method: "GET",
    path: "/getRolesForCreateUser",
    options: {
      cors: true,
      handler: RoleController.getRolesForUserCreate,
    },
  });

  server.route({
    method: "GET",
    path: "/getRole/{id}",
    options: {
      cors: true,
      handler: RoleController.getRole,
    },
  });

  server.route({
    method: "POST",
    path: "/addRoles",
    options: {
      cors: true,
      handler: RoleController.addRoles,
    },
  });

  server.route({
    method: "GET",
    path: "/getRoles",
    options: {
      cors: true,
      handler: RoleController.getRoles,
    },
  });

  server.route({
    method: "POST",
    path: "/searchRoles",
    options: {
      cors: true,
      handler: RoleController.searchRole,
    },
  });

  server.route({
    method: "DELETE",
    path: "/deleteRoles",
    options: {
      cors: true,
      handler: RoleController.deleteRole,
    },
  });

  //Users Routes

  server.route({
    method: "GET",
    path: "/getUser/{id}",
    options: {
      cors: true,
      handler: UserController.getUser,
    },
  });

  server.route({
    method: "PATCH",
    path: "/updateUser",
    options: {
      cors: true,
      handler: UserController.updateUser,
    },
  });

  server.route({
    method: "POST",
    path: "/searchUsers",
    options: {
      cors: true,
      handler: UserController.searchUser,
    },
  });

  server.route({
    method: "DELETE",
    path: "/deleteUser",
    options: {
      cors: true,
      handler: UserController.deleteUser,
    },
  });

  //Games Routes

  server.route({
    method: "GET",
    path: "/insertGameData",
    options: {
      cors: true,
      handler: GameController.insertGameData,
    },
  });

  server.route({
    method: "GET",
    path: "/getGames",
    options: {
      cors: true,
      handler: GameController.getAllGames,
    },
  });

  server.route({
    method: "POST",
    path: "/getUsers",
    options: {
      cors: true,
      handler: UserController.getAllUsers,
    },
  });

  server.route({
    method: "POST",
    path: "/getUserData",
    options: {
      cors: true,
      handler: UserController.getUserData,
    },
  });

  server.route({
    method: "POST",
    path: "/createUser",
    options: {
      cors: true,
      handler: UserController.CreateUser,
    },
  });

  server.route({
    method: "POST",
    path: "/authorize",
    options: {
      cors: true,
      handler: AuthController.authorize,
    },
  });

  server.route({
    method: "POST",
    path: "/authorizeUser",
    options: {
      cors: true,
      handler: AuthController.authorizeUser,
    },
  });

  process.on("unhandledRejection", (err) => {
    console.log(err);
    process.exit(1);
  });
};
init();
