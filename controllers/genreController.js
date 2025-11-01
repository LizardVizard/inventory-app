import queries from "../db/queries.js";

const getAllGenres = async (req, res) => {
  console.log("ALL GENRES");
  const genres = await queries.getAllGenres();

  res.render("genres", { title: "All genres", genres });
};

const getGenreById = async (req, res) => {
  const { id } = req.params;
  const genre = await queries.getGenreById(id);

  let games = [];
  let genreFound = false;

  if (genre) {
    genreFound = true;
    games = await queries.getGamesByGenreId(id);
  }

  res.render("genre", {
    title: `Genre ${genre?.name || "not found"}`,
    genreFound,
    genre: genre,
    games,
  });
};

export default {
  getAllGenres,
  getGenreById,
};
