import queries from "../db/queries.js";

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

export default { getAllDevelopers, getDeveloperById };
