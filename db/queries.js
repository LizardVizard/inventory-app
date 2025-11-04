import pool from "./pool.js";

const getAllGames = async () => {
  const { rows } = await pool.query(`SELECT * FROM games;`);
  return rows;
};

const getAllDevelopers = async () => {
  const { rows } = await pool.query(`SELECT * FROM developers WHERE id != 1`);
  return rows;
};

const getAllGenres = async () => {
  const { rows } = await pool.query(`SELECT * FROM genres;`);
  return rows;
};

const getNGenresByGameCount = async (n = 5) => {
  const { rows } = await pool.query(
    `SELECT gn.id, gn.name, COUNT(gmgn.game_id) AS game_count FROM genres AS gn LEFT JOIN game_genres AS gmgn ON gmgn.genre_id=gn.id WHERE gn.id != 1 GROUP BY (gn.id, gn.name) ORDER BY game_count DESC,gn.name LIMIT $1`,
    [n],
  );
  return rows;
};
const getNDevelopersByGameCount = async (n = 5) => {
  const { rows } = await pool.query(
    `SELECT d.id, d.name, COUNT(g.developer_id) AS game_count FROM games AS g RIGHT JOIN developers AS d ON g.developer_id=d.id WHERE d.id != 1 GROUP BY (d.id, d.name) ORDER BY game_count DESC,d.name LIMIT $1`,
    [n],
  );
  return rows;
};
const getNGamesByReleaseYear = async (n = 5) => {
  const { rows } = await pool.query(
    `SELECT * FROM games ORDER BY release_year DESC, title LIMIT $1`,
    [n],
  );
  return rows;
};

const getGenreById = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM genres WHERE id = $1`, [id]);
  return rows[0];
};

const getGamesByGenreId = async (id) => {
  const { rows } = await pool.query(
    `SELECT DISTINCT gm.id, gm.title FROM genres as gn JOIN game_genres as gmgn on gn.id = gmgn.genre_id JOIN games AS gm ON gmgn.game_id = gm.id WHERE gn.id = $1`,
    [id],
  );
  return rows;
};

const getGameById = async (id) => {
  const { rows } = await pool.query(` SELECT * FROM games WHERE id = $1`, [id]);
  return rows[0];
};

const getGenresByGameId = async (id) => {
  // const { rows } = await pool.query(
  //   `SELECT STRING_AGG(gn.name, ', ') AS genres FROM games AS gm JOIN game_genres AS gmgn on gm.id=gmgn.game_id JOIN genres AS gn ON gn.id = gmgn.genre_id WHERE gm.id = $1 GROUP BY gm.title`,
  //   [id],
  // );
  // return rows[0];
  const { rows } = await pool.query(
    `SELECT gn.id, gn.name FROM genres AS gn JOIN game_genres AS gmgn ON gmgn.genre_id = gn.id WHERE gmgn.game_id = $1`,
    [id],
  );
  return rows;
};

const getDeveloperById = async (id) => {
  const { rows } = await pool.query(`SELECT * FROM developers WHERE id = $1`, [
    id,
  ]);
  return rows[0];
};

const getGamesByDeveloperId = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM games WHERE developer_id = $1`,
    [id],
  );
  return rows;
};

const insertGenre = async (name) => {
  const { rows } = await pool.query(
    `INSERT INTO genres (name) VALUES ($1) RETURNING id, name`,
    [name],
  );
  return rows[0];
};

const updateGenre = async (id, name) => {
  const { rows } = await pool.query(`UPDATE genres SET name=$2 WHERE id=$1;`, [
    id,
    name,
  ]);
};

// const getDeveloperByGameId = async (id) => {
//   const { rows } = await pool.query(`SELECT * FROM developers WHERE id = $1`, [
//     id,
//   ]);
//   return rows;
// };

export default {
  getAllGames,
  getAllGenres,
  getAllDevelopers,
  getNGenresByGameCount,
  getNDevelopersByGameCount,
  getNGamesByReleaseYear,
  getGenreById,
  getGamesByGenreId,
  getGameById,
  getGenresByGameId,
  getDeveloperById,
  // getDeveloperByGameId,
  getGamesByDeveloperId,
  insertGenre,
  updateGenre,
};
