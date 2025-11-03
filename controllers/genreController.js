import { matchedData, validationResult, body, query } from "express-validator";
import queries from "../db/queries.js";

const validateGenre = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Genre name must exist")
    .isLength({ min: 3 })
    .withMessage("Genre name must be at least 3 letters"),
];

const getAllGenres = async (req, res) => {
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

const getCreateGenre = async (req, res) => {
  res.render("createGenre", { title: "Creating genre", oldData: {} });
};

const postCreateGenre = [
  validateGenre,
  async (req, res) => {
    // const { name } = req.body;
    const errors = validationResult(req);
    const { name } = matchedData(req);

    if (!errors.isEmpty()) {
      return res.render("createGenre", {
        title: "Creating genre",
        oldData: { name },
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    const id = await queries.insertGenre(name);
    res.redirect(`/genres/${id}`);
  },
];

export default {
  getAllGenres,
  getGenreById,
  getCreateGenre,
  postCreateGenre,
};
