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
  const { rows } = await pool.query(`SELECT * FROM genres WHERE id != 1;`);
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

const deleteGenre = async (id) => {
  await pool.query(`DELETE FROM genres WHERE id=$1`, [id]);
};

const insertDeveloper = async (name, country = "") => {
  const { rows } = await pool.query(
    `INSERT INTO developers (name, country) VALUES
($1, $2) RETURNING id, name, country;`,
    [name, country],
  );
  return rows[0];
};

const updateDeveloper = async ({ id, name, country }) => {
  await pool.query(`UPDATE developers SET name=$2, country=$3 WHERE id=$1`, [
    id,
    name,
    country,
  ]);
};

const deleteDeveloper = async (id) => {
  await pool.query(`DELETE FROM developers WHERE id=$1`, [id]);
};

const insertGame = async ({ title, developerId, releaseYear }) => {
  const { rows } = await pool.query(
    `INSERT INTO games (title, developer_id, release_year) VALUES ($1, $2, $3) RETURNING id;`,
    [title, developerId, releaseYear],
  );
  return rows[0];
};

const insertGameGenres = async (gameId, genreIdArray) => {
  genreIdArray.forEach(async (genreId) => {
    await pool.query(
      `INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)`,
      [gameId, genreId],
    );
  });
};

const updateGame = async ({ id, title, developerId, releaseYear, genres }) => {
  const client = await pool.connect();
  console.log("UPdate game queri");

  try {
    await client.query("BEGIN");

    const { rows } = await client.query(
      `SELECT EXISTS (SELECT 1 FROM games WHERE id=$1)`,
      [id],
    );

    if (!rows[0].exists) {
      throw new Error(`Game with id ${id} doesn't exist`);
    }

    await client.query(
      `UPDATE games SET title=$2, developer_id=$3, release_year=$4 WHERE id=$1`,
      [id, title, developerId, releaseYear],
    );

    await client.query(`DELETE FROM game_genres WHERE game_id=$1`, [id]);

    if (genres.length > 0) {
      const insertedGenres = genres.map((_, i) => `($1, $${i + 2})`).join(",");
      const insertedValues = [id, ...genres];

      await client.query(
        `INSERT INTO game_genres(game_id,genre_id) VALUES ${insertedGenres}`,
        insertedValues,
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    console.error(error);
    throw error;
  } finally {
    client.release();
  }
};

// const updateGameEntry = async ({ id, title, developerId, releaseYear }) => {
//   await pool.query(
//     `UPDATE FROM games SET title=$2, developer_id=$3, release_year=$4 WHERE id=$1`,
//     [id, title, developerId, releaseYear],
//   );
// };
//
// const updateGameGenres = async ({ gameId, genreIdArray }) => {
//   await pool.query(`DELETE game_genres WHERE game_id=$1`, [gameId]);
//   genreIdArray.forEach(
//     async (genreId) =>
//       await pool.query(
//         `INSERT INTO game_genres (game_id, genre_id) VALUES ($1, $2)`,
//         [gameId, genreId],
//       ),
//   );
// };

// const getDeveloperByGameId = async (id) => {
//   const { rows } = await pool.query(`SELECT * FROM developers WHERE id = $1`, [
//     id,
//   ]);
//   return rows;
// };

export default {
  getAllGames,
  getGameById,
  getGamesByGenreId,
  getGamesByDeveloperId,
  insertGame,
  insertGameGenres,
  updateGame,
  getNGamesByReleaseYear,

  getAllGenres,
  getGenreById,
  getGenresByGameId,
  insertGenre,
  updateGenre,
  deleteGenre,
  getNGenresByGameCount,

  getAllDevelopers,
  getDeveloperById,
  // getDeveloperByGameId,
  insertDeveloper,
  updateDeveloper,
  deleteDeveloper,
  getNDevelopersByGameCount,
};
