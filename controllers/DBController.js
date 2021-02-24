const client = require("../DBConnection");

module.exports.deleteDBRoles = async function (request, h) {
  const result = await client.indices.delete({
    index: "roles",
  });
  return result;
};

module.exports.createDBRoles = async function (request, h) {
  const result = await client.indices.create({
    index: "roles",
  });
  return result;
};

module.exports.deleteUserDB = async function (request, h) {
  const result = await client.indices.delete({
    index: "users",
  });
  return result;
};

module.exports.createUserDB = async function (request, h) {
  const result = await client.indices.create({
    index: "users",
  });
  return result;
};

module.exports.createGameDB = async function (request, h) {
  const reuslt = await client.indices.create({
    index: "games",
  });
  return result;
};

module.exports.deleteGamesDB = async function (request, h) {
  const result = await client.indices.delete({
    index: "games",
  });
  return result;
};
