import queries from "../db/queries.js";

const getIndexPage = async (req, res) => {
  let genres = [{ name: "test genre 1" }, { name: " genre 2" }];
  let developers = [{ name: "test dev.1" }, { name: "dev 2" }];
  let games = [{ title: "test game 1" }, { title: "game 2" }];

  const n = 5;

  // genres = await
  genres = await queries.getNGenresByGameCount(n);
  developers = await queries.getNDevelopersByGameCount(n);
  games = await queries.getNGamesByReleaseYear(n);

  res.render("index", { title: "Main page", n, genres, developers, games });
};

export default { getIndexPage };
