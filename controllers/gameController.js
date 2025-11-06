import { matchedData, body, validationResult } from "express-validator";
import queries from "../db/queries.js";

const validateGame = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Game must have title")
    .isLength({ min: 1 })
    .withMessage("Title must have at least 1 character"),

  body("genres.*").isNumeric(),

  body("developerId").notEmpty().withMessage("Select a developer"),

  body("releaseYear")
    .optional()
    .isNumeric()
    .withMessage("Release year should be numeric"),
];

const getAllGames = async (req, res) => {
  let games = [];
  let gamesFound = false;

  games = await queries.getAllGames();

  if (games.length) {
    gamesFound = true;
  }

  res.render("games", { title: "All games", gamesFound, games });
};

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

const getCreateGame = async (req, res) => {
  const [genres, developers] = await Promise.all([
    await queries.getAllGenres(),
    await queries.getAllDevelopers(),
  ]);

  res.render("createGame", {
    title: "Create game",
    oldData: {},
    genres,
    developers,
  });
};

const postCreateGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);
    const { title, releaseYear } = matchedData(req, { onlyValidData: false });

    if (!errors.isEmpty()) {
      const [genres, developers] = await Promise.all([
        await queries.getAllGenres(),
        await queries.getAllDevelopers(),
      ]);
      return res.render("createGame", {
        title: "Create game",
        genres,
        developers,
        oldData: { title, releaseYear },
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    const { developerId } = req.body;

    const game = await queries.insertGame({ title, developerId, releaseYear });
    const genres = req.body.genres;

    await queries.insertGameGenres(game.id, genres);

    res.redirect(`/games/${game.id}`);
  },
];

export default { getAllGames, getGameById, getCreateGame, postCreateGame };
