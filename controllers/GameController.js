const client = require("../DBConnection");
module.exports.getAllGames = async function (request, h) {
  await client.indices.refresh({ index: "users" });
  const result = await client.search({
    index: "games",
    body: {
      query: {
        match_all: {},
      },
    },
  });
  return result.body.hits.hits;
};

module.exports.insertGameData = async function (request, h) {
  const games = [
    { name: "Assassins Creed" },
    { name: "Prince of persia" },
    { name: "hitman" },
    { name: "Grand Theft Auto" },
    { name: "Minecraft" },
    { name: "Counter Strike" },
    { name: "Chicken Invaders" },
    { name: "Ultimate Ninja Storm" },
    { name: "Dragonball Xenoverse" },
    { name: "Bodukai Tenkachi" },
    { name: "Mystery Legends" },
    { name: "Farm Frenzy" },
    { name: "Among US" },
    { name: "PUBG" },
    { name: "Call of Duty" },
    { name: "Witcher" },
    { name: "Farm Frenzy" },
    { name: "Overwatch" },
    { name: "Forza Horizen" },
    { name: "The Crew" },
    { name: "Need for speed" },
    { name: "Cyberpunk" },
    { name: "Pokemon GO" },
    { name: "Sanandreas" },
    { name: "Doom" },
    { name: "Clash of clans" },
    { name: "Halo" },
    { name: "Far cry" },
    { name: "Tom Clancy" },
    { name: "Apex Legends" },
    { name: "League of legends" },
    { name: "Ben 10" },
    { name: "Candy Crush Saga" },
    { name: "Teris" },
    { name: "Farmville" },
    { name: "City Ville" },
  ];
  const body = games.flatMap((doc) => [{ index: { _index: "games" } }, doc]);
  const { body: bulkResponse } = await client.bulk({
    refresh: true,
    body,
  });
  return body;
};
