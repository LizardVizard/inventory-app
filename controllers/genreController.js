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
    const errors = validationResult(req);
    const { name } = matchedData(req);

    if (!errors.isEmpty()) {
      return res.render("createGenre", {
        title: "Creating genre",
        oldData: { name },
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    try {
      const { id, name: createdName } = await queries.insertGenre(name);
      console.log("Created genre with name: ", createdName, id);
      res.redirect(`/genres/${id}`);
    } catch (error) {
      console.log(error);
    }
  },
];

const getUpdateGenre = async (req, res) => {
  const { id } = req.params;

  try {
    const genre = await queries.getGenreById(id);
    res.render("updateGenre", { title: "Updating genre", genre });
    if (!genre) {
      return res.status(404).render("404", { message: "Genre not found" });
    }
  } catch (error) {
    return res.status(500).render("error", { message: "Server error" });
  }
};

const postUpdateGenre = [
  validateGenre,
  async (req, res) => {
    const errors = validationResult(req);
    const { id } = req.params;
    const { name } = req.body;

    if (!errors.isEmpty()) {
      return res.render("updateGenre", {
        title: "Updating genre",
        genre: { name },
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    await queries.updateGenre(id, name);
    res.redirect(`/genres/${id}`);
  },
];

export default {
  getAllGenres,
  getGenreById,
  getCreateGenre,
  postCreateGenre,
  getUpdateGenre,
  postUpdateGenre,
};
