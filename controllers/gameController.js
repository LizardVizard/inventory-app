import queries from "../db/queries.js";

const getGameById = async (req, res) => {
  const { id } = req.params;
  const game = await queries.getGameById(id);

  let gameFound = false;
  let genres = [];
  let developer = {};

  if (game) {
    gameFound = true;
    genres = await queries.getGenresByGameId(id);
    developer = await queries.getDeveloperById(game.developer_id);
  }

  res.render("game", {
    title: `Game ${game?.title || "not found"}`,
    gameFound,
    game,
    genres,
    developer,
  });
};

export default { getGameById };
