const client = require("../DBConnection");
module.exports.getRole = async function (request, h) {
  await client.indices.refresh({ index: "roles" });
  const result = await client
    .get({
      index: "roles",
      id: request.params.id,
    })
    .catch((err) => console.log(err));
  return result.body._source;
};

module.exports.updateRole = async function (request, h) {
  await client
    .index({
      index: "roles",
      id: request.payload.id,
      body: {
        name: request.payload.name,
        description: request.payload.description,
        modules: request.payload.modules,
      },
    })
    .catch((err) => {
      console.log(err.meta);
      return err;
    });

  return { msg: "success" };
};

module.exports.getRolesForUserCreate = async function (request, h) {
  await client.indices.refresh({ index: "roles" });
  let result = client.search({
    index: "roles",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  return (await result).body.hits.hits;
};

module.exports.addRoles = async function (request, h) {
  // return request.payload.modulesData;

  const result = await client.index({
    index: "roles",
    body: {
      name: request.payload.name,
      description: request.payload.description,
      modules: request.payload.modules,
    },
  });
  // console.log(request.payload.data);
  return result;
};

module.exports.getRoles = async function (request, h) {
  await client.indices.refresh({ index: "roles" });
  const result = await client.search({
    index: "roles",
    body: {
      query: {
        match_all: {},
      },
    },
  });

  return result.body.hits.hits;
};

module.exports.deleteRole = async function (request, h) {
  console.log(request.payload.id);
  await client.delete({
    index: "roles",
    type: "_doc",
    id: request.payload.id,
  });
  await client.indices.refresh({ index: "roles" });
  const result = await client.search({
    index: "roles",
    body: {
      query: {
        match_all: {},
      },
    },
  });
  // console.log(result);
  return result.body.hits.hits;
};

module.exports.searchRole = async function (request, h) {
  const result = await client.search({
    index: "roles",
    body: {
      query: {
        wildcard: {
          name: {
            value: "*" + request.payload.searchTerm + "*",
          },
        },
      },
    },
  });
  return result.body.hits.hits;
};
