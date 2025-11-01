import queries from "../db/queries.js";

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

export default { getDeveloperById };
