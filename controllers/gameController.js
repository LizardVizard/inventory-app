import { matchedData, body, validationResult } from "express-validator";
import queries from "../db/queries.js";

const validateGame = [
  body("title")
    .trim()
    .notEmpty()
    .withMessage("Game must have title")
    .isLength({ min: 1 })
    .withMessage("Title must have at least 1 character"),

  // body("selectedGenres.*")
  //   .isArray()
  //   .isNumeric()
  //   .withMessage("Genres ids should be integer"),

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
    const { title, releaseYear, selectedGenres } = matchedData(req, {
      onlyValidData: false,
    });

    if (!errors.isEmpty()) {
      const [genres, developers] = await Promise.all([
        await queries.getAllGenres(),
        await queries.getAllDevelopers(),
      ]);
      return res.render("createGame", {
        title: "Create game",
        genres,
        developers,
        selectedGenres,
        oldData: { title, releaseYear },
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    const { developerId } = req.body;

    const game = await queries.insertGame({ title, developerId, releaseYear });

    await queries.insertGameGenres(game.id, selectedGenres);

    res.redirect(`/games/${game.id}`);
  },
];

const getUpdateGame = async (req, res) => {
  const id = Number(req.params.id);
  const [game, gameGenres, genres, developers] = await Promise.all([
    queries.getGameById(id),
    queries.getGenresByGameId(id),
    queries.getAllGenres(),
    queries.getAllDevelopers(),
  ]);

  if (!game) {
    return res
      .status(404)
      .render("404", { title: "Page not found", message: "Game not found" });
  }

  return res.render("updateGame", {
    title: `Updating ${game.title} game`,
    game,
    selectedGenres: gameGenres.map((gameGenre) => gameGenre.id),
    genres,
    developers,
  });
};

const postUpdateGame = [
  validateGame,
  async (req, res) => {
    const errors = validationResult(req);

    const id = Number(req.params.id);
    const { title, developerId, releaseYear } = matchedData(req);
    const inputGenres = req.body.selectedGenres;
    const selectedGenres = !inputGenres
      ? []
      : Array.isArray(inputGenres)
        ? inputGenres.map(Number)
        : [Number(inputGenres)];

    if (!errors.isEmpty()) {
      const game = {
        title,
        developer_id: Number(developerId),
        release_year: releaseYear,
      };
      const [genres, developers] = await Promise.all([
        queries.getAllGenres(),
        queries.getAllDevelopers(),
      ]);

      return res.render("updateGame", {
        title: "Updating game",
        game,
        genres,
        developers,
        selectedGenres,
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    try {
      await queries.updateGame({
        id,
        title,
        developerId,
        releaseYear,
        genres: selectedGenres,
      });
      return res.redirect(`/games/${id}`);
    } catch (error) {
      console.error(error);
      return res.status(500).render("error", { message: "Server error" });
    }
  },
];

const getDeleteGame = async (req, res) => {
  const id = Number(req.params.id);

  const game = await queries.getGameById(id);

  const [developer, genres] = await Promise.all([
    queries.getDeveloperById(game.developer_id),
    queries.getGenresByGameId(game.id),
  ]);

  if (!game) {
    return res
      .status(404)
      .render("404", { title: "Page not found", message: "Game not found" });
  }

  return res.render("deleteGame", {
    title: `Deleting ${game.title}`,
    game,
    developer,
    genres,
  });
};

const postDeleteGame = async (req, res) => {
  const id = Number(req.params.id);

  await queries.deleteGame(id);

  res.redirect("/games");
};

export default {
  getAllGames,
  getGameById,
  getCreateGame,
  postCreateGame,
  getUpdateGame,
  postUpdateGame,
  getDeleteGame,
  postDeleteGame,
};
