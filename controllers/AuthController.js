const client = require("../DBConnection");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

module.exports.login = async function (request, h) {
  const email = request.payload.email;
  const password = request.payload.password;
  const checkEmail = await client.search({
    index: "users",
    body: {
      query: {
        match_phrase: {
          email,
        },
      },
    },
  });
  if (checkEmail.body.hits.total.value === 1) {
    const id = checkEmail.body.hits.hits[0]._id;
    const data = checkEmail.body.hits.hits[0]._source;
    if (checkEmail.body.hits.hits[0]._source.status === "active") {
      const match = await bcrypt.compare(password, data.password);
      if (match) {
        const token = jwt.sign({ id }, "aa");
        return {
          status: true,
          token,
          type: data.type,
          name: checkEmail.body.hits.hits[0]._source.username,
        };
      } else {
        return { status: false, msg: "Invalid Username or password" };
      }
    } else {
      return { status: false, msg: "User Status is not active" };
    }
  }
  return { status: false, msg: "Invalid Username or password" };
};

module.exports.authorize = async function (request, h) {
  const token = request.payload.token;
  const { id } = jwt.decode(token, "aa");
  await client.indices.refresh({ index: "users" });
  let userData = await client
    .get({
      index: "users",
      id,
    })
    .catch((err) => console.log(err));
  userData = await userData.body._source;
  if (userData.type !== "admin") {
    return { msg: "Unauthorized", status: 401 };
  } else {
    return { status: 200 };
  }
};

module.exports.authorizeUser = async function (request, h) {
  const token = request.payload.token;
  const { id } = jwt.decode(token, "aa");
  await client.indices.refresh({ index: "users" });
  let userData = await client
    .get({
      index: "users",
      id,
    })
    .catch((err) => console.log(err));
  userData = await userData.body._source;
  if (userData.type !== "user") {
    return { msg: "Unauthorized", status: 401 };
  } else {
    return { status: 200 };
  }
};
