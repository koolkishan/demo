const client = require("../DBConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.CreateUser = async function (request, h) {
  const password = await bcrypt.hash(request.payload.password, 10);
  const result = await client.index({
    index: "users",
    body: {
      username: request.payload.username,
      firstName: request.payload.firstName,
      lastName: request.payload.lastName,
      email: request.payload.email,
      password,
      status: request.payload.status,
      type: "admin",
      roles: request.payload.roles,
    },
  });
  return { msg: "success" };
};

module.exports.updateUser = async function (request, h) {
  const password = await bcrypt.hash(request.payload.password, 10);
  await client
    .index({
      index: "users",
      id: request.payload.id,
      body: {
        username: request.payload.username,
        firstName: request.payload.firstName,
        lastName: request.payload.lastName,
        email: request.payload.email,
        password,
        status: request.payload.status,
        type: "admin",
        roles: request.payload.roles,
      },
    })
    .catch((err) => {
      console.log(err.meta);
      return err;
    });

  return { msg: "success" };
};

module.exports.getAllUsers = async function (request, h) {
  await client.indices.refresh({ index: "users" });
  const result = await client.search({
    index: "users",
    body: {
      query: {
        match_all: {},
      },
    },
  });
  return result.body.hits.hits;
};

module.exports.getUser = async function (request, h) {
  await client.indices.refresh({ index: "users" });
  const result = await client
    .get({
      index: "users",
      id: request.params.id,
    })
    .catch((err) => console.log(err));
  return result.body._source;
};

module.exports.deleteUser = async function (request, h) {
  let userData = await client
    .get({
      index: "users",
      id: request.payload.id,
    })
    .catch((err) => console.log(err));
  userData = await userData.body._source;
  console.log(userData);
  if (userData.type === "admin") {
    return { msg: "Admin cannot be deleted", status: 204 };
  } else {
    await client.delete({
      index: "users",
      type: "_doc",
      id: request.payload.id,
    });
    await client.indices.refresh({ index: "users" });
    const result = await client.search({
      index: "users",
      body: {
        query: {
          match_all: {},
        },
      },
    });
    console.log(result.body.hits);
    return result.body.hits.hits;
  }
};

module.exports.getUserData = async function (request, h) {
  const token = request.payload.token;
  const { id } = jwt.decode(token, "a");
  await client.indices.refresh({ index: "users" });
  let userData = await client
    .get({
      index: "users",
      id,
    })
    .catch((err) => console.log(err));
  userData = await userData.body._source;
  const roles = userData.roles;
  const x = [];
  roles.forEach((el) => x.push({ _index: "roles", _id: el.id }));
  const role = client.mget({
    body: {
      docs: x,
    },
  });

  const allRoles = (await role).body.docs;
  let modules = [];
  allRoles.forEach((el) => {
    modules.push(el._source.modules);
  });
  modules = modules.flat(1);
  const dt = [];

  modules.forEach((el) => {
    el.priveleges.forEach((el) => dt.push(el));
  });
  let mainData = [];
  for (let i = 0; i < modules.length; i++) {
    modules[i].data = [];
    for (let j = 0; j < modules[i].priveleges.length; j++) {
      modules[i].data = [...modules[i].data, []];
      for (let k = 0; k < modules[i].priveleges[j].pattern.length; k++) {
        const a = await client.search({
          index: "games",
          body: {
            query: {
              query_string: {
                query: modules[i].priveleges[j].pattern[k].label,
              },
            },
          },
        });
        modules[i].data[j].push({
          data: a,
          p: modules[i].priveleges[j].priveleges,
        });
      }
    }
  }
  return modules;
};

module.exports.searchUser = async function (request, h) {
  const result = await client.search({
    index: "users",
    body: {
      query: {
        query_string: {
          query: "*" + request.payload.searchTerm + "*",
          fields: ["username", "email", "firstName", "lastName"],
        },
      },
    },
  });
  return result.body.hits.hits;
};
