import { matchedData, validationResult, body, query } from "express-validator";
import queries from "../db/queries.js";

const validateDeveloper = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Developer name must exist")
    .isLength({ min: 2 })
    .withMessage("Developer name must be at least 2 letters"),

  body("country")
    .optional()
    .trim()
    .isLength({ min: 2 })
    .withMessage("Developer country name must be at least 2 letters"),
];

const getAllDevelopers = async (req, res) => {
  let developers = [];

  developers = await queries.getAllDevelopers();
  res.render("developers", { title: "List of all developers", developers });
};

const getDeveloperById = async (req, res) => {
  const { id } = req.params;
  const developer = await queries.getDeveloperById(id);

  let developerFound = false;
  let games = [];

  if (developer) {
    developerFound = true;
    games = await queries.getGamesByDeveloperId(id);
  }

  res.render("developer", {
    title: `Developer ${developer?.name || "Not found"}`,
    developerFound,
    developer,
    games,
  });
};

const getCreateDeveloper = (req, res) => {
  res.render("createDeveloper", {
    title: "Adding a new developer",
    oldData: {},
  });
};

const postCreateDeveloper = [
  validateDeveloper,
  async (req, res) => {
    const errors = validationResult(req);
    const { name, country } = matchedData(req, { onlyValidData: false });

    if (!errors.isEmpty()) {
      return res.render("createDeveloper", {
        title: "Adding a new developer",
        oldData: { name, country },
        errors: errors.array({ onlyFirstError: true }),
      });
    }

    console.log(name, country);
    const developer = await queries.insertDeveloper(name, country);
    res.redirect(`/developers/${developer.id}`);
    return;
  },
];

const getUpdateDeveloper = async (req, res) => {
  const id = Number(req.params.id);

  const developer = await queries.getDeveloperById(id);
  const games = await queries.getGamesByDeveloperId(id);

  res.render("updateDeveloper", {
    title: `Updating ${developer.name} developer`,
    developer,
    gameCount: games.length,
  });
};

const postUpdateDeveloper = [
  validateDeveloper,
  async (req, res) => {
    const id = Number(req.params.id);
    const { name, country } = matchedData(req, { onlyValidData: false });
    const errors = validationResult(req);

    const developer = { id, name, country };

    if (!errors.isEmpty()) {
      res.render("updateDeveloper", {
        title: `Updating developer`,
        developer,
        errors: errors.array({ onlyFirstError: true }),
      });
      return;
    }

    await queries.updateDeveloper({ ...developer });
    res.redirect(`/developers/${developer.id}`);
  },
];

const getDeleteDeveloper = async (req, res) => {
  const id = Number(req.params.id);

  const [developer, games] = await Promise.all([
    queries.getDeveloperById(id),
    queries.getGamesByDeveloperId(id),
  ]);

  if (!developer) {
    res.status(404).render("404", {
      title: "Page not found",
      message: "Developer not found",
    });
    return;
  }

  res.render("deleteDeveloper", {
    title: `Deleting ${developer.name} developer`,
    developer,
    gameCount: games.length,
  });
};

const postDeleteDeveloper = async (req, res) => {
  const id = Number(req.params.id);

  const [developer, games] = await Promise.all([
    queries.getDeveloperById(id),
    queries.getGamesByDeveloperId(id),
  ]);

  if (games.length > 0) {
    res.render("deleteDeveloper", {
      title: `Deleting ${developer.name} developer`,
      developer,
      gameCount: games.length,
      errors: [{ msg: "Developer must have not games to be deleted" }],
    });
    return;
  }

  await queries.deleteDeveloper(id);
  res.redirect("/developers");
};

export default {
  getAllDevelopers,
  getDeveloperById,
  getCreateDeveloper,
  postCreateDeveloper,
  getUpdateDeveloper,
  postUpdateDeveloper,
  getDeleteDeveloper,
  postDeleteDeveloper,
};
